// ==========================================
// CHECK ADMIN LOGIN
// ==========================================

async function checkAdminAuth() {

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Authentication error:",
            error
        );

        window.location.href =
            "admin-login.html";

        return;
    }


    if (!data.session) {

        window.location.href =
            "admin-login.html";

        return;
    }


    console.log(
        "Admin authenticated."
    );
}


checkAdminAuth();

// ==========================================
// ADMIN DASHBOARD
// ==========================================


// Get elements
const ordersContainer =
    document.getElementById("orders-container");

const totalOrdersElement =
    document.getElementById("total-orders");

const pendingOrdersElement =
    document.getElementById("pending-orders");

const completedOrdersElement =
    document.getElementById("completed-orders");

const totalSalesElement =
    document.getElementById("total-sales");

const refreshButton =
    document.getElementById("refresh-orders");


// ==========================================
// LOAD ORDERS
// ==========================================

async function loadOrders() {

    ordersContainer.innerHTML = `
        <p>
            Loading orders...
        </p>
    `;


    const {
        data: orders,
        error
    } = await supabaseClient

        .from("orders")

        .select(`
            *,
            order_items (
                id,
                product_id,
                product_name,
                quantity,
                price
            )
        `)

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    // ==========================================
    // CHECK ERROR
    // ==========================================

    if (error) {

        console.error(
            "Error loading orders:",
            error
        );

        ordersContainer.innerHTML = `
            <div class="admin-error">

                <h3>
                    Unable to load orders
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>
        `;

        return;
    }


    console.log(
        "Orders:",
        orders
    );


    // ==========================================
    // NO ORDERS
    // ==========================================

    if (!orders || orders.length === 0) {

        ordersContainer.innerHTML = `
            <div class="no-orders">

                <h3>
                    No orders yet
                </h3>

                <p>
                    Customer orders will appear here.
                </p>

            </div>
        `;

        updateStats([]);

        return;
    }


    // ==========================================
    // DISPLAY ORDERS
    // ==========================================

    ordersContainer.innerHTML = "";


    orders.forEach(order => {

        const orderCard =
            document.createElement("div");

        orderCard.className =
            "admin-order-card";


        // Format date
        const orderDate =
            new Date(
                order.created_at
            ).toLocaleString();


        // Order items
        const itemsHTML =
            order.order_items
                .map(item => {

                    return `
                        <div class="admin-order-item">

                            <div>

                                <strong>
                                    ${item.product_name}
                                </strong>

                                <span>
                                    × ${item.quantity}
                                </span>

                            </div>

                            <strong>
                                ₦${
                                    (
                                        Number(item.price) *
                                        Number(item.quantity)
                                    ).toLocaleString()
                                }
                            </strong>

                        </div>
                    `;

                })
                .join("");


        orderCard.innerHTML = `

            <div class="admin-order-header">

                <div>

                    <h3>
                        Order #${order.id}
                    </h3>

                    <p>
                        ${orderDate}
                    </p>

                </div>


                <span
                    class="order-status ${order.status}"
                >
                    ${order.status}
                </span>

            </div>


            <div class="admin-customer">

                <h4>
                    Customer
                </h4>

                <p>
                    <strong>
                        Name:
                    </strong>

                    ${order.customer_name}
                </p>

                <p>
                    <strong>
                        Phone:
                    </strong>

                    ${order.customer_phone}
                </p>

                ${
                    order.customer_email
                        ? `
                            <p>
                                <strong>
                                    Email:
                                </strong>

                                ${order.customer_email}
                            </p>
                          `
                        : ""
                }

                <p>
                    <strong>
                        Address:
                    </strong>

                    ${order.customer_address},
                    ${order.customer_city},
                    ${order.customer_state}
                </p>

            </div>


            <div class="admin-order-products">

                <h4>
                    Products
                </h4>

                ${itemsHTML}

            </div>


            <div class="admin-order-footer">

                <strong>
                    Total:
                    ₦${Number(
                        order.total_amount
                    ).toLocaleString()}
                </strong>


                <select
                    class="order-status-select"
                    data-order-id="${order.id}"
                >

                    <option
                        value="pending"
                        ${
                            order.status === "pending"
                                ? "selected"
                                : ""
                        }
                    >
                        Pending
                    </option>

                    <option
                        value="processing"
                        ${
                            order.status === "processing"
                                ? "selected"
                                : ""
                        }
                    >
                        Processing
                    </option>

                    <option
                        value="shipped"
                        ${
                            order.status === "shipped"
                                ? "selected"
                                : ""
                        }
                    >
                        Shipped
                    </option>

                    <option
                        value="completed"
                        ${
                            order.status === "completed"
                                ? "selected"
                                : ""
                        }
                    >
                        Completed
                    </option>

                    <option
                        value="cancelled"
                        ${
                            order.status === "cancelled"
                                ? "selected"
                                : ""
                        }
                    >
                        Cancelled
                    </option>

                </select>

            </div>

        `;


        ordersContainer.appendChild(
            orderCard
        );

    });


    // ==========================================
    // SETUP STATUS CONTROLS
    // ==========================================

    setupStatusControls();


    // ==========================================
    // UPDATE STATISTICS
    // ==========================================

    updateStats(orders);

}


// ==========================================
// UPDATE DASHBOARD STATS
// ==========================================

function updateStats(orders) {

    const totalOrders =
        orders.length;


    const pendingOrders =
        orders.filter(
            order =>
                order.status === "pending"
        ).length;


    const completedOrders =
        orders.filter(
            order =>
                order.status === "completed"
        ).length;


    const totalSales =
        orders
            .filter(
                order =>
                    order.status !== "cancelled"
            )
            .reduce(
                (total, order) =>
                    total +
                    Number(order.total_amount),
                0
            );


    totalOrdersElement.textContent =
        totalOrders;


    pendingOrdersElement.textContent =
        pendingOrders;


    completedOrdersElement.textContent =
        completedOrders;


    totalSalesElement.textContent =
        `₦${totalSales.toLocaleString()}`;
}


// ==========================================
// CHANGE ORDER STATUS
// ==========================================

function setupStatusControls() {

    const statusSelects =
        document.querySelectorAll(
            ".order-status-select"
        );


    statusSelects.forEach(select => {

        select.addEventListener(
            "change",
            async function () {

                const orderId =
                    Number(
                        this.dataset.orderId
                    );

                const newStatus =
                    this.value;


                console.log(
                    "Updating order:",
                    orderId,
                    newStatus
                );


                const {
                    error
                } = await supabaseClient

                    .from("orders")

                    .update({
                        status: newStatus
                    })

                    .eq(
                        "id",
                        orderId
                    );


                if (error) {

                    console.error(
                        "Status update error:",
                        error
                    );

                    alert(
                        "Unable to update order status."
                    );

                    return;
                }


                console.log(
                    "Order status updated."
                );


                // Reload orders
                loadOrders();

            }
        );

    });
}


// ==========================================
// REFRESH BUTTON
// ==========================================

refreshButton.addEventListener(
    "click",
    loadOrders
);


// ==========================================
// INITIAL LOAD
// ==========================================

loadOrders();

// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById("logout-button");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            const {
                error
            } = await supabaseClient.auth.signOut();


            if (error) {

                console.error(
                    "Logout error:",
                    error
                );

                alert(
                    "Unable to logout."
                );

                return;
            }


            window.location.href =
                "admin-login.html";

        }
    );
}
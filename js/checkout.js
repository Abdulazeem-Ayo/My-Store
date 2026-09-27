let cart =
    JSON.parse(localStorage.getItem("haryobhamhi_cart")) || [];

const checkoutItems =
    document.getElementById("checkout-items");

const checkoutTotal =
    document.getElementById("checkout-total");

const checkoutForm =
    document.getElementById("checkout-form");


// ==========================================
// CHECK IF CART IS EMPTY
// ==========================================

if (cart.length === 0) {

    checkoutItems.innerHTML = `
        <div class="empty-checkout">

            <h3>Your cart is empty</h3>

            <p>
                Add a jersey before checking out.
            </p>

            <a href="index.html#products">
                Continue Shopping
            </a>

        </div>
    `;

    checkoutForm.style.display = "none";
}


// ==========================================
// DISPLAY CHECKOUT ITEMS
// ==========================================

function displayCheckout() {

    if (cart.length === 0) {
        return;
    }

    checkoutItems.innerHTML = "";

    let total = 0;


    cart.forEach(item => {

        const itemPrice =
            Number(item.price);

        const itemQuantity =
            Number(item.quantity);

        const itemTotal =
            itemPrice * itemQuantity;

        total += itemTotal;


        const orderItem =
            document.createElement("div");

        orderItem.className =
            "checkout-item";


        orderItem.innerHTML = `

            <div class="checkout-item-image">

                ${
                    item.image

                        ? `
                            <img
                                src="${item.image}"
                                alt="${item.name}"
                            >
                          `

                        : `
                            <div class="no-image">
                                No Image
                            </div>
                          `
                }

            </div>


            <div class="checkout-item-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    Quantity: ${itemQuantity}
                </p>

                <strong>
                    ₦${itemTotal.toLocaleString()}
                </strong>

            </div>

        `;


        checkoutItems.appendChild(
            orderItem
        );

    });


    checkoutTotal.textContent =
        `₦${total.toLocaleString()}`;
}


// ==========================================
// CHECKOUT FORM SUBMISSION
// ==========================================

checkoutForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ==========================================
        // CHECK CART
        // ==========================================

        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;
        }


        // ==========================================
        // GET CUSTOMER INFORMATION
        // ==========================================

        const customer = {

            name:
                document
                    .getElementById("full-name")
                    .value
                    .trim(),

            phone:
                document
                    .getElementById("phone")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("email")
                    .value
                    .trim(),

            address:
                document
                    .getElementById("address")
                    .value
                    .trim(),

            city:
                document
                    .getElementById("city")
                    .value
                    .trim(),

            state:
                document
                    .getElementById("state")
                    .value
                    .trim()

        };


        console.log(
            "Customer information:",
            customer
        );


        // ==========================================
        // CALCULATE TOTAL
        // ==========================================

        const totalAmount =
            cart.reduce(
                (total, item) => {

                    return total +
                        (
                            Number(item.price) *
                            Number(item.quantity)
                        );

                },
                0
            );


        console.log(
            "Order total:",
            totalAmount
        );


        // ==========================================
        // SUBMIT BUTTON
        // ==========================================

        const submitButton =
            checkoutForm.querySelector(
                "button[type='submit']"
            );


        const originalButtonText =
            submitButton.textContent;


        submitButton.disabled = true;

        submitButton.textContent =
            "Creating Order...";


        try {

            // ==========================================
            // CREATE ORDER
            // ==========================================

            console.log(
                "Creating order..."
            );


            const {
                data: order,
                error: orderError
            } = await supabaseClient

                .from("orders")

                .insert([
                    {

                        customer_name:
                            customer.name,

                        customer_phone:
                            customer.phone,

                        customer_email:
                            customer.email,

                        customer_address:
                            customer.address,

                        customer_city:
                            customer.city,

                        customer_state:
                            customer.state,

                        total_amount:
                            totalAmount,

                        status:
                            "pending"

                    }
                ])

                .select()

                .single();


            // ==========================================
            // CHECK ORDER ERROR
            // ==========================================

            if (orderError) {

                console.error(
                    "ORDER ERROR:",
                    orderError
                );

                throw orderError;
            }


            console.log(
                "Order created successfully:",
                order
            );


            // ==========================================
            // CREATE ORDER ITEMS
            // ==========================================

            const orderItems =
                cart.map(item => {

                    return {

                        order_id:
                            order.id,

                        product_id:
                            item.id,

                        product_name:
                            item.name,

                        quantity:
                            Number(item.quantity),

                        price:
                            Number(item.price)

                    };

                });


            console.log(
                "Order items:",
                orderItems
            );


            // ==========================================
            // SAVE ORDER ITEMS
            // ==========================================

            const {
                data: savedItems,
                error: itemsError
            } = await supabaseClient

                .from("order_items")

                .insert(orderItems)

                .select();


            // ==========================================
            // CHECK ORDER ITEMS ERROR
            // ==========================================

            if (itemsError) {

                console.error(
                    "ORDER ITEMS ERROR:",
                    itemsError
                );

                throw itemsError;
            }


            console.log(
                "Order items saved:",
                savedItems
            );


            // ==========================================
            // SAVE LAST ORDER
            // ==========================================

            localStorage.setItem(
                "haryobhamhi_last_order",
                JSON.stringify({

                    id:
                        order.id,

                    total:
                        totalAmount,

                    items:
                        cart

                })
            );


            // ==========================================
            // CLEAR CART
            // ==========================================

            localStorage.removeItem(
                "haryobhamhi_cart"
            );


            // ==========================================
            // GO TO SUCCESS PAGE
            // ==========================================

            window.location.href =
                "success.html";


        } catch (error) {

            // ==========================================
            // SHOW REAL ERROR
            // ==========================================

            console.error(
                "CHECKOUT ERROR:",
                error
            );


            alert(
                "Checkout Error:\n\n" +
                (
                    error.message ||
                    JSON.stringify(error)
                )
            );


            // ==========================================
            // ENABLE BUTTON AGAIN
            // ==========================================

            submitButton.disabled = false;

            submitButton.textContent =
                originalButtonText;

        }

    }
);


// ==========================================
// DISPLAY CHECKOUT
// ==========================================

displayCheckout();
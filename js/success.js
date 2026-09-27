const orderData =
    JSON.parse(
        localStorage.getItem("haryobhamhi_last_order")
    );

const orderNumber =
    document.getElementById("order-number");

const successItems =
    document.getElementById("success-items");

const successTotal =
    document.getElementById("success-total");


if (!orderData) {

    orderNumber.textContent =
        "Order information is unavailable.";

    successItems.innerHTML = `
        <p>
            Your order was created successfully.
        </p>
    `;

} else {

    // Display order number
    orderNumber.textContent =
        `Order #${orderData.id}`;


    // Display products
    successItems.innerHTML = "";

    orderData.items.forEach(item => {

        const itemElement =
            document.createElement("div");

        itemElement.className =
            "success-item";

        itemElement.innerHTML = `
            <div>
                <strong>
                    ${item.name}
                </strong>

                <p>
                    Quantity: ${item.quantity}
                </p>
            </div>

            <strong>
                ₦${(
                    item.price *
                    item.quantity
                ).toLocaleString()}
            </strong>
        `;

        successItems.appendChild(
            itemElement
        );

    });


    // Display total
    successTotal.textContent =
        `₦${orderData.total.toLocaleString()}`;
}
// =========================
// HARYOBHAMHI CHECKOUT
// =========================

let cart =
    JSON.parse(
        localStorage.getItem(
            "haryobhamhi_cart"
        )
    ) || [];


// =========================
// ELEMENTS
// =========================

const checkoutItems =
    document.getElementById(
        "checkout-items"
    );

const checkoutTotal =
    document.getElementById(
        "checkout-total"
    );

const checkoutForm =
    document.getElementById(
        "checkout-form"
    );


// =========================
// CHECK EMPTY CART
// =========================

if (cart.length === 0) {

    checkoutItems.innerHTML = `

        <div class="empty-checkout">

            <h3>
                Your cart is empty
            </h3>

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


// =========================
// DISPLAY ORDER
// =========================

function displayCheckout() {

    if (cart.length === 0) {
        return;
    }

    checkoutItems.innerHTML = "";

    let total = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price *
            item.quantity;

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
                        : ""
                }

            </div>


            <div class="checkout-item-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    Quantity:
                    ${item.quantity}
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


// =========================
// FORM SUBMISSION
// =========================

checkoutForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const customer = {

            name:
                document.getElementById(
                    "full-name"
                ).value.trim(),

            phone:
                document.getElementById(
                    "phone"
                ).value.trim(),

            email:
                document.getElementById(
                    "email"
                ).value.trim(),

            address:
                document.getElementById(
                    "address"
                ).value.trim(),

            city:
                document.getElementById(
                    "city"
                ).value.trim(),

            state:
                document.getElementById(
                    "state"
                ).value.trim()

        };


        console.log(
            "Customer information:",
            customer
        );


        console.log(
            "Cart:",
            cart
        );


        alert(
            "Customer information received. Payment will be added in the next step."
        );

    }
);


// =========================
// START
// =========================

displayCheckout();
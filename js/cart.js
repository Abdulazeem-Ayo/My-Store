// =========================
// HARYOBHAMHI CART
// =========================

let cart =
    JSON.parse(
        localStorage.getItem(
            "haryobhamhi_cart"
        )
    ) || [];


// =========================
// CART ELEMENTS
// =========================

const cartContainer =
    document.getElementById(
        "cart-container"
    );

const cartSummary =
    document.getElementById(
        "cart-summary"
    );


// =========================
// DISPLAY CART
// =========================

function displayCart() {

    if (!cartContainer) {
        return;
    }


    // Empty cart

    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="empty-cart">

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    You haven't added any jerseys yet.
                </p>

                <a
                    href="index.html#products"
                    class="continue-shopping"
                >
                    Start Shopping
                </a>

            </div>

        `;

        if (cartSummary) {
            cartSummary.innerHTML = "";
        }

        updateCartCount();

        return;
    }


    // Display products

    cartContainer.innerHTML = "";

    cart.forEach(item => {

        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-image">

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


            <div class="cart-item-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₦${item.price.toLocaleString()}
                </p>


                <div class="quantity-controls">

                    <button
                        class="quantity-btn"
                        data-action="decrease"
                        data-id="${item.id}"
                    >
                        −
                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        class="quantity-btn"
                        data-action="increase"
                        data-id="${item.id}"
                    >
                        +
                    </button>

                </div>


                <button
                    class="remove-item"
                    data-id="${item.id}"
                >
                    Remove
                </button>

            </div>


            <div class="cart-item-total">

                ₦${(
                    item.price *
                    item.quantity
                ).toLocaleString()}

            </div>

        `;


        cartContainer.appendChild(
            cartItem
        );

    });


    setupCartControls();

    displayCartSummary();

    updateCartCount();
}


// =========================
// CART CONTROLS
// =========================

function setupCartControls() {

    // Quantity buttons

    const quantityButtons =
        document.querySelectorAll(
            ".quantity-btn"
        );


    quantityButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    Number(
                        button.dataset.id
                    );

                const action =
                    button.dataset.action;


                changeQuantity(
                    id,
                    action
                );

            }
        );

    });


    // Remove buttons

    const removeButtons =
        document.querySelectorAll(
            ".remove-item"
        );


    removeButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    Number(
                        button.dataset.id
                    );

                removeFromCart(id);

            }
        );

    });
}


// =========================
// CHANGE QUANTITY
// =========================

function changeQuantity(
    productId,
    action
) {

    const item =
        cart.find(
            item =>
                item.id === productId
        );


    if (!item) {
        return;
    }


    if (action === "increase") {

        item.quantity += 1;

    }


    if (action === "decrease") {

        item.quantity -= 1;

        if (item.quantity <= 0) {

            cart =
                cart.filter(
                    item =>
                        item.id !== productId
                );

        }

    }


    saveCart();

    displayCart();
}


// =========================
// REMOVE PRODUCT
// =========================

function removeFromCart(
    productId
) {

    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    saveCart();

    displayCart();
}


// =========================
// SAVE CART
// =========================

function saveCart() {

    localStorage.setItem(
        "haryobhamhi_cart",
        JSON.stringify(cart)
    );
}


// =========================
// CART SUMMARY
// =========================

function displayCartSummary() {

    if (!cartSummary) {
        return;
    }


    const subtotal =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                (
                    item.price *
                    item.quantity
                ),

            0
        );


    cartSummary.innerHTML = `

        <h2>
            Order Summary
        </h2>


        <div class="summary-row">

            <span>
                Subtotal
            </span>

            <strong>
                ₦${subtotal.toLocaleString()}
            </strong>

        </div>


        <div class="summary-row">

            <span>
                Delivery
            </span>

            <span>
                Calculated at checkout
            </span>

        </div>


        <div class="summary-total">

            <span>
                Total
            </span>

            <strong>
                ₦${subtotal.toLocaleString()}
            </strong>

        </div>


        <button
            class="checkout-btn"
            onclick="goToCheckout()"
        >
            Proceed to Checkout
        </button>

    `;
}


// =========================
// CART COUNT
// =========================

function updateCartCount() {

    const cartButtons =
        document.querySelectorAll(
            ".cart-btn"
        );


    const totalItems =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                item.quantity,

            0
        );


    cartButtons.forEach(button => {

        button.textContent =
            `Cart (${totalItems})`;

    });
}


// =========================
// CHECKOUT
// =========================

function goToCheckout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    window.location.href =
        "checkout.html";
}


// =========================
// START
// =========================

displayCart();
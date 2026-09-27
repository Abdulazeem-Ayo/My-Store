// =========================
// HARYOBHAMHI STORE
// =========================

// =========================
// WISHLIST
// =========================

let wishlist =
    JSON.parse(
        localStorage.getItem("haryobhamhi_wishlist")
    ) || [];


// =========================
// CART
// =========================

let cart =
    JSON.parse(
        localStorage.getItem("haryobhamhi_cart")
    ) || [];


// =========================
// LOAD PRODUCTS
// =========================

async function loadProducts() {

    const productsContainer =
        document.getElementById("products");

    if (!productsContainer) {
        console.error("Products container not found.");
        return;
    }

    productsContainer.innerHTML =
        "<p>Loading products...</p>";

    const { data, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .order("created_at", {
                ascending: false
            });

    console.log(
        "Products from Supabase:",
        data
    );

    console.log(
        "Supabase error:",
        error
    );

    if (error) {

        console.error(
            "Error loading products:",
            error
        );

        productsContainer.innerHTML =
            "<p>Unable to load products.</p>";

        return;
    }

    if (!data || data.length === 0) {

        productsContainer.innerHTML =
            "<p>No products available yet.</p>";

        return;
    }

    productsContainer.innerHTML = "";


    // =========================
    // CREATE PRODUCT CARDS
    // =========================

    data.forEach(product => {

        const productCard =
            document.createElement("div");

        productCard.className =
            "product-card";

        const isWishlisted =
            wishlist.includes(product.id);


        productCard.innerHTML = `

            <div class="product-image">

                ${
                    product.image
                        ? `
                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >
                          `
                        : `
                            <div class="no-image">
                                No Image
                            </div>
                          `
                }


                <!-- Wishlist -->

                <button
                    class="wishlist-btn ${
                        isWishlisted
                            ? "active"
                            : ""
                    }"
                    data-product-id="${product.id}"
                    aria-label="Add ${product.name} to wishlist"
                >
                    ${
                        isWishlisted
                            ? "♥"
                            : "♡"
                    }
                </button>


                <!-- Badge -->

                ${
                    product.badge
                        ? `
                            <span class="product-badge">
                                ${product.badge}
                            </span>
                          `
                        : ""
                }

            </div>


            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>


                <p>
                    ${product.category}
                </p>


                <strong>
                    ₦${Number(
                        product.price
                    ).toLocaleString()}
                </strong>


                <p>
                    ${
                        product.description ||
                        ""
                    }
                </p>


                <!-- Add To Cart -->

                <button
                    class="add-to-cart"
                    data-product-id="${product.id}"
                >
                    Add to Cart
                </button>

            </div>
        `;


        productsContainer.appendChild(
            productCard
        );

    });


    setupWishlistButtons();

    setupCartButtons();

    updateCartCount();
}


// =========================
// WISHLIST BUTTONS
// =========================

function setupWishlistButtons() {

    const buttons =
        document.querySelectorAll(
            ".wishlist-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const productId =
                    Number(
                        button.dataset.productId
                    );

                toggleWishlist(
                    productId,
                    button
                );

            }
        );

    });
}


// =========================
// TOGGLE WISHLIST
// =========================

function toggleWishlist(
    productId,
    button
) {

    if (wishlist.includes(productId)) {

        wishlist =
            wishlist.filter(
                id => id !== productId
            );

        button.classList.remove(
            "active"
        );

        button.textContent = "♡";

    } else {

        wishlist.push(productId);

        button.classList.add(
            "active"
        );

        button.textContent = "♥";
    }


    localStorage.setItem(
        "haryobhamhi_wishlist",
        JSON.stringify(wishlist)
    );
}


// =========================
// CART BUTTONS
// =========================

function setupCartButtons() {

    const buttons =
        document.querySelectorAll(
            ".add-to-cart"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const productId =
                    Number(
                        button.dataset.productId
                    );

                await addToCart(
                    productId,
                    button
                );

            }
        );

    });
}


// =========================
// ADD PRODUCT TO CART
// =========================

async function addToCart(
    productId,
    button
) {

    const {
        data: product,
        error
    } = await supabaseClient
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();


    if (error) {

        console.error(
            "Error getting product:",
            error
        );

        return;
    }


    const existingItem =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: Number(
                product.price
            ),

            image: product.image,

            quantity: 1

        });

    }


    // Save cart

    localStorage.setItem(
        "haryobhamhi_cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    // Button feedback

    const originalText =
        button.textContent;

    button.textContent =
        "Added ✓";

    setTimeout(() => {

        button.textContent =
            originalText;

    }, 1500);


    console.log(
        "Cart:",
        cart
    );
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
// START STORE
// =========================

loadProducts();
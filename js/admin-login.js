// ==========================================
// ADMIN LOGIN
// ==========================================

const loginForm =
    document.getElementById("admin-login-form");

const loginMessage =
    document.getElementById("login-message");


// ==========================================
// CHECK IF ALREADY LOGGED IN
// ==========================================

async function checkExistingSession() {

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Session error:",
            error
        );

        return;
    }


    if (data.session) {

        window.location.href =
            "admin.html";
    }
}


checkExistingSession();


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById("admin-email")
                .value
                .trim();


        const password =
            document
                .getElementById("admin-password")
                .value;


        // Disable button
        const loginButton =
            loginForm.querySelector(
                "button[type='submit']"
            );


        const originalText =
            loginButton.textContent;


        loginButton.disabled = true;

        loginButton.textContent =
            "Logging in...";


        loginMessage.textContent =
            "";


        try {

            // ==========================================
            // SUPABASE LOGIN
            // ==========================================

            const {
                data,
                error
            } = await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


            if (error) {

                console.error(
                    "Login error:",
                    error
                );

                throw error;
            }


            console.log(
                "Login successful:",
                data
            );


            // ==========================================
            // GO TO ADMIN DASHBOARD
            // ==========================================

            window.location.href =
                "admin.html";


        } catch (error) {

            console.error(
                "Admin login error:",
                error
            );


            loginMessage.textContent =
                error.message ||
                "Unable to login.";


            loginMessage.style.color =
                "red";


            loginButton.disabled =
                false;


            loginButton.textContent =
                originalText;

        }

    }
);
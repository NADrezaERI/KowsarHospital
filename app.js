const supabaseClient = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
);


// ============================================================
// ELEMENTS
// ============================================================

const loginForm =
    document.getElementById("login-form");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("login-button");

const loginError =
    document.getElementById("login-error");


// ============================================================
// ERROR
// ============================================================

function showError(element, message) {

    element.textContent = message;

    element.hidden = false;
}


function clearError(element) {

    element.textContent = "";

    element.hidden = true;
}


// ============================================================
// LOGIN
// ============================================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        clearError(loginError);


        loginButton.disabled = true;

        loginButton.textContent =
            "در حال ورود...";


        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        // ------------------------------------------------------
        // Validation
        // ------------------------------------------------------

        if (!username || !password) {

            showError(
                loginError,
                "لطفاً نام کاربری و رمز عبور را وارد کنید."
            );


            loginButton.disabled = false;

            loginButton.textContent =
                "ورود";

            return;
        }


        /*
          Users were created in Supabase using:

          username@scoresheet.local
        */

        const email =
            `${username}@scoresheet.local`;


        try {

            console.log(
                "Attempting login:",
                email
            );


            const {
                data,
                error
            } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,

                    password: password

                });


            if (error) {

                console.error(
                    "Login error:",
                    error
                );


                showError(
                    loginError,
                    "نام کاربری یا رمز عبور اشتباه است."
                );


                return;
            }


            if (
                !data ||
                !data.user
            ) {

                showError(
                    loginError,
                    "ورود انجام نشد. لطفاً دوباره تلاش کنید."
                );


                return;
            }


            console.log(
                "Login successful:",
                data.user
            );


            /*
              Authentication succeeded.

              Now go to the completely separate
              dashboard page.
            */

            window.location.href =
                "dashboard.html";


        } catch (error) {

            console.error(
                "Application error:",
                error
            );


            showError(
                loginError,
                "خطایی رخ داد. لطفاً دوباره تلاش کنید."
            );


        } finally {

            loginButton.disabled = false;

            loginButton.textContent =
                "ورود";

        }

    }
);
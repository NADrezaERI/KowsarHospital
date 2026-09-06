// ============================================================
// CREATE SUPABASE CLIENT
// ============================================================

const supabaseClient = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
);



// ============================================================
// DASHBOARD ELEMENTS
// ============================================================

const welcome = document.getElementById("welcome");

const logoutButton =
    document.getElementById("logout-button");

const dashboardError =
    document.getElementById("dashboard-error");

const cardsContainer =
    document.getElementById("cards-container");



// ============================================================
// PASSWORD MODAL ELEMENTS
// ============================================================

const changePasswordButton =
    document.getElementById("change-password-button");

const passwordModal =
    document.getElementById("password-modal");

const passwordModalClose =
    document.getElementById("password-modal-close");

const cancelPasswordButton =
    document.getElementById("cancel-password-button");

const changePasswordForm =
    document.getElementById("change-password-form");

const newPasswordInput =
    document.getElementById("new-password");

const confirmPasswordInput =
    document.getElementById("confirm-password");

const savePasswordButton =
    document.getElementById("save-password-button");

const passwordError =
    document.getElementById("password-error");

const passwordSuccess =
    document.getElementById("password-success");

const toggleNewPassword =
    document.getElementById("toggle-new-password");

const toggleConfirmPassword =
    document.getElementById("toggle-confirm-password");



// ============================================================
// GENERAL MESSAGE FUNCTIONS
// ============================================================

function showError(element, message) {

    element.textContent = message;
    element.hidden = false;

}


function clearError(element) {

    element.textContent = "";
    element.hidden = true;

}


function showSuccess(element, message) {

    element.textContent = message;
    element.hidden = false;

}


function clearSuccess(element) {

    element.textContent = "";
    element.hidden = true;

}



// ============================================================
// LOAD USER PROFILE
// ============================================================

async function loadProfile(user) {

    console.log("Loading profile...");


    const { data, error } =
        await supabaseClient
            .from("profiles")
            .select("id, username, name")
            .eq("id", user.id)
            .single();


    console.log("Profile:", data, error);


    if (error) {

        throw new Error(
            "پروفایل کاربر قابل بارگذاری نیست."
        );

    }


    if (!data) {

        throw new Error(
            "اطلاعات پروفایل شما پیدا نشد."
        );

    }


    return data;

}



// ============================================================
// LOAD USER DOCUMENTS
// ============================================================

async function loadDocuments(userId) {

    console.log("Loading documents...");


    const { data, error } =
        await supabaseClient
            .from("user_documents")
            .select("id, title, pdf_url")
            .eq("user_id", userId)
            .order("id", {
                ascending: true
            });


    console.log("Documents:", data, error);


    if (error) {

        throw new Error(
            "کارنامه‌های شما قابل بارگذاری نیستند."
        );

    }


    return data || [];

}



// ============================================================
// CREATE DOCUMENT CARD
// ============================================================

function createDocumentCard(documentData) {

    const card =
        document.createElement("article");

    card.className = "document-card";



    // Document icon

    const icon =
        document.createElement("div");

    icon.className = "document-icon";

    icon.textContent = "📄";



    // Content

    const content =
        document.createElement("div");

    content.className = "document-content";



    const title =
        document.createElement("h3");

    title.className = "document-title";

    title.textContent =
        documentData.title || "کارنامه";



    const description =
        document.createElement("p");

    description.className =
        "document-description";

    description.textContent =
        "برای مشاهده کارنامه کلیک کنید";



    content.appendChild(title);

    content.appendChild(description);



    // View button

    const button =
        document.createElement("a");

    button.className = "document-button";

    button.href = documentData.pdf_url;

    button.target = "_blank";

    button.rel = "noopener noreferrer";


    button.innerHTML = `
        <span>مشاهده کارنامه</span>
        <span class="arrow">←</span>
    `;



    card.appendChild(icon);

    card.appendChild(content);

    card.appendChild(button);


    return card;

}



// ============================================================
// DISPLAY DOCUMENTS
// ============================================================

function displayDocuments(documents) {

    cardsContainer.innerHTML = "";


    if (!documents || documents.length === 0) {

        cardsContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📄
                </div>

                <h3>
                    هنوز کارنامه‌ای ثبت نشده است
                </h3>

                <p>
                    کارنامه‌های شما پس از ثبت
                    در این قسمت نمایش داده می‌شوند.
                </p>

            </div>

        `;


        return;

    }



    documents.forEach(function (documentData) {

        const card =
            createDocumentCard(documentData);

        cardsContainer.appendChild(card);

    });

}



// ============================================================
// PASSWORD MODAL
// ============================================================

function openPasswordModal() {

    clearError(passwordError);

    clearSuccess(passwordSuccess);


    newPasswordInput.value = "";

    confirmPasswordInput.value = "";


    newPasswordInput.type = "password";

    confirmPasswordInput.type = "password";


    toggleNewPassword.textContent = "👁";

    toggleConfirmPassword.textContent = "👁";


    passwordModal.hidden = false;


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(function () {

        newPasswordInput.focus();

    }, 100);

}



function closePasswordModal() {

    passwordModal.hidden = true;


    document.body.classList.remove(
        "modal-open"
    );


    clearError(passwordError);

    clearSuccess(passwordSuccess);


    newPasswordInput.value = "";

    confirmPasswordInput.value = "";

}



// ============================================================
// OPEN PASSWORD MODAL
// ============================================================

changePasswordButton.addEventListener(
    "click",
    function () {

        openPasswordModal();

    }
);



// ============================================================
// CLOSE PASSWORD MODAL
// ============================================================

passwordModalClose.addEventListener(
    "click",
    function () {

        closePasswordModal();

    }
);


cancelPasswordButton.addEventListener(
    "click",
    function () {

        closePasswordModal();

    }
);



// ============================================================
// CLOSE MODAL BY CLICKING BACKGROUND
// ============================================================

passwordModal.addEventListener(
    "click",
    function (event) {

        if (event.target === passwordModal) {

            closePasswordModal();

        }

    }
);



// ============================================================
// CLOSE MODAL USING ESC KEY
// ============================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            !passwordModal.hidden
        ) {

            closePasswordModal();

        }

    }
);



// ============================================================
// PASSWORD VISIBILITY
// ============================================================

function togglePasswordVisibility(
    input,
    button
) {

    if (input.type === "password") {

        input.type = "text";

      //  button.textContent = "🙈";

        button.setAttribute(
            "aria-label",
            "مخفی کردن رمز عبور"
        );

    } else {

        input.type = "password";

        button.textContent = "👁";

        button.setAttribute(
            "aria-label",
            "نمایش رمز عبور"
        );

    }

}



toggleNewPassword.addEventListener(
    "click",
    function () {

        togglePasswordVisibility(
            newPasswordInput,
            toggleNewPassword
        );

    }
);



toggleConfirmPassword.addEventListener(
    "click",
    function () {

        togglePasswordVisibility(
            confirmPasswordInput,
            toggleConfirmPassword
        );

    }
);



// ============================================================
// CHANGE PASSWORD
// ============================================================

changePasswordForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        clearError(passwordError);

        clearSuccess(passwordSuccess);



        const newPassword =
            newPasswordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;



        // ----------------------------------------------------
        // Validate empty password
        // ----------------------------------------------------

        if (!newPassword || !confirmPassword) {

            showError(
                passwordError,
                "لطفاً هر دو قسمت رمز عبور را تکمیل کنید."
            );

            return;

        }



        // ----------------------------------------------------
        // Minimum password length
        // ----------------------------------------------------

        if (newPassword.length < 6) {

            showError(
                passwordError,
                "رمز عبور باید حداقل ۶ کاراکتر داشته باشد."
            );

            newPasswordInput.focus();

            return;

        }



        // ----------------------------------------------------
        // Password confirmation
        // ----------------------------------------------------

        if (
            newPassword !==
            confirmPassword
        ) {

            showError(
                passwordError,
                "رمز عبور و تکرار آن یکسان نیستند."
            );

            confirmPasswordInput.focus();

            return;

        }



        // ----------------------------------------------------
        // Disable button
        // ----------------------------------------------------

        savePasswordButton.disabled = true;


        const originalButtonText =
            savePasswordButton.innerHTML;


        savePasswordButton.innerHTML = `

            <span class="button-loading-spinner"></span>

            <span>
                در حال ذخیره...
            </span>

        `;



        try {

            // Check session first

            const {
                data: {
                    session
                }
            } =
                await supabaseClient
                    .auth
                    .getSession();



            if (!session) {

                showError(
                    passwordError,
                    "نشست شما منقضی شده است. لطفاً دوباره وارد شوید."
                );


                setTimeout(function () {

                    window.location.href =
                        "index.html";

                }, 1800);


                return;

            }



            // Change password

            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .updateUser({

                        password:
                            newPassword

                    });



            if (error) {

                console.error(
                    "Password update error:",
                    error
                );


                // Supabase sometimes returns
                // password-specific errors.

                if (
                    error.message &&
                    error.message
                        .toLowerCase()
                        .includes("same password")
                ) {

                    showError(
                        passwordError,
                        "رمز عبور جدید نباید با رمز عبور فعلی یکسان باشد."
                    );

                } else if (
                    error.message &&
                    error.message
                        .toLowerCase()
                        .includes("password")
                ) {

                    showError(
                        passwordError,
                        "رمز عبور انتخاب‌شده مورد قبول نیست. لطفاً رمز دیگری انتخاب کنید."
                    );

                } else {

                    showError(
                        passwordError,
                        "تغییر رمز عبور انجام نشد. لطفاً دوباره تلاش کنید."
                    );

                }


                return;

            }



            console.log(
                "Password changed successfully:",
                data
            );



            // Success

            showSuccess(
                passwordSuccess,
                "رمز عبور شما با موفقیت تغییر کرد."
            );


            newPasswordInput.value = "";

            confirmPasswordInput.value = "";



            // Close modal after success

            setTimeout(function () {

                closePasswordModal();

            }, 1800);


        } catch (error) {

            console.error(
                "Unexpected password change error:",
                error
            );


            showError(
                passwordError,
                "خطایی رخ داد. لطفاً دوباره تلاش کنید."
            );


        } finally {

            savePasswordButton.disabled = false;

            savePasswordButton.innerHTML =
                originalButtonText;

        }

    }
);



// ============================================================
// LOGOUT
// ============================================================

logoutButton.addEventListener(
    "click",
    async function () {

        logoutButton.disabled = true;

        logoutButton.innerHTML = `
            <span class="button-loading-spinner"></span>
            <span>در حال خروج...</span>
        `;


        try {

            await supabaseClient
                .auth
                .signOut();

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        } finally {

            window.location.href =
                "index.html";

        }

    }
);



// ============================================================
// LOAD DASHBOARD
// ============================================================

async function loadDashboard() {

    try {

        clearError(dashboardError);


        console.log(
            "Checking session..."
        );



        const {
            data: {
                session
            },
            error:
                sessionError
        } =
            await supabaseClient
                .auth
                .getSession();



        if (sessionError) {

            console.error(
                "Session error:",
                sessionError
            );

        }



        console.log(
            "Session:",
            session
        );



        // ----------------------------------------------------
        // No session
        // ----------------------------------------------------

        if (!session) {

            window.location.href =
                "index.html";

            return;

        }



        // ----------------------------------------------------
        // Load profile
        // ----------------------------------------------------

        const profile =
            await loadProfile(
                session.user
            );



        if (
            profile.name &&
            profile.name.trim() !== ""
        ) {

            welcome.textContent =
                `سلام ${profile.name}`;

        } else {

            welcome.textContent =
                `سلام ${profile.username}`;

        }



        // ----------------------------------------------------
        // Load documents
        // ----------------------------------------------------

        const documents =
            await loadDocuments(
                session.user.id
            );


        displayDocuments(
            documents
        );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        cardsContainer.innerHTML = `
            <div class="empty-state error-state">
                <div class="empty-icon">⚠️</div>
                <h3>خطا در بارگذاری اطلاعات</h3>
                <p>
                    لطفاً صفحه را دوباره بارگذاری کنید.
                </p>
            </div>
        `;


        showError(
            dashboardError,
            error.message ||
            "خطا در بارگذاری اطلاعات."
        );

    }

}



// ============================================================
// START APPLICATION
// ============================================================

loadDashboard();
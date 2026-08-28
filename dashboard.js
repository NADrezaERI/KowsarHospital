const supabaseClient = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
);


// ============================================================
// ELEMENTS
// ============================================================

const welcome =
    document.getElementById("welcome");

const logoutButton =
    document.getElementById("logout-button");

const dashboardError =
    document.getElementById("dashboard-error");

const cardsContainer =
    document.getElementById("cards-container");


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
// LOAD PROFILE
// ============================================================

async function loadProfile(user) {

    console.log(
        "Loading profile..."
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "id, username, name"
            )
            .eq(
                "id",
                user.id
            )
            .single();


    console.log(
        "Profile:",
        data,
        error
    );


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
// LOAD DOCUMENTS
// ============================================================

async function loadDocuments(userId) {

    console.log(
        "Loading documents..."
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .from("user_documents")
            .select(
                "id, title, pdf_url"
            )
            .eq(
                "user_id",
                userId
            )
            .order(
                "id",
                {
                    ascending: true
                }
            );


    console.log(
        "Documents:",
        data,
        error
    );


    if (error) {

        throw new Error(
            "کارنامه‌های شما قابل بارگذاری نیستند."
        );
    }


    return data || [];
}


// ============================================================
// CREATE CARD
// ============================================================

function createDocumentCard(documentData) {


    const card =
        document.createElement("article");

    card.className =
        "document-card";


    // ----------------------------------------------------------
    // Icon
    // ----------------------------------------------------------

    const icon =
        document.createElement("div");

    icon.className =
        "document-icon";

    icon.textContent =
        "📄";


    // ----------------------------------------------------------
    // Content
    // ----------------------------------------------------------

    const content =
        document.createElement("div");

    content.className =
        "document-content";


    const title =
        document.createElement("h3");

    title.className =
        "document-title";

    title.textContent =
        documentData.title;


    const description =
        document.createElement("p");

    description.className =
        "document-description";

    description.textContent =
        "برای مشاهده کارنامه کلیک کنید";


    content.appendChild(title);

    content.appendChild(description);


    // ----------------------------------------------------------
    // Button
    // ----------------------------------------------------------

    const button =
        document.createElement("a");

    button.className =
        "document-button";

    button.href =
        documentData.pdf_url;

    button.target =
        "_blank";

    button.rel =
        "noopener noreferrer";


    button.innerHTML = `

        <span>
            مشاهده کارنامه
        </span>

        <span class="arrow">
            ←
        </span>

    `;


    // ----------------------------------------------------------
    // Assemble
    // ----------------------------------------------------------

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


    if (
        !documents ||
        documents.length === 0
    ) {

        cardsContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📄
                </div>

                <h3>
                    هنوز کارنامه‌ای ثبت نشده است
                </h3>

                <p>
                    کارنامه‌های شما پس از ثبت در این قسمت نمایش داده می‌شوند.
                </p>

            </div>

        `;

        return;
    }


    documents.forEach(
        function (documentData) {

            const card =
                createDocumentCard(
                    documentData
                );


            cardsContainer.appendChild(
                card
            );

        }
    );
}


// ============================================================
// LOAD DASHBOARD
// ============================================================

async function loadDashboard() {

    try {

        clearError(
            dashboardError
        );


        // ------------------------------------------------------
        // Check session
        // ------------------------------------------------------

        console.log(
            "Checking session..."
        );


        const {
            data: {
                session
            }
        } =
            await supabaseClient.auth.getSession();


        console.log(
            "Session:",
            session
        );


        /*
          No logged-in user.

          Return to login page.
        */

        if (!session) {

            window.location.href =
                "index.html";

            return;
        }


        // ------------------------------------------------------
        // Profile
        // ------------------------------------------------------

        const profile =
            await loadProfile(
                session.user
            );


        welcome.textContent =
            `سلام ${profile.name}`;


        // ------------------------------------------------------
        // Documents
        // ------------------------------------------------------

        const documents =
            await loadDocuments(
                session.user.id
            );


        // ------------------------------------------------------
        // Cards
        // ------------------------------------------------------

        displayDocuments(
            documents
        );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        showError(
            dashboardError,
            error.message ||
            "خطا در بارگذاری اطلاعات."
        );

    }

}


// ============================================================
// LOGOUT
// ============================================================

logoutButton.addEventListener(
    "click",
    async function () {

        logoutButton.disabled =
            true;

        logoutButton.textContent =
            "در حال خروج...";


        try {

            await supabaseClient.auth.signOut();


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
// START
// ============================================================

loadDashboard();
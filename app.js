const supabaseClient = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);

const loginView = document.getElementById("login-view");
const dashboardView = document.getElementById("dashboard-view");

const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const loginError = document.getElementById("login-error");

const welcome = document.getElementById("welcome");
const viewPdfButton = document.getElementById("view-pdf-button");
const logoutButton = document.getElementById("logout-button");
const dashboardError = document.getElementById("dashboard-error");


function showError(element, message) {
  element.textContent = message;
  element.hidden = false;
}


function clearError(element) {
  element.textContent = "";
  element.hidden = true;
}


function showDashboard(profile) {
  loginView.hidden = true;
  dashboardView.hidden = false;

  welcome.textContent = `Welcome, ${profile.name}`;

  viewPdfButton.onclick = function () {
    window.open(
      profile.pdf_url,
      "_blank",
      "noopener,noreferrer"
    );
  };
}


function showLogin() {
  dashboardView.hidden = true;
  loginView.hidden = false;
}


async function loadProfile(user) {

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("username, name, pdf_url")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Profile error:", error);
    throw new Error(
      "Your account was found, but your profile could not be loaded."
    );
  }

  if (!data) {
    throw new Error(
      "Your account is valid, but your score sheet profile has not been configured yet."
    );
  }

  return data;
}


loginForm.addEventListener("submit", async function (event) {

  event.preventDefault();

  clearError(loginError);
  clearError(dashboardError);

  loginButton.disabled = true;
  loginButton.textContent = "Signing in…";

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showError(
      loginError,
      "Please enter your username and password."
    );

    loginButton.disabled = false;
    loginButton.textContent = "Sign in";

    return;
  }

  /*
    The website uses the username entered by the user.

    Supabase Auth requires an email-style identifier,
    so we create an internal email from the username.

    This MUST match the email address used when
    creating the user in Supabase Authentication.
  */

  const email = `${username}@scoresheet.local`;

  try {

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

    if (error) {

      console.error("Login error:", error);

      showError(
        loginError,
        "Incorrect username or password."
      );

      return;
    }

    if (!data || !data.user) {

      showError(
        loginError,
        "Login failed. Please try again."
      );

      return;
    }

    const profile = await loadProfile(data.user);

    showDashboard(profile);

  } catch (error) {

    console.error("Application error:", error);

    showError(
      loginError,
      error.message || "Something went wrong. Please try again."
    );

  } finally {

    loginButton.disabled = false;
    loginButton.textContent = "Sign in";
  }

});


logoutButton.addEventListener("click", async function () {

  await supabaseClient.auth.signOut();

  passwordInput.value = "";

  clearError(loginError);
  clearError(dashboardError);

  showLogin();

});


async function init() {

  /*
    Make sure config.js has been configured.
  */

  if (
    !window.SUPABASE_URL ||
    !window.SUPABASE_ANON_KEY ||
    window.SUPABASE_URL.startsWith("YOUR_") ||
    window.SUPABASE_ANON_KEY.startsWith("YOUR_")
  ) {

    showError(
      loginError,
      "The application is not connected to Supabase yet. Please check config.js."
    );

    return;
  }


  try {

    const {
      data: { session }
    } = await supabaseClient.auth.getSession();


    if (!session) {
      return;
    }


    const profile = await loadProfile(session.user);

    showDashboard(profile);

  } catch (error) {

    console.error("Session error:", error);

    await supabaseClient.auth.signOut();

    showLogin();

    showError(
      loginError,
      error.message || "Unable to restore your session."
    );
  }
}


/*
  Start the application.
*/

init();
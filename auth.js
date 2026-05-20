const client = new Appwrite.Client();

client
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("696f9104001dfedc5e1a");

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);

const DATABASE_ID = "6970722d00269d80304f";
const WALLET_COLLECTION_ID = "wallet";

const status = document.getElementById("status");

// ================= UI SWITCH =================
function showLogin() {
  document.getElementById("loginSection").classList.remove("hidden");
  document.getElementById("registerSection").classList.add("hidden");
  status.innerText = "";
}

function showRegister() {
  document.getElementById("registerSection").classList.remove("hidden");
  document.getElementById("loginSection").classList.add("hidden");
  status.innerText = "";
}

// ================= LOGIN =================
document.getElementById("loginBtn").onclick = async function () {

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {

    if (!email || !password) {
      status.innerText = "Enter login details";
      return;
    }

    // DELETE OLD SESSION IF EXISTS
    try {
      await account.deleteSession("current");
    } catch (e) {}

    // CREATE NEW SESSION
    await account.createEmailSession(email, password);

    // REDIRECT
    window.location.href = "dashboard.html";

  } catch (err) {
    status.innerText = err.message;
  }
};

// ================= REGISTER =================
document.getElementById("registerBtn").onclick = async function () {

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const country = document.getElementById("country").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;

  try {

    if (!name || !email || !country || !phone || !password) {
      status.innerText = "Fill all fields";
      return;
    }

    // DELETE OLD SESSION IF EXISTS
    try {
      await account.deleteSession("current");
    } catch (e) {}

    // CREATE ACCOUNT
    const user = await account.create(
      Appwrite.ID.unique(),
      email,
      password,
      name
    );

    // LOGIN USER
    await account.createEmailSession(email, password);

    // CREATE USER WALLET
    await databases.createDocument(
      DATABASE_ID,
      WALLET_COLLECTION_ID,
      Appwrite.ID.unique(),
      {
        userId: user.$id,
        balance: 30,
        country: country,
        phone: phone,
        createdAt: new Date().toISOString()
      }
    );

    // REDIRECT
    window.location.href = "dashboard.html";

  } catch (err) {
    status.innerText = err.message;
  }
};
const client = new Appwrite.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("YOUR_PROJECT_ID");

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);

const DATABASE_ID = "YOUR_DATABASE_ID";
const WALLET_COLLECTION_ID = "WALLET_COLLECTION_ID";

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

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {

    if (!email || !password) {
      status.innerText = "Enter login details";
      return;
    }

    await account.createEmailSession(email, password);

    window.location.href = "dashboard.html";

  } catch (err) {
    status.innerText = err.message;
  }
};

// ================= REGISTER =================
document.getElementById("registerBtn").onclick = async function () {

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const country = document.getElementById("country").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  try {

    if (!name || !email || !country || !phone || !password) {
      status.innerText = "Fill all fields";
      return;
    }

    // 1. CREATE ACCOUNT
    const user = await account.create(
      Appwrite.ID.unique(),
      email,
      password,
      name
    );

    // 2. LOGIN USER
    await account.createEmailSession(email, password);

    // 3. AUTO CREATE WALLET
    await databases.createDocument(
      DATABASE_ID,
      WALLET_COLLECTION_ID,
      Appwrite.ID.unique(),
      {
        userId: user.$id,
        balance: 200,
        locked: 0,
        country: country,
        phone: phone,
        createdAt: new Date().toISOString()
      }
    );

    window.location.href = "dashboard.html";

  } catch (err) {
    status.innerText = err.message;
  }
};
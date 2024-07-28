import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpInRomfeVWZ6yT5DJWn7k57jXJ5Md8yM",
  authDomain: "hns-guidance.firebaseapp.com",
  projectId: "hns-guidance",
  storageBucket: "hns-guidance.appspot.com",
  messagingSenderId: "70167336621",
  appId: "1:70167336621:web:4761e175c44282aa2e1824",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ----------Auth

const auth = getAuth(app);

// ---------Error fx used by both login and create
function showLoginError(context, errorMessage) {
  let prevError, id, target;
  if (context === "create") {
    prevError = document.getElementById("create_user_errorMessage");
    id = "create_user_errorMessage";
    target = create_user;
  }
  if (context === "login") {
    prevError = document.getElementById("login_user_errorMessage");
    id = "login_user_errorMessage";
    target = login_user;
  }
  if (prevError) {
    prevError.innerText = errorMessage;
    return;
  }
  let p = document.createElement("p");
  let div = document.createElement("div");
  p.id = id;
  p.innerText = errorMessage;
  p.style.textAlign = "right";
  div.appendChild(p);
  div.style.gridColumn = "1/span 2";
  target.appendChild(div);
  return;
}
//#region Create User
// ----------Create a new user
async function createNewUser() {
  const email = createUser_emailUserName.value;
  const password = createUser_password.value;
  if (email && password) {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        create_user.style.display = "none";
        login_user.style.display = "none";
        const p = document.createElement("p");
        p.innerText = "New user successfully created";
        const main = document.querySelector("main");
        const div = document.createElement("div");
        main.appendChild(p);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        showLoginError("create", errorMessage);
      });
  }
}

document
  .getElementById("createUser_btn")
  .addEventListener("click", createNewUser);

// -----------Log in existing user
async function loginUser() {
  const email = loginUser_emailUserName.value;
  const password = loginUser_password.value;
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      create_user.style.display = "none";
      login_user.style.display = "none";
      const p = document.createElement("p");
      p.innerText = "Successful login";
      const main = document.querySelector("main");
      const div = document.createElement("div");
      main.appendChild(p);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      showLoginError("login", errorMessage);
    });
}
document.getElementById("loginUser_btn").addEventListener("click", loginUser);

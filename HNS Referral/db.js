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
function showLogInResult(context, message, success) {
  let prevError, id, target;
  if (success === 1) {
    target = log_in_modal;
    create_user.style.display = "none";
    login_user.style.display = "none";
    log_in_btn.style.display = "none";
    const span = guidance_text.querySelector("span");
    span.innerText = "";
  } else {
    if (context === "create") {
      prevError = document.getElementById("create_user_message");
      id = "create_user_message";
      target = create_user;
    }
    if (context === "login") {
      prevError = document.getElementById("login_user_message");
      id = "login_user_message";
      target = login_user;
    }
    if (prevError) {
      prevError.innerText = message;
      return;
    }
  }
  let p = document.createElement("p");
  let div = document.createElement("div");
  p.id = id;
  p.innerText = message;
  p.style.textAlign = "right";
  div.appendChild(p);
  div.style.gridColumn = "1/span 2";
  target.appendChild(div);
}
//#region Create User
// ----------Create a new user
async function createNewUser() {
  const email = createUser_emailUserName.value;
  const password = createUser_password.value;
  let message;
  let success;
  if (email && password) {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        message = "New user successfully created";
        success = 1;
      })
      .catch((error) => {
        const errorCode = error.code;
        message = error.message;
      });
    showLogInResult("create", message, success);
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
      message = "Successful login";
      success = 1;
    })
    .catch((error) => {
      const errorCode = error.code;
      const message = error.message;
    });
  showLogInResult("login", message, success);
}
document.getElementById("loginUser_btn").addEventListener("click", loginUser);

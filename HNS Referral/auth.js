import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "./node_modules/firebase/auth";

import { db, app } from "./db";
import { populateAdminSection } from "./adminSection";
import { doc } from "firebase/firestore";

export const auth = getAuth(app);

export async function loginUser(event) {
  event.preventDefault();
  const email = loginUser_emailUserName.value;
  const password = loginUser_password.value;
  if (email && password) {
    let message, success;
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        message = "Successful login";
        success = 1;
      })
      .catch((error) => {
        message = error.message;
      });
    showLogInResult(message, success);
  }
  if (!email) {
    let message = "Email is blank";
    showLogInResult(message);
    loginUser_emailUserName.focus();
    return;
  }
  if (!password) {
    let message = "Password is blank";
    showLogInResult(message);
    loginUser_password.focus();
  }
}

function openAdminBtnRightHereFunction(event) {
  event.preventDefault();
  log_in_modal.hidePopover();
  admin_popover.showPopover();

  admin_button.addEventListener("click", openAdminBtnRightHereFunction);
}

export function showLogInResult(message, success) {
  let prevError, id, target;
  const openAdminBtnRightHere = document.createElement("button");
  if (success === 1) {
    target = log_in_modal;
    login_user.style.display = "none";
    const adminModal = document.getElementById("admin-popover");
    admin_button.popoverTargetElement = adminModal;
    admin_button.removeEventListener("click", loginUser);
    admin_button.innerText = "Open Admin Panel";
    admin_button.addEventListener("click", populateAdminSection);
    id = "login_user_success";
    openAdminBtnRightHere.innerText = "Open Admin Panel";
    openAdminBtnRightHere.classList.add("btn-yellow-hover");
    openAdminBtnRightHere.addEventListener(
      "click",
      openAdminBtnRightHereFunction
    );
  } else {
    prevError = document.getElementById("login_user_message");
    id = "login_user_message";
    target = login_user;
    if (prevError) {
      prevError.innerText = message;
      return;
    }
  }
  let p = document.createElement("p");
  let div = document.createElement("div");
  p.id = id;
  p.innerText = message;
  if (success !== 1) {
    p.style.textAlign = "right";
  } else {
    p.style.textAlign = "center";
    div.style.marginBlockEnd = "5px";
  }
  div.appendChild(p);
  div.style.gridColumn = "1/span 2";
  target.appendChild(div);
  if (success === 1) {
    target.appendChild(openAdminBtnRightHere);
    openAdminBtnRightHere.focus();
  }
}

function signOutUser() {
  signOut(auth)
    .then(() => {
      console.log("User signed out successfully.");
      // You can redirect the user to a login page or perform other actions here
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}

export function openLogin() {
  log_in_modal_wrapper.showPopover();
  loginUser_emailUserName.focus();
}

admin_button.addEventListener("click", openLogin);

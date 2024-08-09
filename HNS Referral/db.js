import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

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

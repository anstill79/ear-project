import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCpInRomfeVWZ6yT5DJWn7k57jXJ5Md8yM",
  authDomain: "hns-guidance.firebaseapp.com",
  projectId: "hns-guidance",
  storageBucket: "hns-guidance.appspot.com",
  messagingSenderId: "70167336621",
  appId: "1:70167336621:web:4761e175c44282aa2e1824",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

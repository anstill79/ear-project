import { db } from "./db";
import { collection, getDocs } from "./node_modules/firebase/firestore";

export async function getArrays() {
  const resultsCollection = collection(db, "Results");
  // const guidanceCollection = collection(db, "Guidance");

  const resultsSnapshot = await getDocs(resultsCollection);

  // const guidanceSnapshot = await getDocs(guidanceCollection);

  const resultsArray = [];
  // const guidanceArray = [];
  resultsSnapshot.forEach((doc) => {
    const data = doc.data();
    resultsArray.push(data);
  });
  return {
    resultsArray,
    // guidanceArray,
  };
}
getArrays();

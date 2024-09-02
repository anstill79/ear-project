import { db } from "./db";
import { collection, getDocs } from "./node_modules/firebase/firestore";

export async function getData() {
  const data = collection(db, "Data");
  const dataSnapshotAtLoad = await getDocs(data);
  const dataObj = {
    Audiogram: [],
    Timing: [],
    Age: [],
    Guidance: {}, // Initialize Guidance as an object
  };

  dataSnapshotAtLoad.forEach((doc) => {
    const docData = doc.data();
    if (docData.Audiogram) dataObj.Audiogram.push(docData.Audiogram);
    if (docData.Timing) dataObj.Timing.push(docData.Timing);
    if (docData.Age) dataObj.Age.push(docData.Age);
    if (docData.Guidance) {
      // Assume docData.Guidance contains key-value pairs
      Object.keys(docData.Guidance).forEach((key) => {
        dataObj.Guidance[key] = docData.Guidance[key];
      });
    }
  });

  return dataObj;
}

import { db } from "./db";
import { collection, getDocs } from "./node_modules/firebase/firestore";

export async function getArrays() {
  const data = collection(db, "Data");
  const dataSnapshotAtLoad = await getDocs(data);
  const dataObj = {
    Audiogram: [],
    Timing: [],
    Age: [],
  };
  dataSnapshotAtLoad.forEach((doc) => {
    const docData = doc.data();
    if (docData.Audiogram) dataObj.Audiogram.push(docData.Audiogram);
    if (docData.Timing) dataObj.Timing.push(docData.Timing);
    if (docData.Age) dataObj.Age.push(docData.Age);
  });
  return dataObj;
}

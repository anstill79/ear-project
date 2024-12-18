import {
  doc,
  setDoc,
  addDoc,
  collection,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "./db.js";
import { auth } from "./auth.js";

let dataObj = {
  Audiogram: [],
  Timing: [],
  Age: [],
  Guidance: {},
};

let adminSelectedOptions = {};
let originalDataObj = {};

async function getData() {
  const data = collection(db, "Data");
  const dataSnapshotAtLoad = await getDocs(data);

  dataSnapshotAtLoad.forEach((doc) => {
    const docData = doc.data();

    if (docData.Audiogram && Array.isArray(docData.Audiogram)) {
      dataObj.Audiogram.push(...docData.Audiogram);
    }
    if (docData.Timing && Array.isArray(docData.Timing)) {
      dataObj.Timing.push(...docData.Timing);
    }
    if (docData.Age && Array.isArray(docData.Age)) {
      dataObj.Age.push(...docData.Age);
    }
    if (docData.Guidance) {
      Object.keys(docData.Guidance).forEach((key) => {
        dataObj.Guidance[key] = docData.Guidance[key];
      });
    }
    originalDataObj = structuredClone(dataObj);
  });
}

export function populateAdminSection(array, ul) {
  adminSelectedOptions = {};
  ul.innerHTML = "";

  array.forEach((item) => {
    const li = document.createElement("li");
    const inputEl = document.createElement("input");
    inputEl.type = "text";
    inputEl.value = item;
    inputEl.addEventListener("focus", selectAdminOption);
    inputEl.addEventListener("blur", selectAdminOption);
    const selectBtn = document.createElement("button");
    selectBtn.innerText = "⬜️";
    selectBtn.classList.add("admin-select-or-delete-btns");
    selectBtn.addEventListener("click", selectAdminOption);
    const wrapper = document.createElement("div");
    wrapper.appendChild(selectBtn);
    wrapper.appendChild(inputEl);
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "❌";
    deleteBtn.classList.add("admin-select-or-delete-btns");
    deleteBtn.style.fontSize = "8px";
    if (ul === audiogram_result_admin) {
      deleteBtn.setAttribute("id", "audio");
    }
    if (ul === timing_admin) {
      deleteBtn.setAttribute("id", "timing");
    }
    if (ul === patient_age_admin) {
      deleteBtn.setAttribute("id", "age");
    }
    deleteBtn.addEventListener("click", deleteOptionAndDeleteSelectedItem);
    wrapper.classList.add("admin-li-wrapper");
    wrapper.appendChild(deleteBtn);
    li.appendChild(wrapper);
    ul.appendChild(li);
  });
  const newOptionBtn = document.createElement("button");
  newOptionBtn.innerText = "Create New Option";
  newOptionBtn.style.marginTop = "5px";
  newOptionBtn.classList.add("admin-add-new-option-btns");
  newOptionBtn.addEventListener("click", addNewAdminOption);
  if (ul === audiogram_result_admin) {
    newOptionBtn.id = "new_audio_result_admin";
  }
  if (ul === timing_admin) {
    newOptionBtn.id = "new_timing_result_admin";
  }
  if (ul === patient_age_admin) {
    newOptionBtn.id = "new_age_result_admin";
  }
  const div = document.createElement("div");
  div.style.display = "grid";
  div.style.placeContent = "center";
  div.appendChild(newOptionBtn);
  ul.appendChild(div);

  admin_selected_audioResult.innerText = "(none selected)";
  admin_selected_timingResult.innerText = "(none selected)";
  admin_selected_ageResult.innerText = "(none selected)";
}

function deleteOptionAndDeleteSelectedItem(event) {
  const li = this.parentElement.parentElement;
  const id = this.getAttribute("id");
  if (confirm("Are you sure you want to delete this option?")) {
    if (id === "audio") {
      delete adminSelectedOptions.selectedAudioResult;
    }
    if (id === "timing") {
      delete adminSelectedOptions.selectedTiming;
    }
    if (id === "age") {
      delete adminSelectedOptions.selectedAge;
    }
    li.remove();

    admin_guidance_text.value = "";
  }
}

function addNewAdminOption() {
  let target;
  let deleteBtnDatasetID;
  if (this.id === "new_audio_result_admin") {
    target = audiogram_result_admin;
    deleteBtnDatasetID = "audio";
  }
  if (this.id === "new_timing_result_admin") {
    target = timing_admin;
    deleteBtnDatasetID = "timing";
  }
  if (this.id === "new_age_result_admin") {
    target = patient_age_admin;
    deleteBtnDatasetID = "age";
  }
  const li = document.createElement("li");
  const inputEl = document.createElement("input");
  inputEl.type = "text";

  inputEl.addEventListener("focus", selectAdminOption);
  const section =
    this.parentElement.parentElement.parentElement.parentElement.querySelector(
      "h5"
    ).innerText;
  inputEl.addEventListener("blur", selectAdminOption);
  const selectBtn = document.createElement("button");
  selectBtn.innerText = "⬜️";

  selectBtn.classList.add("admin-select-or-delete-btns");
  selectBtn.addEventListener("click", selectAdminOption);
  const wrapper = document.createElement("div");
  wrapper.appendChild(selectBtn);
  wrapper.appendChild(inputEl);
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "❌";
  deleteBtn.style.fontSize = "8px";

  deleteBtn.classList.add("admin-select-or-delete-btns");
  deleteBtn.setAttribute("id", `${this.id}_delete`);
  deleteBtn.addEventListener("click", deleteOptionAndDeleteSelectedItem);
  wrapper.classList.add("admin-li-wrapper");
  wrapper.appendChild(deleteBtn);
  li.appendChild(wrapper);

  target.insertBefore(li, target.lastChild);
}

function selectAdminOption(onFocusNotBtn) {
  let thisBtn;
  let initialState;
  thisBtn = this.parentElement.querySelector("button");
  initialState = "⬜️";

  const inputText = this.parentElement.querySelector("input").value;
  const section =
    this.parentElement.parentElement.parentElement.parentElement.querySelector(
      "h5"
    ).innerText;
  let objKey;

  if (section === "Audiogram Result") {
    if (initialState === "✅") {
      admin_selected_audioResult.innerText = "(none selected)";
    } else {
      admin_selected_audioResult.innerText = inputText;
    }
    objKey = "selectedAudioResult";
  }
  if (section === "Timing Result") {
    if (initialState === "✅") {
      admin_selected_timingResult.innerText = "(none selected)";
    } else {
      admin_selected_timingResult.innerText = inputText;
    }
    objKey = "selectedTiming";
  }
  if (section === "Age Result") {
    if (initialState === "✅") {
      admin_selected_ageResult.innerText = "(none selected)";
    } else {
      admin_selected_ageResult.innerText = inputText;
    }
    objKey = "selectedAge";
  }
  const target = this.parentElement.parentElement.parentElement;
  target.querySelectorAll("button").forEach((btn) => {
    if (btn.innerText !== "❌" && btn.innerText !== "Create New Option") {
      btn.innerText = "⬜️";
      btn.style.opacity = "0.3";
    }
  });
  if (initialState === "✅") {
    thisBtn.innerText = "⬜️";
    thisBtn.style.opacity = "0.3";
    delete adminSelectedOptions[objKey];
  } else {
    thisBtn.innerText = "✅";
    thisBtn.style.opacity = "1";
    adminSelectedOptions[objKey] = inputText;
  }
  if (
    adminSelectedOptions.selectedAudioResult &&
    adminSelectedOptions.selectedTiming &&
    adminSelectedOptions.selectedAge
  ) {
    const key = `${adminSelectedOptions.selectedAudioResult}${adminSelectedOptions.selectedTiming}${adminSelectedOptions.selectedAge}`;
    if (dataObj.Guidance[key]) {
      admin_guidance_text.value = dataObj.Guidance[key];
    } else {
      admin_guidance_text.value = "";
    }
  }
}

export async function saveAdminOptions() {
  const textContent = admin_guidance_text.value;
  if (!textContent || textContent === "undefined") {
    alert("Please enter some guidance text before saving.");
    document.activeElement.blur();
    return;
  }
  if (!adminSelectedOptions.selectedAudioResult) {
    alert("Please select an Audiogram Result option before saving.");

    document.activeElement.blur();
    return;
  }
  if (!adminSelectedOptions.selectedTiming) {
    alert("Please select a Timing option before saving.");

    document.activeElement.blur();
    return;
  }
  if (!adminSelectedOptions.selectedAge) {
    alert("Please select an Age option before saving.");

    document.activeElement.blur();
    return;
  }
  if (!textContent) {
    alert("Please enter guidance data before saving.");

    document.activeElement.blur();
    return;
  }

  delete dataObj.Audiogram;
  dataObj.Audiogram = [];
  delete dataObj.Timing;
  dataObj.Timing = [];
  delete dataObj.Age;
  dataObj.Age = [];

  const key = `${adminSelectedOptions.selectedAudioResult}${adminSelectedOptions.selectedTiming}${adminSelectedOptions.selectedAge}`;
  dataObj.Guidance[key] = textContent;
  //loop and update results into memory obj
  const audiogramInputs = Array.from(
    document.querySelectorAll(
      '#audiogram_result_admin li div input[type="text"]'
    )
  );
  audiogramInputs.forEach((input, index) => {
    if (input.value) {
      dataObj.Audiogram[index] = input.value;
    }
  });

  const ageInputs = Array.from(
    document.querySelectorAll('#patient_age_admin li div input[type="text"]')
  );
  ageInputs.forEach((input, index) => {
    if (input.value) {
      dataObj.Age[index] = input.value;
    }
  });
  const timingInputs = Array.from(
    document.querySelectorAll('#timing_admin li div input[type="text"]')
  );
  timingInputs.forEach((input, index) => {
    if (input.value) {
      dataObj.Timing[index] = input.value;
    }
  });

  const docRef = doc(db, "Data", "SSC");
  await setDoc(docRef, dataObj);
  const changeDocRef = doc(db, "Changes", "SSC");
  const changes = objectDiff(originalDataObj, dataObj);

  if (changes) {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "America/Los_Angeles",
    };
    let usTimestampString = now.toLocaleString("en-US", options);
    usTimestampString = usTimestampString.replace(/\//g, "-").replace(",", "");

    const user = auth.currentUser.email;
    const changeInfo = {
      [usTimestampString]: {
        user: user,
        changes: changes,
      },
    };
    await updateDoc(changeDocRef, changeInfo);
  }

  save_admin_button.innerText = "OK! ✅";
  setTimeout(() => {
    save_admin_button.innerText = "Save";
    admin_guidance_text.value = "";
    document.activeElement.blur();
  }, 1000);
  populateUserSection(1);
}

function objectDiff(original, modified) {
  if (original === modified) return undefined;
  if (typeof original !== "object" || typeof modified !== "object")
    return modified;

  if (Array.isArray(original) && Array.isArray(modified)) {
    if (original.length !== modified.length) return modified;
    const arrayDiff = modified.map((item, index) =>
      objectDiff(original[index], item)
    );
    return arrayDiff.some((x) => x !== undefined) ? arrayDiff : undefined;
  }

  const diff = {};
  let hasDiff = false;

  for (const key in modified) {
    if (Object.prototype.hasOwnProperty.call(modified, key)) {
      const originalValue = original[key];
      const modifiedValue = modified[key];
      const valueDiff = objectDiff(originalValue, modifiedValue);

      if (valueDiff !== undefined) {
        diff[key] = valueDiff;
        hasDiff = true;
      }
    }
  }
  for (const key in original) {
    if (
      Object.prototype.hasOwnProperty.call(original, key) &&
      !(key in modified)
    ) {
      diff[key] = undefined;
      hasDiff = true;
    }
  }
  return hasDiff ? diff : undefined;
}

export async function populateUserSection(skipDataFetchOnSaveAdmin) {
  if (!skipDataFetchOnSaveAdmin) {
    await getData();
  }
  audiogram_result.innerHTML = "";
  timing_result.innerHTML = "";
  age_result.innerHTML = "";
  function appendOptions(array, selectElement) {
    const blankDefault = document.createElement("option");
    if (selectElement === audiogram_result) {
      blankDefault.textContent = "-- Select an audiogram result --";
      blankDefault.value = "-- Select an audiogram result --";
    }
    if (selectElement === timing_result) {
      blankDefault.textContent = "-- Select a timing --";
      blankDefault.value = "-- Select a timing --";
    }
    if (selectElement === age_result) {
      blankDefault.textContent = "-- Select an age --";
      blankDefault.value = "-- Select an age --";
    }
    selectElement.appendChild(blankDefault);
    array.forEach((item) => {
      const option = document.createElement("option");
      option.textContent = item;
      option.value = item;
      selectElement.appendChild(option);
    });
  }
  if (dataObj.Audiogram) {
    appendOptions(dataObj.Audiogram, audiogram_result);
    populateAdminSection(dataObj.Audiogram, audiogram_result_admin);
  }
  if (dataObj.Timing) {
    appendOptions(dataObj.Timing, timing_result);
    populateAdminSection(dataObj.Timing, timing_admin);
  }
  if (dataObj.Age) {
    appendOptions(dataObj.Age, age_result);
    populateAdminSection(dataObj.Age, patient_age_admin);
  }
}

export function giveGuidance() {
  if (this.selectedIndex === 0) {
    this.classList.remove("ready");
    guidance_text.innerText = "";
    guidance_text.classList.remove("ready");
    guidance_text.classList.add("guidance-not-ready");
    return;
  }
  this.classList.add("ready");
  if (
    audiogram_result.selectedIndex !== 0 &&
    timing_result.selectedIndex !== 0 &&
    age_result.selectedIndex !== 0
  ) {
    guidance_text.innerText =
      dataObj.Guidance[
        `${audiogram_result.value}${timing_result.value}${age_result.value}`
      ];

    guidance_text.classList.remove("guidance-not-ready");
    guidance_text.classList.add("ready");
  }
}

timing_date_picker.addEventListener("change", calculateDifference);

function calculateDifference() {
  if (!timing_date_picker.value) {
    timing_picker_output.innerText = "Select a date 👈";
    return;
  }

  const selectedDate = new Date(timing_date_picker.value);
  const currentDate = new Date();

  if (selectedDate > currentDate) {
    timing_picker_output.innerHTML =
      '<p class="error">Please choose a date in the past.</p>';
    return;
  }

  const timeDifference = currentDate - selectedDate;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const weeksDifference = Math.floor(daysDifference / 7);
  const monthsDifference = Math.floor(daysDifference / 30.44); // Average days in a month
  const yearsDifference = Math.floor(daysDifference / 365.25);

  let resultHTML = `<p>${daysDifference} day${
    daysDifference !== 1 ? "s" : ""
  } ago</p>`;

  if (daysDifference >= 7) {
    resultHTML += `<p style="padding-left: 10px;">${weeksDifference} week${
      weeksDifference !== 1 ? "s" : ""
    } ago</p>`;
  }

  if (daysDifference >= 30) {
    resultHTML += `<p style="padding-left: 20px;">${monthsDifference} month${
      monthsDifference !== 1 ? "s" : ""
    } ago</p>`;
  }

  if (daysDifference >= 365) {
    resultHTML += `<p style="padding-left: 30px;">${yearsDifference} year${
      yearsDifference !== 1 ? "s" : ""
    } ago</p>`;
  }

  timing_picker_output.innerHTML = resultHTML;
  note_pickerInfo.style.backgroundColor = "yellow";
  setTimeout(() => {
    note_pickerInfo.style.backgroundColor = "white";
  }, 2000);
}

function clearForm() {
  audiogram_result.selectedIndex = 0;
  audiogram_result.classList.remove("ready");
  age_result.selectedIndex = 0;
  age_result.classList.remove("ready");
  timing_result.selectedIndex = 0;
  timing_result.classList.remove("ready");
  guidance_text.classList.remove("ready");
  guidance_text.classList.add("guidance-not-ready");
  timing_date_picker.value = "";
  timing_picker_output.innerHTML = "";
  timing_picker_output.innerHTML = `<p>👈 Select a date</p>`;
  guidance_text.innerText = "";
}

clear_form.addEventListener("click", clearForm);

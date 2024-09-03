import { getData } from "./data.js";
import { setDoc, collection } from "./node_modules/firebase/firestore";
import { db } from "./db.js";

//  save admin just needs to blow out the entire dataset and write it fresh when any edit is made and saved
//  without that, a small typo edit or simlar will create new items and we'll need to track things with IDs and such
//  let's go the simple route and just concat the options as key and see if it works well enough

let selectedOptions = {};

export function populateAdminSection(array, ul) {
  selectedOptions = {};

  array.forEach((item) => {
    const li = document.createElement("li");
    const inputEl = document.createElement("input");
    inputEl.type = "text";
    inputEl.value = item;
    inputEl.addEventListener("focus", selectAdminOption);
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
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this option?")) {
        li.remove();
      }
    });
    wrapper.classList.add("admin-li-wrapper");
    wrapper.appendChild(deleteBtn);
    li.appendChild(wrapper);
    ul.appendChild(li);
  });

  const newOptionBtn = document.createElement("button");
  newOptionBtn.innerText = "➕";
  newOptionBtn.style.marginTop = "5px";
  newOptionBtn.classList.add("admin-add-new-option-btns");
  newOptionBtn.addEventListener("click", addNewAdminOption);
  const div = document.createElement("div");
  div.style.display = "grid";
  div.style.placeContent = "center";
  div.appendChild(newOptionBtn);
  ul.appendChild(div);

  admin_selected_audioResult.innerText = "(none selected)";
  admin_selected_timingResult.innerText = "(none selected)";
  admin_selected_ageResult.innerText = "(none selected)";
}

export function addNewAdminOption() {
  let target;
  if (this.id === "new_audio_result_admin") {
    target = audiogram_result_admin;
  }
  if (this.id === "new_timing_result_admin") {
    target = timing_admin;
  }
  if (this.id === "new_age_result_admin") {
    target = patient_age_admin;
  }
  const li = document.createElement("li");
  const inputEl = document.createElement("input");
  inputEl.type = "text";
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
  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this option?")) {
      li.remove();
    }
  });
  wrapper.classList.add("admin-li-wrapper");
  wrapper.appendChild(deleteBtn);
  li.appendChild(wrapper);
  target.insertBefore(li, target.lastChild);
  inputEl.focus();
}

export function selectAdminOption(onFocusNotBtn) {
  let thisBtn;
  let initialState;
  if (onFocusNotBtn) {
    thisBtn = this.parentElement.querySelector("button");
    initialState = "⬜️";
  } else {
    thisBtn = this;
    initialState = thisBtn.innerText;
  }
  const inputText = this.parentElement.querySelector("input").value;
  //admin_guidance_text.value = "";
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
    if (btn.innerText !== "❌" && btn.innerText !== "➕") {
      btn.innerText = "⬜️";
      btn.style.opacity = "0.3";
    }
  });
  if (initialState === "✅") {
    thisBtn.innerText = "⬜️";
    thisBtn.style.opacity = "0.3";
    delete selectedOptions[objKey];
  } else {
    thisBtn.innerText = "✅";
    thisBtn.style.opacity = "1";
    selectedOptions[objKey] = { text: inputText };
  }
  if (
    selectedOptions.selectedAudioResult &&
    selectedOptions.selectedTiming &&
    selectedOptions.selectedAge
  ) {
    const key = `${selectedOptions.selectedAudioResult.id}${selectedOptions.selectedTiming.id}${selectedOptions.selectedAge.id}`;
    admin_guidance_text.innerText = Guidance[key];
  }
}

export async function saveAdminOptions() {
  const textContent = admin_guidance_text.value;
  if (!textContent) {
    alert("Please enter some guidance text before saving.");
    return;
  }
  const keys = Object.keys(selectedOptions);
  if (!selectedOptions.selectedAudioResult) {
    alert("Please select an Audiogram Result option before saving.");
    return;
  }
  if (!selectedOptions.selectedTiming) {
    alert("Please select a Timing option before saving.");
    return;
  }
  if (!selectedOptions.selectedAge) {
    alert("Please select an Age option before saving.");
    return;
  }
  if (!textContent) {
    alert("Please enter guidance data before saving.");
    return;
  }
  const dataObj = await getData();

  const key = `${selectedOptions.selectedAudioResult.text}${selectedOptions.selectedTiming.text}${selectedOptions.selectedAge.text}`;
  dataObj.Guidance[key] = textContent;
  const docRef = db.collection("Data").doc("SSC");
  await docRef.setDoc(dataObj);
}

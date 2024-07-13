// ----------------- Admin ----------------- //
// ----------------- Admin ----------------- //
// ----------------- Admin ----------------- //

import { audiogramResultOptions, timingOptions, ageOptions } from "./data.js";

let selectedOptions = {};

export function populateAdminOptions() {
  selectedOptions = {};
  const adminOptions = [
    {
      options: audiogramResultOptions,
      target: audiogram_result_admin,
      id: "new_audio_result_admin",
    },
    {
      options: timingOptions,
      target: timing_admin,
      id: "new_timing_result_admin",
    },
    {
      options: ageOptions,
      target: patient_age_admin,
      id: "new_age_result_admin",
    },
  ];

  adminOptions.forEach((adminOption) => {
    const { options, target, id } = adminOption;
    target.innerHTML = "";
    let keys = Object.keys(options);
    keys = keys.filter((key) => key !== "count");

    keys.forEach((key) => {
      const li = document.createElement("li");
      const inputEl = document.createElement("input");
      inputEl.type = "text";
      inputEl.value = options[key][1];
      inputEl.dataset.id = key;
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
      target.appendChild(li);
    });

    const newOptionBtn = document.createElement("button");
    newOptionBtn.innerText = "➕";
    newOptionBtn.id = id;
    newOptionBtn.style.marginTop = "5px";
    newOptionBtn.addEventListener("click", addNewAdminOption);
    const div = document.createElement("div");
    div.style.display = "grid";
    div.style.placeContent = "center";
    div.appendChild(newOptionBtn);
    target.appendChild(div);
  });
  admin_selected_audioResult.innerText = "(none selected)";
  admin_selected_timingResult.innerText = "(none selected)";
  admin_selected_ageResult.innerText = "(none selected)";
  const guidanceTextLi = document
    .querySelector("#admin_guidance_inputs")
    .querySelectorAll("li");
  guidanceTextLi.forEach((item, index) => {
    if (index === 0) {
      const input = item.querySelector("input");
      console.log(input.value);
      input.value = "";
    } else {
      guidanceTextLi[index].remove();
    }
  });
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
  inputEl.dataset.id = createID();
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

export function selectAdminOption() {
  const thisBtn = this;
  const inputText = this.parentElement.querySelector("input").value;
  const inputId = this.parentElement.querySelector("input").dataset.id;
  const section =
    this.parentElement.parentElement.parentElement.parentElement.querySelector(
      "h5"
    ).innerText;
  let objKey;
  if (section === "Audiogram Result") {
    admin_selected_audioResult.innerText = inputText;
    objKey = "selectedAudioResult";
  }
  if (section === "Timing Result") {
    admin_selected_timingResult.innerText = inputText;
    objKey = "selectedTiming";
  }
  if (section === "Age Result") {
    admin_selected_ageResult.innerText = inputText;
    objKey = "selectedAge";
  }
  const target = this.parentElement.parentElement.parentElement;
  target.querySelectorAll("button").forEach((btn) => {
    if (btn.innerText !== "❌" && btn.innerText !== "➕") {
      btn.innerText = "⬜️";
      btn.style.opacity = "0.3";
    }
  });
  thisBtn.innerText = "✅";
  thisBtn.style.opacity = "1";
  selectedOptions[objKey] = { id: inputId, text: inputText };

  if (
    selectedOptions.selectedAudioResult &&
    selectedOptions.selectedTiming &&
    selectedOptions.selectedAge
  ) {
    const key = `${selectedOptions.selectedAudioResult.id}_${selectedOptions.selectedTiming.id}_${selectedOptions.selectedAge.id}`;
    admin_guidance_text.innerText = guidanceOptions[key];
  }
}

function createID() {
  return `h${Math.random().toString(36).substring(2)}`;
}

export function addNewGuidanceOption() {
  const li = document.createElement("li");
  const inputEl = document.createElement("input");
  inputEl.type = "text";
  li.appendChild(inputEl);
  //admin_guidance_inputs.appendChild(li);
  admin_guidance_inputs.insertBefore(li, admin_guidance_inputs.lastChild);
  admin_guidance_inputs.focus();
}

export function saveAdminOptions() {
  const textContent = admin_guidance_text.value;
  if (!textContent) {
    alert("Please enter some guidance text before saving.");
    return;
  }
  console.log(selectedOptions);
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
  const key = `${selectedOptions.selectedAudioResult.id}${selectedOptions.selectedTiming.id}${selectedOptions.selectedAge.id}`;
  guidanceOptions[key] = textContent;

  const audioList = audiogram_result_admin.querySelectorAll("input");
  const timingList = timing_admin.querySelectorAll("input");
  const ageList = patient_age_admin.querySelectorAll("input");
  audiogramResultOptions = {};
  timingOptions = {};
  ageOptions = {};
  audioList.forEach((audio, index) => {
    audiogramResultOptions[audio.dataset.id] = [index, audio.value];
  });
  timingList.forEach((timing, index) => {
    timingOptions[timing.dataset.id] = [index, timing.value];
  });
  ageList.forEach((age, index) => {
    ageOptions[age.dataset.id] = [index, age.value];
  });
  let count = Object.keys(audiogramResultOptions).length;
  audiogramResultOptions.count = count;
  count = Object.keys(timingOptions).length;
  timingOptions.count = count;
  count = Object.keys(ageOptions).length;
  ageOptions.count = count;

  //loop through all admin list options on the page and rebuild the objects
  //    take the input text and create an id and insert

  //build the single active guidance item and insert it into the guidance object

  //save the  objects to local storage

  //
}

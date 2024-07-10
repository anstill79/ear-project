let audiogramResultOptions = {
  count: 11,
  h27uzrk6kifg: [0, "Asymm.: 30_30_30 dB asymm. over 3 freq. (no interocts)"],
  hbvu82knmn8: [1, "Asymm.: 1 freq >= 30 dB asymm. (ignore 8kHz)"],
  hgx5y9f3fjqv: [2, "Asymm.: Word rec. >= 20% asymm."],
  hjo5e1wyk43n: [
    3,
    "Asymm: Not significantly large enough to meet other criteria.",
  ],
  hpmkn7f66ezl: [4, "ABG > 30 absent reflexes"],
  h7snmngmq7bq: [5, "ABG > 30 present reflexes"],
  htmfxbbsq6i: [6, "Pulsatile tinnitus"],
  hze5l88xw5da: [7, "Constant unilateral tinnitus"],
  h57i3mqae9am: [8, "Drainage"],
  hfv7habuo1rs: [9, "Asymm. 1 freq. => 30 dB"],
  h7e4lokp71x5: [10, "Asymm. 2 freq. => 15 dB"],
};

let timingOptions = {
  count: 6,
  h4bs5o8e7g38: [0, "Weeks: 0 to 6"],
  hxpr2gkommu8: [1, "Months: 1.5 to 3"],
  hxqb1es55y: [2, "Months: 3 to 6"],
  hu14uai7ju5: [3, "Months: 6 to 12"],
  h9bvafyhtzhq: [4, "Years: 1+"],
  hfup2dtcsahn: [5, "Unknown"],
};

let ageOptions = {
  count: 3,
  hvg5v9ghbfld: [0, "0-18"],
  hulsdhrnwfrs: [1, "19-70"],
  huga31csk7ws: [2, "Over 70"],
};

const guidanceOptions = {
  // Asymm.: 30_30_30 dB asymm. over 3 freq. (no interocts). early onset
  h27uzrk6kifg_h4bs5o8e7g38_hvg5v9ghbfld: `Audiologist orders MRI
  Does patient want steroids?
    If so, help coordinate Sudden appointment with HNS, same day or in very near future.
Repeat audiogram in 2 weeks.`,
  h27uzrk6kifg_h4bs5o8e7g38_hulsdhrnwfrs: `Audiologist orders MRI
  Does patient want steroids?
    If so, help coordinate Sudden appointment with HNS, same day or in very near future.
Repeat audiogram in 2 weeks.`,
  h27uzrk6kifg_h4bs5o8e7g38_huga31csk7ws: `Audiologist orders MRI
  Does patient want steroids?
    If so, help coordinate Sudden appointment with HNS, same day or in very near future.
Repeat audiogram in 2 weeks.`,
  // Asymm.: 30_30_30 dB asymm. over 3 freq. (no interocts). late onset
  h27uzrk6kifg_hxpr2gkommu8_hvg5v9ghbfld: `Audiologist orders MRI
Too late for steroids. No HNS visit indicated
Repeat audiogram in 2 weeks
Hearing instruments as needed`,
  h27uzrk6kifg_hxpr2gkommu8_hulsdhrnwfrs: `Audiologist orders MRI
Too late for steroids. No HNS visit indicated
Repeat audiogram in 2 weeks
Hearing instruments as needed`,
  h27uzrk6kifg_hxpr2gkommu8_huga31csk7ws: `Audiologist orders MRI
Too late for steroids. No HNS visit indicated
Repeat audiogram in 2 weeks
Hearing instruments as needed`,
  // Asymm.: 1 freq >= 30 dB asymm. (ignore 8kHz).  onset doesn't matter
  hbvu82knmn8_h4bs5o8e7g38_hvg5v9ghbfld: `PCP orders MRI
No HNS visit indicated
Hearing instruments as needed
Monitor hearing annually`,
  hbvu82knmn8_h4bs5o8e7g38_hulsdhrnwfrs: `PCP orders MRI
No HNS visit indicated
Hearing instruments as needed
Monitor hearing annually`,
  hbvu82knmn8_h4bs5o8e7g38_huga31csk7ws: `Patient too old for MRI
No HNS visit indicated
Hearing instruments as needed
Monitor hearing annually`,
  // Asymm.: Word rec. >= 20% asymm. early onset
  hgx5y9f3fjqv_h4bs5o8e7g38_hvg5v9ghbfld: `Audiologist orders MRI
  Does patient want steroids?
    If so, help coordinate Sudden appointment with HNS, same day or in very near future.
Repeat audiogram in 2 weeks.`,
  hgx5y9f3fjqv_h4bs5o8e7g38_hulsdhrnwfrs: `Audiologist orders MRI
  Does patient want steroids?
    If so, help coordinate Sudden appointment with HNS, same day or in very near future.
Repeat audiogram in 2 weeks.`,
  hgx5y9f3fjqv_h4bs5o8e7g38_huga31csk7ws: `Audiologist orders MRI
  Does patient want steroids?
    If so, help coordinate Sudden appointment with HNS, same day or in very near future.
Repeat audiogram in 2 weeks.`,
  // Asymm.: Word rec. >= 20% asymm. late onset
  hgx5y9f3fjqv_hxpr2gkommu8_hvg5v9ghbfld: `PCP orders MRI
Too late for steroids. No HNS visit indicated
Repeat audiogram in 2 weeks
Hearing instruments as needed`,
  hgx5y9f3fjqv_hxpr2gkommu8_hulsdhrnwfrs: `PCP orders MRI
Too late for steroids. No HNS visit indicated
Repeat audiogram in 2 weeks
Hearing instruments as needed`,
  hgx5y9f3fjqv_hxpr2gkommu8_huga31csk7ws: `Patient too old for MRI
Too late for steroids. No HNS visit indicated
Repeat audiogram in 1 year
Hearing instruments as needed`,
  // Asymm: Not significantly large enough to meet other criteria.
  hjo5e1wyk43n_h4bs5o8e7g38_hvg5v9ghbfld: `No MRI indicated
No HNS visit indicated
Annual audiograms to monitor asymmetry, in case it grows.
  If asymmetry increases to meet HNS criteria for MRI or HNS consult, appropriate orders can be placed at that time.
Hearing instruments as needed`,
  hjo5e1wyk43n_h4bs5o8e7g38_hulsdhrnwfrs: `No MRI indicated
No HNS visit indicated
Annual audiograms to monitor asymmetry, in case it grows.
  If asymmetry increases to meet HNS criteria for MRI or HNS consult, appropriate orders can be placed at that time.
Hearing instruments as needed`,
  hjo5e1wyk43n_h4bs5o8e7g38_huga31csk7ws: `No MRI indicated
No HNS visit indicated
Annual audiograms to monitor asymmetry, in case it grows.
  If asymmetry increases to meet HNS criteria for MRI or HNS consult, appropriate orders can be placed at that time.
Hearing instruments as needed`,
};

//   Send chart to PCP with note that if the symptom remains present and constant that MRI/MRA scan is indicated ${content}
// No repeat audio needed unless symptoms change, or if SNHL is found on audio and if hearing monitoring is desired by AuD or patient</li>
//   Hearing instruments as needed

//   Refer to HNS for possible dehiscence
// eConsult order for VEMP testing
// Hearing instruments as needed

//   Refer to HNS for possible otosclerosis
// Hearing instruments as needed

// No MRI indicated
// <li>No HNS visit indicated</li>
// <li>Annual audiograms to monitor asymmetry, in case it grows.</li>
// <ul><li>If asymmetry increases to meet HNS criteria for MRI or HNS consult, appropriate orders can be placed at that time.
//   Hearing instruments as needed

//     Send chart to PCP with note that if the symptom remains present and constant that MRI/MRA scan is indicated ${content}
// </li>
// <li>No repeat audio needed unless symptoms change, or if SNHL is found on audio and if hearing monitoring is desired by AuD or patient</li>
// <li>Hearing instruments as needed

// PCP orders MRI/MRA</li>
// <li>No repeat audio needed unless symptoms change, or if SNHL is found on audio and if hearing monitoring is desired by AuD or patient</li>
// <li>Hearing instruments as needed

function populateOptions(options, target) {
  const keys = Object.keys(options);
  keys.forEach((option, index) => {
    if (option === "count") {
      return;
    }
    const optionEl = document.createElement("option");
    optionEl.value = options[option][1];
    optionEl.innerText = options[option][1];
    optionEl.dataset.id = keys[index];
    target.appendChild(optionEl);
  });
}

populateOptions(audiogramResultOptions, audiogram_result);
populateOptions(timingOptions, timing);
populateOptions(ageOptions, patient_age);

audiogram_result.addEventListener("change", giveGuidance);
timing.addEventListener("change", clearOtherDate);
patient_age.addEventListener("change", giveGuidance);

function giveGuidance() {
  let audioID =
    audiogram_result.options[audiogram_result.selectedIndex].getAttribute(
      "data-id"
    );
  let timingID = timing.options[timing.selectedIndex].getAttribute("data-id");
  let ageID =
    patient_age.options[patient_age.selectedIndex].getAttribute("data-id");

  const guidanceContainer = document.getElementById("guidance_text");

  if (audioID && timingID && ageID) {
    guidanceContainer.innerText =
      guidanceOptions[`${audioID}_${timingID}_${ageID}`];

    return;
  }
}

function handleDatePicker(getWeeksResult) {
  const inputDate = new Date(timing_date_picker.value);
  const currentDate = new Date();
  const delta = currentDate - inputDate;
  const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
  const weeks = Math.floor(delta / millisecondsInWeek);
  if (getWeeksResult) {
    //stops here and returns weeks instead of running rest of fx
    return weeks;
  }
  if (weeks < 0) {
    console.log(weeks);
    const guidanceContainer = document.getElementById("guidance_text");
    guidanceContainer.innerHTML = `<p>You picked a date in the future. Please try again. Thank you</p>`;
    timing_date_picker.value = "";
    return;
  }
  if ((weeks) => 0 && weeks <= 6) {
    timing.value = timingOptions[1][1];
  }
  if (weeks > 6 && weeks <= 12) {
    timing.value = timingOptions[2][2];
  }
  if (weeks > 12 && weeks <= 24) {
    timing.value = timingOptions[3][3];
  }
  if (weeks > 24 && weeks <= 52) {
    timing.value = timingOptions[4][4];
  }
  if (weeks > 52) {
    timing.value = timingOptions[5][5];
  }
  if (weeks < 0) {
    timing.value = timingOptions[0][0];
  }
  giveGuidance();
}

//timing_date_picker.addEventListener("change", handleDatePicker);
timing_date_picker.addEventListener("change", clearOtherDate);

audiogram_result.focus();

function clearOtherDate() {
  //pick a date picker, clear input date
  //enter input date, clear picker
  //later function will set the cleared field to match trigger field
  if (this.id === "timing_date_picker") {
    timing.value = "";
    handleDatePicker();
  } else {
    timing_date_picker.value = "";
    giveGuidance();
  }
}

// ----------------- Admin ----------------- //
// ----------------- Admin ----------------- //
// ----------------- Admin ----------------- //

let selectedOptions = {};

function populateAdminOptions() {
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
      selectBtn.addEventListener("click", selectAdminOption);
      const wrapper = document.createElement("div");
      wrapper.appendChild(selectBtn);
      wrapper.appendChild(inputEl);
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "❌";
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
    newOptionBtn.addEventListener("click", addNewOption);
    target.appendChild(newOptionBtn);
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

admin_button.addEventListener("click", populateAdminOptions);

function addNewOption() {
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
  selectBtn.addEventListener("click", selectAdminOption);
  const wrapper = document.createElement("div");
  wrapper.appendChild(selectBtn);
  wrapper.appendChild(inputEl);
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "❌";
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

function selectAdminOption() {
  const thisBtn = this;
  const inputText = this.parentElement.querySelector("input").value;
  const inputId = this.parentElement.querySelector("input").dataset.id;
  const section =
    this.parentElement.parentElement.parentElement.parentElement.querySelector(
      "h5"
    ).innerText;
  let objKey;
  if (section === "Audiogram Result") {
    admin_selected_audioResult.innerText = `* ${inputText}`;
    objKey = "selectedAudioResult";
  }
  if (section === "Timing Result") {
    admin_selected_timingResult.innerText = `* ${inputText}`;
    objKey = "selectedTiming";
  }
  if (section === "Age Result") {
    admin_selected_ageResult.innerText = `* ${inputText}`;
    objKey = "selectedAge";
  }
  const target = this.parentElement.parentElement.parentElement;
  target.querySelectorAll("button").forEach((btn) => {
    if (btn.innerText !== "❌" && btn.innerText !== "➕") {
      btn.innerText = "⬜️";
    }
  });
  thisBtn.innerText = "✅";
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

function saveAdminOptions() {
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
save_admin_button.addEventListener("click", saveAdminOptions);

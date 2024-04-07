const audiogramResultOptions = [
  { 0: "(Select a result)" },
  { 1: "Asymm.: 30_30_30 dB asymm. over 3 freq. (no interocts)" },
  { 2: "Asymm.: 1 freq >= 30 dB asymm. (ignore 8kHz)" },
  { 3: "Asymm.: Word rec. >= 20% asymm." },
  { 4: "Asymm: Not significantly large enough to meet other criteria." },
  { 5: "ABG > 30 absent reflexes" },
  { 6: "ABG > 30 present reflexes" },
  { 7: "Pulsatile tinnitus" },
  { 8: "Constant unilateral tinnitus" },
  { 9: "Drainage" },
  { 10: "Asymm. 1 freq. => 30 dB" },
  { 11: "Asymm. 2 freq. => 15 dB" },
];

const timingOptions = [
  { 0: "(Onset)" },
  { 1: "Weeks: 0 to 6" },
  { 2: "Months: 1.5 to 3" },
  { 3: "Months: 3 to 6" },
  { 4: "Months: 6 to 12" },
  { 5: "Years: 1+" },
  { 6: "Unknown" },
];

const ageOptions = [
  { 0: "(Select an age)" },
  { 1: "0-18" },
  { 2: "19-70" },
  { 3: "Over 70" },
];

function populateOptions(options, target) {
  options.forEach((option, index) => {
    const optionEl = document.createElement("option");
    optionEl.innerText = option[index];
    target.appendChild(optionEl);
  });
}

populateOptions(audiogramResultOptions, audiogram_result);
populateOptions(timingOptions, timing);
populateOptions(ageOptions, patient_age);

audiogram_result.addEventListener("change", giveGuidance);
timing.addEventListener("change", clearOtherDate);

function getIndexes() {
  if (
    audiogram_result.value.charAt(0) === "(" ||
    timing.value.charAt(0) === "("
  ) {
    const guidanceContainer = document.getElementById("guidance_text");
    guidanceContainer.innerText = "";
    return;
  }
  const indexes = {
    selectedAudioResult: "",
    selectedTiming: "",
  };

  audiogramResultOptions.forEach((option, index) => {
    if (option[index] === audiogram_result.value) {
      indexes.selectedAudioResult = index;
    }
  });
  timingOptions.forEach((option, index) => {
    if (option[index] === timing.value) {
      indexes.selectedTiming = index;
    }
  });
  return indexes;
}

function giveGuidance() {
  const indexes = getIndexes();
  if (!indexes) {
    return;
  }
  const audio = indexes.selectedAudioResult;

  const timing = indexes.selectedTiming;
  const guidanceContainer = document.getElementById("guidance_text");

  if ((audio === 1 && timing === 1) || (audio === 3 && timing === 1)) {
    guidanceContainer.innerHTML = `<ol>
    <li>Audiologist orders MRI</li>
    <li>Does patient want steroids?</li> <ul><li>If so, help coordinate Sudden appointment with HNS, same day or in very near future.</li></ul>
    <li>Repeat audiogram in 2 weeks.</li>
    </ol>`;
  }
  if ((audio === 1 && timing !== 1) || (audio === 3 && timing !== 1)) {
    guidanceContainer.innerHTML = `<ol>
    <li>PCP orders MRI</li>
    <li>Too late for steroids. No HNS visit indicated</li>
    <li>Repeat audiogram in 2 weeks</li>
    <li>Hearing instruments as needed</li>
    </ol>`;
  }
  if (
    audio === 2 ||
    (audio === 8 && timing === 4) ||
    (audio === 8 && timing === 5)
  ) {
    guidanceContainer.innerHTML = `<ol>
    <li>PCP orders MRI</li>
    <li>No HNS visit indicated</li>
    <li>Hearing instruments as needed</li>
    </ol>`;
  }
  if (audio === 4) {
    guidanceContainer.innerHTML = `<ol>
    <li>No MRI indicated</li>
    <li>No HNS visit indicated</li>
    <li>Annual audiograms to monitor asymmetry, in case it grows.</li>
    <ul><li>If asymmetry increases to meet HNS criteria for MRI or HNS consult, appropriate orders can be placed at that time.</li></ul>
    <li>Hearing instruments as needed</li>
    </ol>`;
  }
  if (audio === 5) {
    guidanceContainer.innerHTML = `<ol>
    <li>Refer to HNS for possible otosclerosis</li>
    <li>Hearing instruments as needed</li>
    </ol>`;
  }
  if (audio === 6) {
    guidanceContainer.innerHTML = `<ol>
    <li>Refer to HNS for possible dehiscence</li>
    <li>eConsult order for VEMP testing</li>
    <li>Hearing instruments as needed</li>
    </ol>`;
  }
  if (
    (audio === 7 && timing === 1) ||
    (audio === 7 && timing === 2) ||
    (audio === 7 && timing === 3) ||
    (audio === 7 && timing === 6) ||
    (audio === 8 && timing === 1) ||
    (audio === 8 && timing === 2) ||
    (audio === 8 && timing === 3) ||
    (audio === 8 && timing === 6)
  ) {
    let content = "once symptoms have been present for 6 months.";
    if (timing_date_picker.value) {
      let newDate = new Date(timing_date_picker.value);
      newDate.setMonth(newDate.getMonth() + 6);
      let dateOnly = newDate.toLocaleDateString("en-US");
      const weeks = handleDatePicker(1);
      //removing the ternary since the timing var overrides the date picker when the picker sets the timing section on change. the > 6 month case would never hit this section.
      // content = (24 - weeks) < 0 ? 'since symptom has already been present and constant for 6 months.': `around or after ${dateOnly} (when sx cross the 6 month mark).`;
      content = `around or after ${dateOnly} (when symptoms cross the 6 month mark).`;
    }

    guidanceContainer.innerHTML = `<ol>
    <li>Send chart to PCP with note that if the symptom remains present and constant that MRI/MRA scan is indicated ${content}
    </li>
    <li>No repeat audio needed unless symptoms change, or if SNHL is found on audio and if hearing monitoring is desired by AuD or patient</li>
    <li>Hearing instruments as needed</li>
    </ol>`;
  }
  if ((audio === 7 && timing === 4) || (audio === 7 && timing === 5)) {
    guidanceContainer.innerHTML = `<ol>
    <li>PCP orders MRI/MRA</li>
    <li>No repeat audio needed unless symptoms change, or if SNHL is found on audio and if hearing monitoring is desired by AuD or patient</li>
    <li>Hearing instruments as needed</li>
    </ol>`;
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

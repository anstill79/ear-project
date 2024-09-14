import { getData, dataObj } from "./data.js";
import { populateAdminSection } from "./adminSection.js";

export async function populateUserSection() {
  await getData();
  // Clear existing options
  audiogram_result.innerHTML = "";
  timing_result.innerHTML = "";
  age_result.innerHTML = "";

  // Helper function to create and append options
  function appendOptions(array, selectElement) {
    array.forEach((item) => {
      const option = document.createElement("option");
      option.textContent = item;
      option.value = item;
      selectElement.appendChild(option);
    });
  }

  // Populate select elements and admin panel
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

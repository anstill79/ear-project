import {
  populateAdminOptions,
  saveAdminOptions,
  addNewGuidanceOption,
} from "./admin.js";

import { app, db } from "./db.js";
import { showLogInResult, createNewUser, loginUser } from "./auth.js";

// import {
//   getAgeArray,
//   audiogramResultOptions,
//   timingOptions,
//   ageOptions,
// } from "./data.js";

admin_button.addEventListener("click", populateAdminOptions);
save_admin_button.addEventListener("click", saveAdminOptions);
admin_add_guidanceLine.addEventListener("click", addNewGuidanceOption);
createUser_btn.addEventListener("click", createNewUser);
loginUser_btn.addEventListener("click", loginUser);

// function populateOptions(options, target) {
//   const keys = Object.keys(options);
//   keys.forEach((option, index) => {
//     if (option === "count") {
//       return;
//     }
//     const optionEl = document.createElement("option");
//     optionEl.value = options[option][1];
//     optionEl.innerText = options[option][1];
//     optionEl.dataset.id = keys[index];
//     target.appendChild(optionEl);
//   });
// }

// populateOptions(audiogramResultOptions, audiogram_result);
// populateOptions(timingOptions, timing);
// populateOptions(ageOptions, patient_age);

// audiogram_result.addEventListener("change", giveGuidance);
// timing.addEventListener("change", clearOtherDate);
// patient_age.addEventListener("change", giveGuidance);

// function giveGuidance() {
//   let audioID =
//     audiogram_result.options[audiogram_result.selectedIndex].getAttribute(
//       "data-id"
//     );
//   let timingID = timing.options[timing.selectedIndex].getAttribute("data-id");
//   let ageID =
//     patient_age.options[patient_age.selectedIndex].getAttribute("data-id");

//   const guidanceContainer = document.getElementById("guidance_text");

//   if (audioID && timingID && ageID) {
//     guidanceContainer.innerText =
//       guidanceOptions[`${audioID}_${timingID}_${ageID}`];

//     return;
//   }
// }

// function handleDatePicker(getWeeksResult) {
//   const inputDate = new Date(timing_date_picker.value);
//   const currentDate = new Date();
//   const delta = currentDate - inputDate;
//   const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
//   const weeks = Math.floor(delta / millisecondsInWeek);
//   if (getWeeksResult) {
//     //stops here and returns weeks instead of running rest of fx
//     return weeks;
//   }
//   if (weeks < 0) {
//     console.log(weeks);
//     const guidanceContainer = document.getElementById("guidance_text");
//     guidanceContainer.innerHTML = `<p>You picked a date in the future. Please try again. Thank you</p>`;
//     timing_date_picker.value = "";
//     return;
//   }
//   if ((weeks) => 0 && weeks <= 6) {
//     timing.value = timingOptions[1][1];
//   }
//   if (weeks > 6 && weeks <= 12) {
//     timing.value = timingOptions[2][2];
//   }
//   if (weeks > 12 && weeks <= 24) {
//     timing.value = timingOptions[3][3];
//   }
//   if (weeks > 24 && weeks <= 52) {
//     timing.value = timingOptions[4][4];
//   }
//   if (weeks > 52) {
//     timing.value = timingOptions[5][5];
//   }
//   if (weeks < 0) {
//     timing.value = timingOptions[0][0];
//   }
//   giveGuidance();
// }

// //timing_date_picker.addEventListener("change", handleDatePicker);
// timing_date_picker.addEventListener("change", clearOtherDate);

// audiogram_result.focus();

// function clearOtherDate() {
//   //pick a date picker, clear input date
//   //enter input date, clear picker
//   //later function will set the cleared field to match trigger field
//   if (this.id === "timing_date_picker") {
//     timing.value = "";
//     handleDatePicker();
//   } else {
//     timing_date_picker.value = "";
//     giveGuidance();
//   }
// }

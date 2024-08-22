import { populateUserSection, giveGuidance } from "./userSection.js";
import {
  populateAdminSection,
  saveAdminOptions,
  addNewGuidanceOption,
} from "./adminSection.js";

import { loginUser, auth } from "./auth.js";
import { getArrays } from "./data.js";

//admin_button.addEventListener("click", loginUser);
save_admin_button.addEventListener("click", saveAdminOptions);
admin_add_guidanceLine.addEventListener("click", addNewGuidanceOption);
// createUser_btn.addEventListener("click", createNewUser);
loginUser_btn.addEventListener("click", loginUser);

populateUserSection();

audiogram_result.addEventListener("change", giveGuidance);
// timing.addEventListener("change", clearOtherDate);
age_result.addEventListener("change", giveGuidance);

//timing_date_picker.addEventListener("change", handleDatePicker);
// timing_date_picker.addEventListener("change", clearOtherDate);

audiogram_result.focus();

// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     // User is signed in
//     console.log("User is signed in:", user);

//     // Fetch the arrays once the user is authenticated
//     const { resultsArray, guidanceArray } = await getArrays();

//     console.log("Results Array:", resultsArray);
//     console.log("Guidance Array:", guidanceArray);

//     // Now you can use resultsArray and guidanceArray in your application
//   } else {
//     // User is signed out
//     console.log("User is signed out");
//   }
// });

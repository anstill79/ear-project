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

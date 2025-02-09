import {
  // populateUserSection,
  // giveGuidance,
  // saveAdminOptions,
  populateFirstSelect,
  populateSecondarySelects,
  evaluateSecondarySelect,
} from "./populator.js";
// import { loginUser, auth } from "./auth.js";

audiogram_result.addEventListener("change", populateSecondarySelects);
age_result.addEventListener("change", evaluateSecondarySelect);
timing_result.addEventListener("change", evaluateSecondarySelect);

// audiogram_result.focus();

// save_admin_button.addEventListener("click", saveAdminOptions);
// loginUser_btn.addEventListener("click", loginUser);

// populateUserSection();

// document.body.addEventListener("pointerdown", () => {});

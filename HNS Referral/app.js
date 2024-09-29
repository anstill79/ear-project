import {
  populateUserSection,
  giveGuidance,
  saveAdminOptions,
} from "./populator.js";
import { loginUser, auth } from "./auth.js";

audiogram_result.addEventListener("change", giveGuidance);
age_result.addEventListener("change", giveGuidance);
timing_result.addEventListener("change", giveGuidance);

audiogram_result.focus();

save_admin_button.addEventListener("click", saveAdminOptions);
loginUser_btn.addEventListener("click", loginUser);

await populateUserSection();

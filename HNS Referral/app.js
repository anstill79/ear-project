import { populateUserSection, giveGuidance } from "./userSection.js";
import { populateAdminSection, saveAdminOptions } from "./adminSection.js";

import { loginUser, auth } from "./auth.js";

save_admin_button.addEventListener("click", saveAdminOptions);
loginUser_btn.addEventListener("click", loginUser);

await populateUserSection();

audiogram_result.addEventListener("change", giveGuidance);
age_result.addEventListener("change", giveGuidance);
timing_result.addEventListener("change", giveGuidance);

audiogram_result.focus();

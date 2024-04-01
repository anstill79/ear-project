import { doSAL } from "./SALculator.js";
import {
  launchResult,
  moreInfo,
  result_modal,
  resultsDisplay,
} from "./displayResults.js";
import { loadNorms, saveNewNorms } from "./customNorms.js";

const inputs = document.querySelector("#SAL").querySelectorAll("input");
inputs.forEach((input) => {
  input.addEventListener("change", doSAL);
});
moreInfo.forEach((info) => {
  info.addEventListener("click", launchResult);
});
saveNormsButton.addEventListener("click", saveNewNorms);
load_custom.addEventListener("click", loadNorms);
load_default.addEventListener("click", loadNorms);

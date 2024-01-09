import { doSAL } from "./SALculator.js";
import { launchResult, moreInfo, result_modal, resultsDisplay } from "./displayResults.js";
import { saveNewNorms } from "./customNorms.js";

const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
  input.addEventListener("change", doSAL);
});
moreInfo.forEach((info) => {
  info.addEventListener("click", launchResult);
});
saveNormsButton.addEventListener("click", saveNewNorms);
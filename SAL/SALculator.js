import {
  measuredData,
  SALresults,
  shiftNorms,
} from "./dataStructureDefaults.js";
import { setResultsToCell } from "./displayResults.js";

export function doSAL(item) {
  const id = item.id || this.id;
  if (item instanceof Event) {
    item = item.target;
  }
  if (!item.value) {
    return;
  }
  const val = parseInt(item.value);
  const ear = id.charAt(0);
  let freq = "";

  if (!val) {
    item.parentElement.classList.add("empty-value");
  } else {
    item.parentElement.classList.remove("empty-value");
  }

  if (id.includes("initial")) {
    freq = id.replace(`${ear}_initial_`, "");
    measuredData[ear][freq][0] = val;
  } else if (id.includes("masked")) {
    freq = id.replace(`${ear}_masked_`, "");
    measuredData[ear][freq][1] = val;
  }
  const targetResult = `${ear}_result_${freq}`;
  const targetInfo = `${ear}_info_${freq}`;
  const startingThresh = measuredData[ear][freq][0];
  const remeasuredThresh = measuredData[ear][freq][1];
  const shift = remeasuredThresh - startingThresh;
  let capped;

  if (startingThresh < 50 && startingThresh !== null) {
    if (startingThresh && remeasuredThresh) {
      SALresults[ear][freq][0] = shiftNorms[freq] - shift;
      capped =
        SALresults[ear][freq][0] < -10
          ? " Result shift was too large. Displayed value is capped at -10"
          : "";
      if (SALresults[ear][freq][0] < -10) {
        SALresults[ear][freq][0] = "-10";
      }
    }
    SALresults[ear][freq][2] = "⚠️";
    SALresults[ear][
      freq
    ][1] = `Initial result is lower than 50dB. Traditional masking may be a better choice for this frequency. The SAL value will be displayed in case traditional masking is not viable due to opposite ear severity but use with caution.${capped}`;

    setResultsToCell(ear, freq, targetResult, targetInfo);
    return;
  }
  if (startingThresh > 85) {
    SALresults[ear][freq][2] = "⚠️";
    SALresults[ear][freq][1] =
      "Initial result is greater than 85dB. The limits of most equipment can be an issue here. The SAL value is displayed but use with caution.";
    if (
      typeof remeasuredThresh === "number" &&
      typeof startingThresh === "number"
    ) {
      SALresults[ear][freq][0] = shiftNorms[freq] - shift;
    }
    setResultsToCell(ear, freq, targetResult, targetInfo);
    return;
  }

  if (startingThresh && remeasuredThresh) {
    const maxAllowed = startingThresh - shiftNorms[freq];
    SALresults[ear][freq][0] = shiftNorms[freq] - shift;
    // if shift is larger than norm, just put it at initial minus norm
    if (shift > shiftNorms[freq]) {
      SALresults[ear][freq][0] = startingThresh - shiftNorms[freq];
      SALresults[ear][freq][2] = "🤔";
      SALresults[ear][
        freq
      ][1] = `The result is usable but the shift amount is too large. The displayed result uses norm the value instead of shift (norm at this frequency is ${shiftNorms[freq]}dB)`;
    } else {
      SALresults[ear][freq][1] = "Looks good. Use the displayed result.";
      SALresults[ear][freq][2] = "✅";
    }
    // technical error or typo. masked result is lower than initial result
    if (remeasuredThresh < startingThresh) {
      SALresults[ear][freq][0] = "!";
      SALresults[ear][freq][1] =
        "The masked result is lower than initial result. Please check for technical error or typo.";
      SALresults[ear][freq][2] = "⚠️";
    }
  } else {
    //wipe out result if one of the inputs is empty
    SALresults[ear][freq][0] = null;
    SALresults[ear][freq][1] = null;
  }
  setResultsToCell(ear, freq, targetResult, targetInfo);

  //style result cell if there is a result
  const resultCell = document.getElementById(targetResult);
  //get parent cell of resultCell to style
  const parentCell = resultCell.parentElement;

  if (SALresults[ear][freq][0]) {
    parentCell.classList.remove("sm-border");
    parentCell.classList.add("lg-border");
  } else {
    parentCell.classList.remove("lg-border");
    parentCell.classList.add("sm-border");
  }
}

import { SALresults } from "./dataStructureDefaults.js";

export const resultsDisplay = document.querySelectorAll(".result");
export const moreInfo = document.querySelectorAll(".info");
export const result_modal = document.getElementById("result_modal_content");

export function setResultsToCell(ear, freq, targetResult, targetInfo) {
  resultsDisplay.forEach(
    (result) => {
      if (result.id === targetResult) {
        result.textContent = SALresults[ear][freq][0];
      }
    },
    moreInfo.forEach((info) => {
      if (info.id === targetInfo) {
        info.textContent = SALresults[ear][freq][2];
      }
    })
  );
}

export function launchResult(event) {
  result_modal.togglePopover();
  const id = event.target.id;
  const ear = id.charAt(0);
  const freq = id.replace(`${ear}_info_`, "");
  const targetComment = document.getElementById("result_modal_content");
  targetComment.innerText = "";
  const title = document.createElement("span");
  const content = document.createElement("span");
  const div = document.createElement("div");
  div.classList.add("spacer");
  title.innerText = SALresults[ear][freq][3];
  title.classList.add("card-title");
  content.innerText = SALresults[ear][freq][1];
  content.classList.add("card-content");
  targetComment.appendChild(title);
  targetComment.appendChild(div);
  targetComment.appendChild(content);
}
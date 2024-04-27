import { doSAL } from "./SALculator.js";
import { shiftNorms } from "./dataStructureDefaults.js";

function validateNormsInputs() {
  const normsContainer = document.querySelector(".norms-container");
  const inputs = normsContainer.querySelectorAll("input");

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const value = input.value.trim();

    if (value === "" || !Number.isInteger(Number(value))) {
      alert("Please enter numeric values for all 4 frequencies.");
      return false;
    }
  }
  return inputs;
}

export function saveNewNorms() {
  const inputs = validateNormsInputs();
  if (!inputs) {
    return;
  }
  const newNorms = {
    five: newNorm500.value,
    one: newNorm1k.value,
    two: newNorm2k.value,
    four: newNorm4k.value,
  };
  localStorage.setItem("customNorms", JSON.stringify(newNorms));
  alert("New norms saved!");
  newNorm500.value = "";
  newNorm1k.value = "";
  newNorm2k.value = "";
  newNorm4k.value = "";
  custom_norm_five.innerText = newNorms.five;
  custom_norm_one.innerText = newNorms.one;
  custom_norm_two.innerText = newNorms.two;
  custom_norm_four.innerText = newNorms.four;
}

export function loadNorms() {
  let checkSavedNorms;
  if (!this) {
    checkSavedNorms = 1;
  } else {
    if (this.id === "load_default") {
      shiftNorms.five = 55;
      shiftNorms.one = 60;
      shiftNorms.two = 60;
      shiftNorms.four = 60;
      this.innerText = "✅";
      load_custom.innerText = "Load";
      const inputs = document.querySelector("#SAL").querySelectorAll("input");
      const mainScreenButtonLabel = document.querySelector(
        "#main_screen_button_label"
      );
      mainScreenButtonLabel.innerText = "(Default norms loaded)";
      inputs.forEach((input) => {
        doSAL(input);
      });
      custom_norms_modal.hidePopover();

      return;
    }
  }

  if (checkSavedNorms || this.id === "load_custom") {
    const norms = JSON.parse(localStorage.getItem("customNorms"));
    if (!norms || Object.keys(norms).length === 0) {
      const mainScreenButtonLabel = document.querySelector(
        "#main_screen_button_label"
      );
      mainScreenButtonLabel.innerText = "(Default norms loaded)";
      return;
    }
    load_custom.innerText = "✅";
    load_default.innerText = "Load";
    const normsContainer = document.querySelector(".norms-container");
    const normsArray = Object.values(norms);
    custom_norm_five.innerText = normsArray[0];
    custom_norm_one.innerText = normsArray[1];
    custom_norm_two.innerText = normsArray[2];
    custom_norm_four.innerText = normsArray[3];
    shiftNorms.five = normsArray[0];
    shiftNorms.one = normsArray[1];
    shiftNorms.two = normsArray[2];
    shiftNorms.four = normsArray[3];
    const mainScreenButtonLabel = document.querySelector(
      "#main_screen_button_label"
    );
    mainScreenButtonLabel.innerText = "(Custom norms loaded)";
  }
  const inputs = document.querySelector("#SAL").querySelectorAll("input");
  inputs.forEach((input) => {
    doSAL(input);
  });
  custom_norms_modal.hidePopover();
}

loadNorms();

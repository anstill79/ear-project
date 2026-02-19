export const shiftNorms = {
  five: 55,
  one: 60,
  two: 60,
  four: 60,
};

// Configuration for frequencies to avoid magic strings and repetitive code
const FREQS = ["five", "one", "two", "four"];
const DEFAULTS = { five: 55, one: 60, two: 60, four: 60 };

/** * Helper to update the UI labels and trigger calculation
 */
const updateUI = (label) => {
  document.querySelector("#main_screen_button_label").innerText = label;
  document.querySelectorAll("#SAL input").forEach(doSAL);
  custom_norms_modal.hidePopover();
};

export function saveNewNorms() {
  const inputs = [...document.querySelectorAll(".norms-container input")];

  // Validation: Check if all are integers
  const isValid = inputs.every(
    (i) => i.value.trim() !== "" && Number.isInteger(Number(i.value)),
  );

  if (!isValid)
    return alert("Please enter numeric values for all frequencies.");

  const newNorms = {
    five: newNorm500.value,
    one: newNorm1k.value,
    two: newNorm2k.value,
    four: newNorm4k.value,
  };

  localStorage.setItem("customNorms", JSON.stringify(newNorms));
  alert("New norms saved!");

  // Clear inputs and refresh display
  inputs.forEach((i) => (i.value = ""));
  FREQS.forEach((f) => (window[`custom_norm_${f}`].innerText = newNorms[f]));
}

export function loadNorms(mode = "auto") {
  const saved = JSON.parse(localStorage.getItem("customNorms"));
  const isDefault = this?.id === "load_default";

  // Determine which data to use
  const targetNorms =
    isDefault || (!saved && mode === "auto") ? DEFAULTS : saved;

  if (!targetNorms) return updateUI("(Default norms loaded)");

  // Update logic
  Object.assign(shiftNorms, targetNorms);

  // Update UI Elements
  FREQS.forEach((f) => (window[`custom_norm_${f}`].innerText = targetNorms[f]));

  // Toggle checkmarks
  load_default.innerText = isDefault ? "✅" : "Load";
  load_custom.innerText = !isDefault ? "✅" : "Load";

  updateUI(isDefault ? "(Default norms loaded)" : "(Custom norms loaded)");
}

// Initialize on load
loadNorms();

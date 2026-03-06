const FREQS = ["five", "one", "two", "four"];
const FREQ_IDS = { five: "500Hz", one: "1kHz", two: "2kHz", four: "4kHz" };
const DEFAULTS = { five: 55, one: 60, two: 60, four: 60 };
const LS_KEY = "customNorms";

// ── localStorage helpers ──────────────────────────────────────────────────────

/** Persist a norms object to localStorage. */
function saveNormsToLocalStorage(norms) {
  localStorage.setItem(LS_KEY, JSON.stringify(norms));
}

/** Retrieve saved norms from localStorage, or null if none exist. */
function loadNormsFromLocalStorage() {
  const raw = localStorage.getItem(LS_KEY);
  return raw ? JSON.parse(raw) : null;
}

// ── UI helpers ────────────────────────────────────────────────────────────────

/** Write norm values into every Norm Shift input row and re-run the chart. */
function setNormInputs(norms) {
  FREQS.forEach((f) => {
    const freqId = FREQ_IDS[f];
    document.getElementById(`nr${freqId}`).value = norms[f];
    document.getElementById(`nl${freqId}`).value = norms[f];
  });
  updateChart(); // defined in main.js
}

/** Refresh the "Custom Norms" display row inside the modal. */
function updateCustomNormDisplay(norms) {
  FREQS.forEach((f) => {
    const el = document.getElementById(`custom_norm_${f}`);
    if (el) el.innerText = norms ? norms[f] : "-";
  });
}

/** Reset both action buttons to their default "Load" label. */
function resetButtonLabels() {
  document.getElementById("load_custom").innerText = "Load";
  document.getElementById("load_default").innerText = "Load";
}

// ── Public functions ──────────────────────────────────────────────────────────

/**
 * Read the four input fields in the modal, validate them, save to
 * localStorage, and refresh the display row.
 */
function saveNewNorms() {
  const inputs = [
    document.getElementById("newNorm500"),
    document.getElementById("newNorm1k"),
    document.getElementById("newNorm2k"),
    document.getElementById("newNorm4k"),
  ];

  const isValid = inputs.every(
    (i) => i.value.trim() !== "" && Number.isInteger(Number(i.value))
  );

  if (!isValid) return alert("Please enter whole-number values for all frequencies.");

  const newNorms = {
    five: Number(inputs[0].value),
    one:  Number(inputs[1].value),
    two:  Number(inputs[2].value),
    four: Number(inputs[3].value),
  };

  saveNormsToLocalStorage(newNorms);
  updateCustomNormDisplay(newNorms);
  inputs.forEach((i) => (i.value = ""));
  alert("Custom norms saved!");
}

/**
 * Load previously saved custom norms from localStorage into the norm
 * input fields and close the modal.
 */
function loadCustomNorms() {
  const saved = loadNormsFromLocalStorage();
  if (!saved) return alert("No custom norms saved yet. Enter values and click Save first.");

  setNormInputs(saved);
  resetButtonLabels();
  document.getElementById("load_custom").innerText = "✅";
  document.getElementById("custom_norms_modal").hidePopover();
}

/**
 * Reset the norm input fields to the application default values and
 * close the modal.
 */
function loadDefaultNorms() {
  setNormInputs(DEFAULTS);
  resetButtonLabels();
  document.getElementById("load_default").innerText = "✅";
  document.getElementById("custom_norms_modal").hidePopover();
}

// ── Initialisation ────────────────────────────────────────────────────────────

// Populate the display row with any previously saved norms on page load.
updateCustomNormDisplay(loadNormsFromLocalStorage());

// Wire up modal buttons.
document.getElementById("saveNormsButton").addEventListener("click", saveNewNorms);
document.getElementById("load_custom").addEventListener("click", loadCustomNorms);
document.getElementById("load_default").addEventListener("click", loadDefaultNorms);

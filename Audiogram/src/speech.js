// Speech audiometry table: thresholds (SRT/SDT/SAT), word recognition, and
// aided MSTB testing. The DOM is the source of truth; rows are added and
// removed in place and read back by getSpeechSummary().

const range = (n) => Array.from({ length: n }, (_, i) => i + 1);

export const WR_LISTS = [
  ["NU-6", ["1A", "2A", "3A", "4A", "1B", "2B", "3B", "4B"].map((l) => `NU-6 ${l}`)],
  ["NU-6 OBD", ["1A", "2A", "3A", "4A"].map((l) => `NU-6 OBD ${l}`)],
  ["CID W-22", range(4).map((n) => `W-22 List ${n}`)],
  ["Pediatric", [
    ...range(3).map((n) => `PBK-50 List ${n}`),
    ...range(4).map((n) => `WIPI List ${n}`),
    ...range(4).map((n) => `NU-CHIPS List ${n}`),
  ]],
];

// MSTB materials. `unit` is what the score is reported in.
export const MSTB_TESTS = {
  CNC: { label: "CNC", lists: range(10).map((n) => `List ${n}`), unit: "%" },
  AzBioQ: { label: "AzBio quiet", lists: range(8).map((n) => `List ${n}`), unit: "%" },
  AzBio10: { label: "AzBio +10", lists: range(8).map((n) => `List ${n}`), unit: "%" },
  AzBio5: { label: "AzBio +5", lists: range(8).map((n) => `List ${n}`), unit: "%" },
  BKB: { label: "BKB-SIN", lists: range(8).map((n) => `Pair ${n}`), unit: "dB SNR" },
};

const EAR_CLASS = { R: "sp-right", L: "sp-left", B: "sp-bin" };

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  }
  node.append(...children);
  return node;
}

function option(value, text = value) {
  return el("option", { value, text });
}

function blankOption() {
  return option("", "--");
}

function score(ear, unit, field, attrs = {}) {
  return el("label", { class: `sp-score ${EAR_CLASS[ear]}` }, [
    el("input", { type: "number", class: "sp-score-input", "data-field": field, ...attrs }),
    el("span", { class: "sp-unit", text: unit }),
  ]);
}

function meta(field, attrs = {}) {
  return el("input", {
    type: "number",
    class: "sp-meta",
    "data-field": field,
    step: "5",
    min: "-10",
    max: "120",
    ...attrs,
  });
}

function modeSelect() {
  return el("select", { class: "sp-meta sp-mode", "data-field": "mode", "aria-label": "Mode" }, [
    blankOption(),
    option("Recorded"),
    option("MLV"),
  ]);
}

function removeButton() {
  return el("button", {
    type: "button",
    class: "sp-remove no-print",
    title: "Remove row",
    "aria-label": "Remove row",
    text: "×",
  });
}

function threshRow(ear) {
  const type = el("select", { class: "sp-meta sp-type", "data-field": "type" }, [
    option("SRT"),
    option("SDT"),
    option("SAT"),
  ]);
  return el("div", { class: "sp-row sp-row-thresh" }, [
    type,
    score(ear, "dB", "score", { step: "5", min: "-10", max: "120" }),
    el("span"),
    meta("mask"),
    modeSelect(),
    removeButton(),
  ]);
}

function wrListSelect() {
  const select = el("select", { class: "sp-meta sp-list", "data-field": "list" }, [blankOption()]);
  for (const [group, lists] of WR_LISTS) {
    select.append(el("optgroup", { label: group }, lists.map((l) => option(l))));
  }
  return select;
}

function wrRow(ear) {
  return el("div", { class: "sp-row sp-row-wr" }, [
    wrListSelect(),
    score(ear, "%", "score", { step: "4", min: "0", max: "100" }),
    meta("level"),
    ear === "B" ? el("span") : meta("mask"),
    modeSelect(),
    removeButton(),
  ]);
}

function aidedRow(ear) {
  const test = el("select", { class: "sp-meta sp-test", "data-field": "test" }, [
    blankOption(),
    ...Object.entries(MSTB_TESTS).map(([key, t]) => option(key, t.label)),
  ]);
  const list = el("select", { class: "sp-meta", "data-field": "list" }, [blankOption()]);
  const scoreBox = score(ear, "%", "score", { min: "-10", max: "100" });
  test.addEventListener("change", () => {
    const t = MSTB_TESTS[test.value];
    list.replaceChildren(blankOption(), ...(t ? t.lists.map((l) => option(l)) : []));
    scoreBox.querySelector(".sp-unit").textContent = t ? t.unit : "%";
  });
  return el("div", { class: "sp-row sp-row-aided" }, [
    test,
    list,
    scoreBox,
    meta("level", { min: "0", max: "100" }),
    removeButton(),
  ]);
}

// A row with anything entered takes two clicks to remove: the first arms it
// (row tints red, button turns solid), the second removes it. Clicking
// elsewhere or waiting a few seconds disarms it.
function rowHasData(row) {
  return [...row.querySelectorAll("input")].some((input) => input.value !== "") ||
    [...row.querySelectorAll('select:not([data-field="type"]):not([data-field="mode"])')]
      .some((select) => select.value !== "");
}

function armRemove(row) {
  const button = row.querySelector(".sp-remove");
  row.classList.add("sp-armed");
  button.title = "Click again to remove";
  const disarm = () => {
    row.classList.remove("sp-armed");
    button.title = "Remove row";
    clearTimeout(timer);
    document.removeEventListener("pointerdown", onOutside, true);
  };
  const onOutside = (event) => {
    if (event.target !== button) disarm();
  };
  const timer = setTimeout(disarm, 4000);
  document.addEventListener("pointerdown", onOutside, true);
}

const ROW_BUILDERS = { thresh: threshRow, wr: wrRow, aided: aidedRow };

function addRow(block) {
  const row = ROW_BUILDERS[block.dataset.kind](block.dataset.ear);
  block.querySelector(".sp-rows").append(row);
  applyModeDefault(row);
  syncEmpty(block);
  return row;
}

// Mode follows the test: setting it on one SRT row fills every other SRT row
// (either ear, and rows added later); word rec likewise across R, L and
// binaural. A row whose mode was picked by hand keeps it, and a binaural
// pick stays on its own row.
const modeDefaults = {};

function modeKey(row) {
  return row.classList.contains("sp-row-wr")
    ? "WR"
    : row.querySelector('[data-field="type"]').value;
}

function applyModeDefault(row) {
  const mode = row.querySelector('[data-field="mode"]');
  if (mode && !row.dataset.modeSet) mode.value = modeDefaults[modeKey(row)] ?? "";
}

function setModeDefault(row) {
  const key = modeKey(row);
  modeDefaults[key] = row.querySelector('[data-field="mode"]').value;
  document.querySelectorAll(".sp-row-thresh, .sp-row-wr").forEach((other) => {
    if (modeKey(other) === key) applyModeDefault(other);
  });
}

// Blocks with no rows collapse on screen to their heading + add button
// and are left off the printed report.
function syncEmpty(block) {
  block.classList.toggle("sp-empty", !block.querySelector(".sp-row"));
}

function blocks(kind, ear) {
  return document.querySelector(`.sp-block[data-kind="${kind}"][data-ear="${ear}"]`);
}

// Non-test-ear masking for the row at the same position in each ear:
// presentation level - 35, at least 5 dB above the other ear's level,
// and none needed at 40 dB or below.
function calcMasking(kind) {
  if (!document.getElementById("speech_calc_masking").checked) return;
  const levelField = kind === "thresh" ? "score" : "level";
  const rowsR = blocks(kind, "R").querySelectorAll(".sp-row");
  const rowsL = blocks(kind, "L").querySelectorAll(".sp-row");
  const pairs = [
    [rowsR, rowsL],
    [rowsL, rowsR],
  ];
  for (const [testRows, otherRows] of pairs) {
    testRows.forEach((row, i) => {
      const level = parseFloat(row.querySelector(`[data-field="${levelField}"]`).value);
      if (Number.isNaN(level)) return;
      const other = parseFloat(
        otherRows[i]?.querySelector(`[data-field="${levelField}"]`).value
      );
      let mask = level - 35;
      if (!Number.isNaN(other) && mask <= other) mask = other + 5;
      row.querySelector('[data-field="mask"]').value = level <= 40 ? "" : mask;
    });
  }
}

export function initSpeech() {
  document.querySelectorAll(".sp-block").forEach((block) => {
    const defaults = Number(block.dataset.defaultRows || 0);
    for (let i = 0; i < defaults; i++) addRow(block);
    syncEmpty(block);

    block.querySelector(".sp-add").addEventListener("click", () => {
      addRow(block).querySelector("input, select").focus();
    });
    block.addEventListener("click", (event) => {
      if (!event.target.matches(".sp-remove")) return;
      const row = event.target.closest(".sp-row");
      if (rowHasData(row) && !row.classList.contains("sp-armed")) {
        armRemove(row);
        return;
      }
      row.remove();
      syncEmpty(block);
    });
    if (block.dataset.kind !== "aided" && block.dataset.ear !== "B") {
      block.addEventListener("change", (event) => {
        if (event.target.dataset.field === "score" || event.target.dataset.field === "level") {
          calcMasking(block.dataset.kind);
        }
      });
    }
  });

  document.querySelector(".speech-section").addEventListener("change", (event) => {
    const row = event.target.closest(".sp-row");
    if (event.target.dataset.field === "mode") {
      row.dataset.modeSet = "true";
      // Binaural follows the ears but doesn't lead them
      if (row.closest(".sp-block").dataset.ear !== "B") setModeDefault(row);
    } else if (event.target.dataset.field === "type") {
      applyModeDefault(row);
    }
  });

  document.getElementById("speech_calc_masking").addEventListener("change", () => {
    calcMasking("thresh");
    calcMasking("wr");
  });
}

export function updateSpeechPTA(ptaR, ptaL) {
  const format = (pta) => (pta === undefined ? "–" : `${Math.round(pta)} dB`);
  document.getElementById("PTA_R_speech").textContent = format(ptaR);
  document.getElementById("PTA_L_speech").textContent = format(ptaL);
}

// Binaural has no threshold block, so a missing block reads as no rows
function readRows(kind, ear) {
  const block = blocks(kind, ear);
  if (!block) return [];
  return [...block.querySelectorAll(".sp-row")].map((row) =>
    Object.fromEntries(
      [...row.querySelectorAll("[data-field]")].map((f) => [f.dataset.field, f.value])
    )
  );
}

export function getSpeechSummary(ear) {
  return {
    thresholds: readRows("thresh", ear).filter((r) => r.score !== ""),
    wordRec: readRows("wr", ear).filter((r) => r.score !== ""),
    aided: readRows("aided", ear).filter((r) => r.score !== ""),
  };
}

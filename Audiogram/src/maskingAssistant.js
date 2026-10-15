import { audiogramData, BC_R, BC_L, N_STANDARD } from "./dataAndImages.js";

// Masking assistant. Flags air conduction thresholds that the non-test ear
// may have heard instead (cross-hearing): the tone reaches the other cochlea
// about IA dB softer, so a threshold is at risk when
//   AC (test ear) - interaural attenuation >= BC (non-test ear).
//
// Interaural attenuation by transducer, one value per x slot (see N_FREQ in
// dataAndImages.js; slot 2 is only the 250-500 join). These are the
// conservative minimum values in common clinical use, so a flag means
// "masking may be needed", not that cross-hearing happened:
//   supra-aural and circumaural headphones: 40 dB at every frequency
//   insert earphones: 60 dB up to 1000 Hz, 50 dB above
// The extended high frequencies have no agreed values and reuse 8000 Hz's.
const IA_BY_TRANSDUCER = {
  supraaural: Array(15).fill(40),
  circumaural: Array(15).fill(40),
  insert: [60, 60, 60, 60, 60, 60, 50, 50, 50, 50, 50, 50, 50, 50, 50],
};
// With no transducer picked, assume the smallest IA so nothing is missed
const FALLBACK_TRANSDUCER = "supraaural";

const TRANSDUCER_NAMES = {
  supraaural: "Supra-aural",
  circumaural: "Circumaural",
  insert: "Inserts",
};

const HZ = ["125", "250", "", "500", "750", "1k", "1.5k", "2k", "3k", "4k", "6k", "8k", "10k", "12.5k", "16k"];
const EAR_NAMES = { R: "right", L: "left" };
const MASKED_AC = { R: "triangle", L: "rect" };
const UNMASKED_BC = { R: BC_R, L: BC_L };

const state = {
  enabled: false,
  transducer: FALLBACK_TRANSDUCER,
  transducerChosen: false,
  // Per ear, per x slot: null, or { provisional, detail } for an at-risk point
  risk: { R: [], L: [] },
  anyRisk: false,
  printing: false,
};

const isNumber = (value) => value !== null && value !== undefined;

// The best estimate of the non-test ear's cochlea at slot i. Its own BC is
// used when tested; unmasked BC from either side counts too, since it shows
// the better cochlea, which is at least as sensitive. A BC no response is
// above its level, so using that level only flags more. With no BC, the
// non-test ear's AC stands in (assumes no air-bone gap) and the flag is
// marked provisional.
function nonTestCochlea(testEar, i) {
  const otherEar = testEar === "R" ? "L" : "R";
  if (i < N_STANDARD) {
    const candidates = [];
    const otherBC = audiogramData[`thresh_BC_${otherEar}`][i];
    if (isNumber(otherBC)) candidates.push({ dB: otherBC, label: `${EAR_NAMES[otherEar]} BC` });
    const testBC = audiogramData[`thresh_BC_${testEar}`][i];
    if (isNumber(testBC) && audiogramData[`symbols_BC_${testEar}`][i] === UNMASKED_BC[testEar]) {
      candidates.push({ dB: testBC, label: "unmasked BC" });
    }
    if (candidates.length) {
      const best = candidates.reduce((a, b) => (b.dB < a.dB ? b : a));
      return { ...best, provisional: false };
    }
  }
  const otherAC = audiogramData[`thresh_AC_${otherEar}`][i];
  if (isNumber(otherAC)) {
    return { dB: otherAC, label: `${EAR_NAMES[otherEar]} AC, no BC yet`, provisional: true };
  }
  return null;
}

function assessEar(ear, ia) {
  const thresh = audiogramData[`thresh_AC_${ear}`];
  const tested = audiogramData[`interOctTested_AC_${ear}`];
  const symbols = audiogramData[`symbols_${ear}`];
  return thresh.map((ac, i) => {
    // Slot 2 and untested inter-octaves are drawn from their neighbours
    if (i === 2 || !isNumber(ac) || tested[i] === 0) return null;
    // Already masked: the clinician has dealt with it
    if (symbols[i] === MASKED_AC[ear]) return null;
    const cochlea = nonTestCochlea(ear, i);
    if (!cochlea) return null;
    const reaching = ac - ia[i];
    if (reaching < cochlea.dB) return null;
    return {
      provisional: cochlea.provisional,
      detail:
        `${HZ[i]} Hz: AC ${ac} − IA ${ia[i]} = ${reaching} dB reaches the ` +
        `${EAR_NAMES[ear === "R" ? "L" : "R"]} ear, ≥ ${cochlea.label} ${cochlea.dB}`,
    };
  });
}

function assess() {
  const ia = IA_BY_TRANSDUCER[state.transducer];
  state.risk.R = assessEar("R", ia);
  state.risk.L = assessEar("L", ia);
  state.anyRisk = [...state.risk.R, ...state.risk.L].some(Boolean);
}

// ---- Drawing --------------------------------------------------------------

const RISK_RGB = "236, 132, 0";
const PULSE_MS = 1400;
const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");

// Chart plugin: an amber halo around each at-risk AC symbol, with a ring
// that swells and fades while the assistant is on. Provisional flags (no BC
// for the other ear yet) get a dashed halo. AC datasets are marked with
// maskingRisk: { ear }.
export const MaskingRiskPlugin = {
  id: "maskingRisk",
  afterDatasetsDraw(chart) {
    if (!state.enabled || !state.anyRisk || state.printing) return;
    const { ctx } = chart;
    const still = reducedMotion?.matches;
    const phase = still ? 0 : (performance.now() % PULSE_MS) / PULSE_MS;

    chart.data.datasets.forEach((dataset, index) => {
      const ear = dataset.maskingRisk?.ear;
      if (!ear || !chart.isDatasetVisible(index)) return;
      const sizes = audiogramData[`pointSize_AC_${ear}`];
      chart.getDatasetMeta(index).data.forEach((point, i) => {
        const risk = state.risk[ear][i];
        if (!risk || point.skip) return;
        const r = Math.max(sizes[i], 4) + 4;
        ctx.save();
        ctx.lineWidth = 2;
        ctx.setLineDash(risk.provisional ? [3, 3] : []);
        ctx.fillStyle = `rgba(${RISK_RGB}, 0.14)`;
        ctx.strokeStyle = `rgba(${RISK_RGB}, 0.9)`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (!still) {
          ctx.setLineDash([]);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = `rgba(${RISK_RGB}, ${0.7 * (1 - phase)})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, r + 9 * phase, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });
    });
  },
};

// Redraws the charts (no update) to run the pulse, only while something is
// flagged and the chart is on screen.
let charts = [];
let frame = null;
let lastDraw = 0;
function animate(now) {
  frame = null;
  if (!state.enabled || !state.anyRisk || state.printing || reducedMotion?.matches) return;
  if (now - lastDraw > 33) {
    lastDraw = now;
    charts.forEach((chart) => {
      if (chart.canvas.offsetParent !== null) chart.draw();
    });
  }
  frame = requestAnimationFrame(animate);
}
function syncAnimation() {
  if (state.enabled && state.anyRisk && !frame) frame = requestAnimationFrame(animate);
}

// ---- Page -----------------------------------------------------------------

let toggleButton;
let statusText;
let onChange = () => {};

function iaSummary() {
  const values = [...new Set(IA_BY_TRANSDUCER[state.transducer])];
  return values.length === 1 ? `${values[0]} dB` : `${values.join("/")} dB`;
}

// The toolbar status and the masking panel's M buttons
function syncPage() {
  toggleButton.setAttribute("aria-pressed", String(state.enabled));
  statusText.hidden = !state.enabled;

  const count = { R: 0, L: 0 };
  document.querySelectorAll("[data-masking][data-ear][data-index]").forEach((button) => {
    const risk = state.enabled ? state.risk[button.dataset.ear][Number(button.dataset.index)] : null;
    if (risk) count[button.dataset.ear]++;
    button.classList.toggle("mask-risk", Boolean(risk));
    button.classList.toggle("mask-risk-provisional", Boolean(risk?.provisional));
    if (risk) button.title = `Cross-hearing possible. ${risk.detail}`;
    else button.removeAttribute("title");
  });
  if (!state.enabled) return;

  const transducer = state.transducerChosen
    ? TRANSDUCER_NAMES[state.transducer]
    : "No transducer set, assuming headphones";
  const flagged = count.R + count.L;
  const result = flagged
    ? `${flagged} at risk (R ${count.R}, L ${count.L})`
    : "No cross-hearing risk";
  statusText.textContent = `${transducer} · IA ${iaSummary()} · ${result}`;
  statusText.classList.toggle("has-risk", flagged > 0);
}

// Called from updateCharts, before the charts redraw
export function refreshMaskingAssistant() {
  if (!toggleButton) return;
  assess();
  syncPage();
  syncAnimation();
}

export function setMaskingAssistant(on) {
  state.enabled = on;
  try {
    localStorage.setItem("audiogramMaskingAssistant", on ? "on" : "off");
  } catch {}
  onChange();
}

function readTransducer(select) {
  const value = select.value;
  state.transducerChosen = value in IA_BY_TRANSDUCER;
  state.transducer = state.transducerChosen ? value : FALLBACK_TRANSDUCER;
}

// chartList: every audiogram chart; redraw: updates the charts (updateCharts)
export function initMaskingAssistant(chartList, redraw) {
  charts = chartList;
  onChange = redraw;
  toggleButton = document.getElementById("masking_assistant_button");
  statusText = document.getElementById("masking_assistant_status");
  toggleButton.addEventListener("click", () => setMaskingAssistant(!state.enabled));

  const select = document.getElementById("select_transducer");
  readTransducer(select);
  select.addEventListener("change", () => {
    readTransducer(select);
    onChange();
  });

  // The halos are a testing aid, so they stay off the printout
  window.addEventListener("beforeprint", () => {
    state.printing = true;
    charts.forEach((chart) => chart.draw());
  });
  window.addEventListener("afterprint", () => {
    state.printing = false;
    charts.forEach((chart) => chart.draw());
    syncAnimation();
  });
  reducedMotion?.addEventListener?.("change", () => {
    charts.forEach((chart) => chart.draw());
    syncAnimation();
  });

  try {
    state.enabled = localStorage.getItem("audiogramMaskingAssistant") === "on";
  } catch {}
}

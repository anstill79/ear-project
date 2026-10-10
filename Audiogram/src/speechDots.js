import { audiogramData } from "./dataAndImages.js";

// "Count-the-dots" speech audibility (Killion & Mueller, Hearing Journal
// 2010, 63(1):10; after Mueller & Killion 1990). 100 dots sit in the
// long-term speech area; each dot audible to an ear (at or below its air
// conduction threshold on the chart) is worth 1% of the articulation index.
//
// The dots are rebuilt from the same model the chart is drawn from, the
// ANSI S3.5-1997 SII: each 1/3-octave band gets dots in proportion to its
// importance for average speech, spread evenly over that band's 30 dB speech
// range. Counting them therefore matches the SII's audibility weighting in
// quiet; positions are close to, not traced from, the published chart.

// [band centre Hz, importance, speech range top (soft) in dB HL]
const BANDS = [
  [160, 0.0083, 30],
  [200, 0.0095, 30],
  [250, 0.015, 28],
  [315, 0.0289, 27],
  [400, 0.044, 25],
  [500, 0.0578, 25],
  [630, 0.0653, 24],
  [800, 0.0711, 23],
  [1000, 0.0818, 22],
  [1250, 0.0844, 22],
  [1600, 0.0882, 22],
  [2000, 0.0898, 23],
  [2500, 0.0868, 23],
  [3150, 0.0844, 23],
  [4000, 0.0771, 22],
  [5000, 0.0527, 22],
  [6300, 0.0364, 22],
  [8000, 0.0185, 23],
];
const SPEECH_RANGE_DB = 30;
const TOTAL_DOTS = 100;

// Whole dots per band, by largest remainder so they add up to exactly 100
function dotsPerBand() {
  const exact = BANDS.map(([, importance]) => importance * TOTAL_DOTS);
  const counts = exact.map(Math.floor);
  let left = TOTAL_DOTS - counts.reduce((a, b) => a + b, 0);
  exact
    .map((value, i) => ({ i, rest: value - Math.floor(value) }))
    .sort((a, b) => b.rest - a.rest)
    .slice(0, left)
    .forEach(({ i }) => counts[i]++);
  return counts;
}

// Each band's dots are stacked evenly through its speech range and staggered
// across the band's width so the area reads as a scatter rather than columns.
export const SPEECH_DOTS = (() => {
  const dots = [];
  dotsPerBand().forEach((n, band) => {
    const [hz, , top] = BANDS[band];
    for (let k = 0; k < n; k++) {
      const dB = top + ((k + 0.5) / n) * SPEECH_RANGE_DB;
      // Golden-ratio stagger within ±1/6 octave (one 1/3-octave band)
      const spread = (((k * 0.618034 + band * 0.37) % 1) - 0.5) / 3.6;
      dots.push({ hz: hz * 2 ** spread, dB });
    }
  });
  return dots;
})();

// Frequencies at the audiogram's x categories (index 2 is the 375 Hz slot
// between 250 and 500). Positions between them are interpolated on a log scale.
const AXIS_HZ = [125, 250, 375, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];

export function hzToIndex(hz) {
  if (hz <= AXIS_HZ[0]) return 0;
  for (let i = 1; i < AXIS_HZ.length; i++) {
    if (hz <= AXIS_HZ[i]) {
      const lo = Math.log(AXIS_HZ[i - 1]);
      return i - 1 + (Math.log(hz) - lo) / (Math.log(AXIS_HZ[i]) - lo);
    }
  }
  return AXIS_HZ.length - 1;
}

// AC thresholds for one ear with no responses counted at the level tested,
// so a dot is only audible if it is louder than the limits of the audiometer.
function acThresholds(ear) {
  const thresh = audiogramData[`thresh_AC_${ear}`];
  const nr = audiogramData[`thresh_NR_${ear}`];
  return thresh.map((value, i) => (value ?? nr[i] ?? null));
}

// Threshold at a fractional x index, interpolated between the nearest
// measured points and held flat past the first and last. null if no data.
function thresholdAt(thresholds, x) {
  let below = null;
  let above = null;
  thresholds.forEach((value, i) => {
    if (value === null) return;
    if (i <= x && (below === null || i > below)) below = i;
    if (i >= x && (above === null || i < above)) above = i;
  });
  if (below === null && above === null) return null;
  if (below === null) return thresholds[above];
  if (above === null || above === below) return thresholds[below];
  const t = (x - below) / (above - below);
  return thresholds[below] + t * (thresholds[above] - thresholds[below]);
}

// For each dot: true if audible to the ear, false if not, null if the ear
// has no thresholds yet.
export function dotAudibility(ear) {
  const thresholds = acThresholds(ear);
  return SPEECH_DOTS.map((dot) => {
    const t = thresholdAt(thresholds, hzToIndex(dot.hz));
    return t === null ? null : dot.dB >= t;
  });
}

// Audible dot count (= AI %) for one ear, or null with no thresholds
export function countAudibleDots(ear) {
  const audible = dotAudibility(ear);
  if (audible.every((a) => a === null)) return null;
  return audible.filter(Boolean).length;
}

const STYLE = {
  neutral: { fill: "rgba(90, 90, 90, 0.6)", stroke: null },
  audible: { fill: "rgba(30, 30, 30, 0.9)", stroke: null },
  audibleR: { fill: "rgba(210, 0, 0, 0.85)", stroke: null },
  audibleL: { fill: "rgba(0, 0, 210, 0.85)", stroke: null },
  inaudible: { fill: "rgba(255, 255, 255, 0.9)", stroke: "rgba(110, 110, 110, 0.75)" },
};

function dotStyle(ears, audibility, i) {
  const heard = ears.map((ear) => audibility[ear][i]);
  if (heard.every((h) => h === null)) return STYLE.neutral;
  if (ears.length === 1) return heard[0] ? STYLE.audible : STYLE.inaudible;
  const [r, l] = heard;
  if (r && l) return STYLE.audible;
  if (r) return STYLE.audibleR;
  if (l) return STYLE.audibleL;
  return STYLE.inaudible;
}

// Chart plugin. Set plugins.speechDots to { ears: ["R"] } (or both ears for
// the overlay), or false to turn it off. Dots are drawn under the symbols;
// audible dots are solid, inaudible ones hollow. With both ears, a dot heard
// by only one ear takes that ear's color. The audible count (the AI) shows
// in the chart's top right corner.
export const SpeechDotsPlugin = {
  id: "speechDots",
  beforeDatasetsDraw(chart, args, options) {
    const ears = options.ears;
    if (!ears?.length) return;
    const { ctx, chartArea, scales } = chart;
    const audibility = Object.fromEntries(ears.map((ear) => [ear, dotAudibility(ear)]));
    const radius = Math.max(2, (chartArea.right - chartArea.left) / 130);

    ctx.save();
    ctx.lineWidth = 1;
    SPEECH_DOTS.forEach((dot, i) => {
      const x = scales.x.getPixelForValue(hzToIndex(dot.hz));
      const y = scales.y.getPixelForValue(dot.dB);
      const style = dotStyle(ears, audibility, i);
      ctx.beginPath();
      ctx.arc(x, y, style.stroke ? radius - 0.5 : radius, 0, Math.PI * 2);
      ctx.fillStyle = style.fill;
      ctx.fill();
      if (style.stroke) {
        ctx.strokeStyle = style.stroke;
        ctx.stroke();
      }
    });
    ctx.restore();
  },
  afterDatasetsDraw(chart, args, options) {
    const ears = options.ears;
    if (!ears?.length) return;
    const { ctx, chartArea } = chart;
    const counts = ears
      .map((ear) => ({ ear, count: countAudibleDots(ear) }))
      .filter(({ count }) => count !== null);
    if (!counts.length) return;

    // Top right, in the -10 to 0 dB row that thresholds rarely reach
    const text = counts
      .map(({ ear, count }) => (ears.length > 1 ? `${ear} ${count}%` : `${count}%`))
      .join("  ");
    ctx.save();
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.font = "600 10px Rubik, sans-serif";
    const x = chartArea.right - 4;
    const y = chartArea.top + 3;
    const label = "AI ";
    let width = ctx.measureText(text).width;
    ctx.font = "9px Rubik, sans-serif";
    width += ctx.measureText(label).width;
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillRect(x - width - 4, y - 2, width + 8, 14);

    // Draw right to left so each ear keeps its color
    ctx.font = "600 10px Rubik, sans-serif";
    let right = x;
    counts
      .slice()
      .reverse()
      .forEach(({ ear, count }, i) => {
        const part = (ears.length > 1 ? `${ear} ${count}%` : `${count}%`) + (i ? "  " : "");
        ctx.fillStyle =
          ears.length > 1
            ? ear === "R" ? "rgba(200, 0, 0, 0.9)" : "rgba(0, 0, 200, 0.9)"
            : "rgba(40, 40, 40, 0.9)";
        ctx.fillText(part, right, y);
        right -= ctx.measureText(part).width;
      });
    ctx.font = "9px Rubik, sans-serif";
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillText(label, right, y + 1);
    ctx.restore();
  },
};

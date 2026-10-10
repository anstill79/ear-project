import { audiogramData } from "./dataAndImages.js";

// "Count-the-dots" speech audibility (Killion & Mueller, Hearing Journal
// 2010, 63(1):10). 100 dots sit in the long-term speech area; each dot
// audible to an ear (at or below its air conduction threshold on the chart)
// is worth 1% of the articulation index.
//
// Dot positions are digitized from the published 2010 chart: one column per
// 1/3-octave band, at the frequency where the chart draws it (to 5 Hz; a few
// sit slightly above the nominal band centre), levels to 0.5 dB HL.
// [column Hz, [dot levels in dB HL]]
const KILLION_DOTS = [
  [200, [27]],
  [250, [24, 33.5]],
  [320, [20, 29.5, 39]],
  [400, [21.5, 28.5, 36, 44]],
  [500, [22.5, 27.5, 32.5, 37, 42, 47]],
  [625, [22, 27.5, 33, 37, 42, 47]],
  [795, [21.5, 26, 31.5, 35, 39.5, 43.5, 47.5]],
  [1000, [21.5, 25, 28.5, 32.5, 35.5, 40, 44, 48.5]],
  [1275, [21.5, 24.5, 28, 31.5, 35, 38.5, 42.5, 46, 49.5]],
  [1600, [21.5, 24.5, 28, 31.5, 35, 38.5, 42.5, 45.5, 49.5]],
  [2000, [21.5, 24.5, 28, 31.5, 35, 38.5, 42.5, 45.5, 49.5]],
  [2545, [21.5, 24.5, 28, 31.5, 35, 38, 42.5, 45.5, 49.5]],
  [3240, [21.5, 25, 29.5, 33, 36.5, 40.5, 45, 48.5]],
  [4000, [18.5, 22.5, 27, 30.5, 34.5, 38, 41.5, 46]],
  [5045, [16, 22, 28, 35, 41.5]],
  [6320, [13.5, 21, 28, 34.5]],
  [8000, [14, 25.5]],
];

export const SPEECH_DOTS = KILLION_DOTS.flatMap(([hz, levels]) =>
  levels.map((dB) => ({ hz, dB }))
);

// Where the audiogram's x categories sit in frequency. The chart draws the
// inter-octave columns (750, 1500, 3000, 6000 Hz) and the 2nd slot halfway
// between octaves, so they are placed at the half-octave points here; between
// categories frequency is interpolated on a log scale. This keeps the dots in
// the same place relative to the octave lines as on Killion's chart.
const AXIS_HZ = [125, 250, 250 * Math.SQRT2, 500, 500 * Math.SQRT2, 1000,
  1000 * Math.SQRT2, 2000, 2000 * Math.SQRT2, 4000, 4000 * Math.SQRT2, 8000];

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
  // Speech sits below 8000 Hz, so the extended high frequencies are left out
  const thresh = audiogramData[`thresh_AC_${ear}`].slice(0, AXIS_HZ.length);
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
    // Square dots, as on the published chart
    const half = Math.max(1.8, (chartArea.right - chartArea.left) / 150);

    ctx.save();
    ctx.lineWidth = 1;
    SPEECH_DOTS.forEach((dot, i) => {
      const x = scales.x.getPixelForValue(hzToIndex(dot.hz));
      const y = scales.y.getPixelForValue(dot.dB);
      const style = dotStyle(ears, audibility, i);
      ctx.beginPath();
      const h = style.stroke ? half - 0.5 : half;
      ctx.rect(x - h, y - h, h * 2, h * 2);
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

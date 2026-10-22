// Word recognition vs. presentation level (performance-intensity function).
// Shown on demand from the speech section; the button stays disabled until an
// ear (or the binaural row set) has scores at two or more levels.

import { getSpeechSummary } from "./speech.js";

const SERIES = [
  { ear: "R", label: "Right", color: "rgb(200, 0, 0)", point: "circle" },
  { ear: "L", label: "Left", color: "rgb(0, 0, 200)", point: "crossRot" },
  { ear: "B", label: "Binaural", color: "rgb(75, 42, 122)", point: "rectRot" },
];

// Rows with a numeric score and level, lowest level first
function pointsFor(ear) {
  return getSpeechSummary(ear)
    .wordRec.map((r) => ({ x: parseFloat(r.level), y: parseFloat(r.score), list: r.list }))
    .filter((p) => !Number.isNaN(p.x) && !Number.isNaN(p.y))
    .sort((a, b) => a.x - b.x);
}

function hasMultipleLevels(points) {
  return new Set(points.map((p) => p.x)).size > 1;
}

export function initWrChart() {
  const button = document.getElementById("wr_chart_button");
  const popover = document.getElementById("wr_chart_modal");
  const canvas = document.getElementById("wr_chart_canvas");
  const empty = document.getElementById("wr_chart_empty");
  let chart = null;

  const seriesData = () =>
    SERIES.map((s) => ({ ...s, points: pointsFor(s.ear) })).filter((s) =>
      hasMultipleLevels(s.points)
    );

  function syncButton() {
    const available = seriesData().length > 0;
    button.disabled = !available;
    button.title = available
      ? "Chart word recognition score against presentation level"
      : "Enter word recognition at two or more levels to chart it";
  }

  function render() {
    const series = seriesData();
    empty.hidden = series.length > 0;
    canvas.hidden = series.length === 0;
    if (!series.length) return;

    const datasets = series.map((s) => ({
      label: s.label,
      data: s.points,
      borderColor: s.color,
      backgroundColor: s.color,
      pointStyle: s.point,
      pointRadius: 5,
      pointHoverRadius: 7,
      borderWidth: 1.5,
      showLine: true,
      tension: 0,
    }));
    const levels = series.flatMap((s) => s.points.map((p) => p.x));
    const min = Math.floor((Math.min(...levels) - 5) / 5) * 5;
    const max = Math.ceil((Math.max(...levels) + 5) / 5) * 5;

    if (chart) chart.destroy();
    chart = new Chart(canvas.getContext("2d"), {
      type: "scatter",
      data: { datasets },
      options: {
        responsive: false,
        animation: false,
        plugins: {
          // Chart.js options are global to the page's registered plugins
          datalabels: { display: false },
          crosshair: false,
          annotation: false,
          legend: {
            display: series.length > 1,
            position: "bottom",
            labels: { usePointStyle: true },
          },
          tooltip: {
            callbacks: {
              label: (item) => {
                const p = item.raw;
                return `${item.dataset.label}: ${p.y}% at ${p.x} dB HL${p.list ? ` (${p.list})` : ""}`;
              },
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            min,
            max,
            title: { display: true, text: "Presentation level (dB HL)" },
            ticks: { stepSize: 10 },
          },
          y: {
            min: 0,
            max: 100,
            title: { display: true, text: "Word recognition (%)" },
            ticks: { stepSize: 20 },
          },
        },
      },
    });
  }

  popover.addEventListener("toggle", (event) => {
    if (event.newState === "open") render();
    else if (chart) {
      chart.destroy();
      chart = null;
    }
  });
  document.querySelector(".speech-section").addEventListener("input", syncButton);
  document.querySelector(".speech-section").addEventListener("change", syncButton);
  document.querySelector(".speech-section").addEventListener("click", (event) => {
    if (event.target.matches(".sp-remove")) setTimeout(syncButton);
  });
  syncButton();
}

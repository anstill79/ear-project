import {
  audiogramData,
  oldAudiogramData,
  R_NR,
  L_NR,
} from "./dataAndImages.js";

// Crosshair for the audiograms: a vertical and a horizontal line through the
// pointer, kept inside the plot area. Set plugins.audiogramCrosshair to
// { color, width }, or false to turn it off.
const AudiogramCrosshair = {
  id: "audiogramCrosshair",
  afterEvent(chart, args) {
    const { event, inChartArea } = args;
    const point = event.type !== "mouseout" && inChartArea ? { x: event.x, y: event.y } : null;
    if (point?.x !== chart.$crosshair?.x || point?.y !== chart.$crosshair?.y) {
      chart.$crosshair = point;
      args.changed = true;
    }
  },
  afterDraw(chart, args, options) {
    const point = chart.$crosshair;
    if (!point) return;
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.strokeStyle = options.color;
    ctx.lineWidth = options.width;
    ctx.beginPath();
    ctx.moveTo(point.x, chartArea.top);
    ctx.lineTo(point.x, chartArea.bottom);
    ctx.moveTo(chartArea.left, point.y);
    ctx.lineTo(chartArea.right, point.y);
    ctx.stroke();
    ctx.restore();
  },
};

export const bigHz = [
  125,
  250,
  "",
  500,
  "",
  1000,
  "",
  2000,
  "",
  4000,
  "",
  8000,
];

export function createOptionsR(prepareMovement) {
  return {
    type: "line",
    plugins: [AudiogramCrosshair],
    data: {
      labels: bigHz,
      datasets: [
        {
          label: "AC_R",
          data: audiogramData.thresh_AC_R,
          borderWidth: 1,
          pointStyle: audiogramData.symbols_R,
          pointRadius: audiogramData.pointSize_AC_R,
          pointHoverRadius: audiogramData.pointSize_AC_R,
          pointBorderWidth: 2,
          pointBackgroundColor: "rgba(0, 0, 0, 0)",
          lineTension: 0,
          spanGaps: false,
          borderColor: "rgba(255,0,0,0.7)",
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
          fill: {
            above: "rgba(0,0,0,0)",
            below: "rgba(0,0,0,0.1)",
            target: {
              value: 25,
            },
          },
        },
        {
          label: "BC_R",
          data: audiogramData.thresh_BC_R,
          borderWidth: 0,
          pointStyle: audiogramData.symbols_BC_R,
          pointBackgroundColor: "rgba(0, 0, 0, 0)",
          pointRadius: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
          lineTension: 0,
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "AC NR arrow",
          data: audiogramData.thresh_NR_R,
          pointRadius: audiogramData.pointSize_NR_R,
          pointStyle: R_NR,
          borderWidth: 0,
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "AC NR thresh",
          data: audiogramData.thresh_NR_R,
          pointRadius: audiogramData.pointSize_NR_R,
          pointStyle: audiogramData.symbols_R,
          borderWidth: 0,
          pointBorderWidth: 2,
          pointBackgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: "rgba(255,0,0,0.3)",
          spanGaps: false,
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "BC NR arrow",
          data: audiogramData.thresh_BC_R,
          pointRadius: audiogramData.pointSize_NR_BC_R,
          pointStyle: R_NR,
          pointHoverRadius: 0,
          borderWidth: 0,
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "ghost",
          data: audiogramData.thresh_AC_L,
          pointRadius: audiogramData.pointSize_AC_L,
          borderColor: "rgba(0,0,255,0.1)",
          pointStyle: audiogramData.symbols_L,
          spanGaps: true,
          pointHoverRadius: 0,
          borderWidth: 2,
          borderDash: [5, 5],
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "old",
          data: oldAudiogramData.thresh_AC_R,
          pointRadius: oldAudiogramData.pointSize_AC_R,
          borderColor: "rgba(255,0,0,0.1)",
          pointStyle: "circle",
          spanGaps: true,
          pointHoverRadius: 0,
          borderWidth: 2,
          borderDash: [5, 5],
        },
        {
          label: "Aided_R",
          data: audiogramData.thresh_Aided_R,
          borderWidth: 1,
          pointStyle: audiogramData.symbols_Aided_R,
          pointRadius: audiogramData.pointSize_Aided_R,
          pointHoverRadius: audiogramData.pointSize_Aided_R,
          pointBorderWidth: 0,
          lineTension: 0,
          spanGaps: false,
          borderColor: "rgba(255,0,0,0.7)",
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "Aided NR arrow",
          data: audiogramData.thresh_NR_Aided_R,
          pointRadius: audiogramData.pointSize_NR_Aided_R,
          pointStyle: R_NR,
          borderWidth: 0,
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "Aided NR symbol",
          data: audiogramData.thresh_NR_Aided_R,
          pointRadius: audiogramData.pointSize_NR_Aided_R,
          pointStyle: audiogramData.symbols_NR_Aided_R,
          borderWidth: 0,
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
      ],
    },
    options: {
      layout: {
        padding: 0,
      },

      transitions: {
        show: {
          animations: {
            x: {
              from: 300,
            },
            y: {
              from: -100,
            },
          },
        },
        hide: {
          animations: {
            x: {
              to: 60,
            },
            y: {
              to: 1000,
            },
          },
        },
      },
      elements: {
        point: {
          hitRadius: 3,
          hoverRadius: 15,
        },
      },

      animations: {
        tension: {
          duration: 700,
          easing: "easeInOutSine",
          from: 0.4,
          to: 0,
          loop: false,
        },
      },
      animation: {
        duration: 0,
      },
      interaction: {
        mode: "index",
      },
      responsive: false,
      plugins: {
        autocolors: false,
        annotation: {
          clip: false,
          annotations: {
            normAdult: {
              type: "box",
              yMin: 0,
              yMax: 25,
              xMin: 1,
              backgroundColor: "rgba(230, 255, 110, 0.1)",
              borderColor: "gray",
              borderWidth: 0,
              drawTime: "beforeDatasetsDraw",
            },
            labelPTA: {
              type: "label",
              yValue: 0,
              xValue: 11,
              xAdjust: 12,
              content: "",
              color: "rgba(255,0,0,0.9)",
              font: { size: 10, family: "Rubik", weight: "600" },
              display: false,
            },
          },
        },
        legend: {
          display: false,
          labels: {
            padding: 0,
            boxWidth: 5,
          },
        },
        tooltip: {
          enabled: false,
        },
        title: {
          display: true,
          align: "center",
          text: "Right",
          color: "rgba(255,0,0,0.8)",
          font: { size: 16, family: "Rubik", weight: "500" },
          padding: { top: 6, bottom: 4 },
        },
        // The library crosshair is vertical only; audiograms use their own
        crosshair: false,
        audiogramCrosshair: { color: "red", width: 1.5 },
      },
      scales: {
        y: {
          grid: {
            drawTicks: false,
            color: "grey",
            lineWidth: 0.5,
          },
          min: -10,
          max: 120,
          ticks: {
            stepSize: 10,
            padding: 20,
            color: "red",
            font: {
              size: 12,
            },
          },
          reverse: true,
          beginAtZero: false,
        },
        x: {
          grid: {
            display: true,
            drawTicks: false,
            lineWidth: [0, 0.5, 0, 0.5, 0.2, 0.5, 0.2, 0.5, 0.2, 0.5, 0.2, 0.5],
            color: "grey",
          },
          ticks: {
            //space between Hz and border
            padding: 10,
            color: "red",
            maxRotation: 0,
            autoSkip: false,
            font: {
              size: 12,
            },
          },
        },
      },
      onClick: function (e) {
        const xLabel = this.scales.x.getValueForPixel(e.x);
        let yLabel = this.scales.y.getValueForPixel(e.y);
        yLabel = Math.round(yLabel / 5) * 5;
        prepareMovement(xLabel, yLabel, "R");
      },
    },
  };
}

// Both ears on one chart. It reuses the split charts' dataset objects (right
// ear first, then left) so any change to a dataset shows on both views.
// getEar says which ear a click plots.
export function createOptionsOverlay(prepareMovement, getEar, optionsR, optionsL) {
  const config = createOptionsR(prepareMovement);
  const { options } = config;
  config.data.datasets = [...optionsR.data.datasets, ...optionsL.data.datasets];

  options.plugins.title.display = false;
  options.scales.y.ticks.color = "rgba(0,0,0,0.7)";
  options.scales.x.ticks.color = "rgba(0,0,0,0.7)";

  const { normAdult, labelPTA } = options.plugins.annotation.annotations;
  options.plugins.annotation.annotations = {
    normAdult,
    labelPTA_R: labelPTA,
    labelPTA_L: { ...labelPTA, color: "rgba(0,0,255,0.9)" },
  };

  options.onClick = function (e) {
    const xLabel = this.scales.x.getValueForPixel(e.x);
    let yLabel = this.scales.y.getValueForPixel(e.y);
    yLabel = Math.round(yLabel / 5) * 5;
    prepareMovement(xLabel, yLabel, getEar());
  };
  return config;
}

export function createOptionsL(prepareMovement) {
  return {
    type: "line",
    plugins: [AudiogramCrosshair],
    data: {
      labels: bigHz,
      datasets: [
        {
          label: "AC_L",
          data: audiogramData.thresh_AC_L,
          borderWidth: 1,
          pointStyle: audiogramData.symbols_L,
          pointRadius: audiogramData.pointSize_AC_L,
          pointHoverRadius: audiogramData.pointSize_AC_L,
          pointBorderWidth: 2,
          pointBackgroundColor: "rgba(0, 0, 0, 0)",
          lineTension: 0,
          spanGaps: false,
          borderColor: "rgba(0,0,255,0.7)",
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
          fill: {
            above: "rgba(0,0,0,0)",
            below: "rgba(0,0,0,0.1)",
            target: {
              value: 25,
            },
          },
        },
        {
          label: "BC_L",
          data: audiogramData.thresh_BC_L,
          borderWidth: 0,
          pointStyle: audiogramData.symbols_BC_L,
          pointBackgroundColor: "rgba(0, 0, 0, 0)",
          pointRadius: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
          lineTension: 0,
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "AC NR arrow",
          data: audiogramData.thresh_NR_L,
          pointRadius: audiogramData.pointSize_NR_L,
          pointStyle: L_NR,
          borderWidth: 0,
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "AC NR thresh",
          data: audiogramData.thresh_NR_L,
          pointRadius: audiogramData.pointSize_NR_L,
          pointStyle: audiogramData.symbols_L,
          borderWidth: 0,
          pointBorderWidth: 2,
          pointBackgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: "rgba(0,0,255,0.3)",
          spanGaps: false,
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "BC NR arrow",
          data: audiogramData.thresh_BC_L,
          pointRadius: audiogramData.pointSize_NR_BC_L,
          pointStyle: L_NR,
          pointHoverRadius: 0,
          borderWidth: 0,
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "ghost",
          data: audiogramData.thresh_AC_R,
          pointRadius: audiogramData.pointSize_AC_R,
          borderColor: "rgba(255,0,0,0.1)",
          pointBackgroundColor: "rgba(0, 0, 0, 0)",
          pointStyle: audiogramData.symbols_R,
          spanGaps: true,
          pointHoverRadius: 0,
          borderWidth: 2,
          borderDash: [5, 5],
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "old",
          data: oldAudiogramData.thresh_AC_L,
          pointRadius: oldAudiogramData.pointSize_AC_L,
          borderColor: "rgba(0,0,255,0.1)",
          pointStyle: "circle",
          spanGaps: true,
          pointHoverRadius: 0,
          borderWidth: 2,
          borderDash: [5, 5],
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "Aided_L",
          data: audiogramData.thresh_Aided_L,
          borderWidth: 1,
          pointStyle: audiogramData.symbols_Aided_L,
          pointRadius: audiogramData.pointSize_Aided_L,
          pointHoverRadius: audiogramData.pointSize_Aided_L,
          pointBorderWidth: 0,
          lineTension: 0,
          spanGaps: false,
          borderColor: "rgba(0,0,255,0.7)",
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "Aided NR arrow",
          data: audiogramData.thresh_NR_Aided_L,
          pointRadius: audiogramData.pointSize_NR_Aided_L,
          pointStyle: L_NR,
          borderWidth: 0,
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
        {
          label: "Aided NR symbol",
          data: audiogramData.thresh_NR_Aided_L,
          pointRadius: audiogramData.pointSize_NR_Aided_L,
          pointStyle: audiogramData.symbols_NR_Aided_L,
          borderWidth: 0,
          clip: {
            left: false,
            top: false,
            right: false,
            bottom: false,
          },
        },
      ],
    },
    options: {
      transitions: {
        show: {
          animations: {
            x: {
              from: 300,
            },
            y: {
              from: -100,
            },
          },
        },
        hide: {
          animations: {
            x: {
              to: 60,
            },
            y: {
              to: 1000,
            },
          },
        },
      },
      elements: {
        point: {
          hitRadius: 15,
          hoverRadius: 15,
        },
      },

      animations: {
        tension: {
          duration: 700,
          easing: "easeInOutSine",
          from: 0.4,
          to: 0,
        },
      },
      animation: {
        duration: 0,
      },
      interaction: {
        mode: "index",
      },
      responsive: false,
      plugins: {
        annotation: {
          clip: false,
          annotations: {
            normAdult: {
              type: "box",
              yMin: 0,
              yMax: 25,
              xMin: 1,
              backgroundColor: "rgba(230, 255, 110, 0.1)",
              borderColor: "gray",
              borderWidth: 0,
              drawTime: "beforeDatasetsDraw",
            },
            labelPTA: {
              type: "label",
              yValue: 0,
              xValue: 11,
              xAdjust: 12,
              content: "",
              color: "rgba(0,0,255,0.9)",
              font: { size: 10, family: "Rubik", weight: "600" },
              display: false,
            },
          },
        },
        legend: {
          display: false,
          labels: {
            padding: 0,
            boxWidth: 5,
          },
        },
        tooltip: {
          enabled: false,
        },
        title: {
          display: true,
          align: "center",
          text: "Left",
          color: "rgba(0,0,255,0.8)",
          font: { size: 16, family: "Rubik", weight: "500" },
          padding: { top: 6, bottom: 4 },
        },
        // The library crosshair is vertical only; audiograms use their own
        crosshair: false,
        audiogramCrosshair: { color: "blue", width: 1.5 },
      },
      scales: {
        y: {
          grid: {
            drawTicks: false,
            color: "grey",
            lineWidth: 0.5,
          },
          min: -10,
          max: 120,
          ticks: {
            stepSize: 10,
            padding: 20,
            color: "blue",
            font: {
              size: 12,
            },
          },
          reverse: true,
          beginAtZero: false,
        },
        x: {
          grid: {
            display: true,
            drawTicks: false,
            lineWidth: [0, 0.5, 0, 0.5, 0.2, 0.5, 0.2, 0.5, 0.2, 0.5, 0.2, 0.5],
            color: "grey",
          },
          ticks: {
            //space between Hz and border
            padding: 10,
            color: "blue",
            maxRotation: 0,
            autoSkip: false,
            font: {
              size: 12,
            },
          },
        },
      },
      onClick: function (e) {
        const xLabel = this.scales.x.getValueForPixel(e.x);
        let yLabel = this.scales.y.getValueForPixel(e.y);
        yLabel = Math.round(yLabel / 5) * 5;
        prepareMovement(xLabel, yLabel, "L");
      },
    },
  };
}

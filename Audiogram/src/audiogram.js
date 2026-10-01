import {
  audiogramData,
  oldAudiogramData,
  BC_R,
  BC_L,
  BC_R_M,
  BC_L_M,
  AidedSymbol_R,
  AidedSymbol_L,
} from "./dataAndImages.js";

import {
  adjustAllACpointSizes,
  adjustAllBCpointSizes,
  adjustAllAidedPointSizes,
  acPointSize,
  bcPointSize,
  aidedPointSize,
} from "./adjustPointSizes.js";

import { createOptionsR, createOptionsL } from "./chartConfig_audiogram.js";

import { initSpeech, updateSpeechPTA, getSpeechSummary } from "./speech.js";

import {
  options_bar_R,
  options_bar_L,
  barColors_R,
  barColors_L,
  lilHz,
} from "./chartConfig_bar.js";

// Chart.register(annotationPlugin);

const CrosshairRemover = {
  id: "crosshair-remover",
  afterEvent: (chart, args, options) => {
    if (args.event.type == "mouseout") {
      chart.update("none");
    }
  },
};
Chart.register(CrosshairRemover);

// Change charts under the audiograms (see refreshBarCharts). Both ears share
// one comparison (current vs. previous, or unaided vs. aided) and one
// breakdown (each frequency, low/mid/high, or PTA).
const barState = { compare: null, chosenCompare: null, resolution: "full" };
const aidedBenefit = {
  R: { full: Array(12).fill(null), lowMidHigh: [null, null, null], PTA: [null] },
  L: { full: Array(12).fill(null), lowMidHigh: [null, null, null], PTA: [null] },
};
const BAR_LABELS = { full: lilHz, lowMidHigh: ["Low", "Mid", "High"], PTA: ["PTA"] };
const BAR_SUFFIX = { full: "", lowMidHigh: " (L/M/H)", PTA: " (PTA)" };

copy_data.addEventListener("click", copyData);
function copyData() {
  const pta = (value) =>
    !value ? "Not available" : Math.floor(value) + " dB";
  const speech = (ear) => {
    const { thresholds, wordRec } = getSpeechSummary(ear);
    const lines = [
      ...thresholds.map((t) => `${t.type}: ${t.score} dB HL`),
      ...wordRec.map(
        (w) => `Word Recognition: ${w.score} %${w.level ? ` at ${w.level} dB HL` : ""}`
      ),
    ];
    return lines.length ? lines.join("\n      ") : "Word Recognition: Not available";
  };

  const resultt = `Right Ear:
      PTA: ${pta(audiogramData.PTA_R)}
      ${speech("R")}

Left Ear:
      PTA: ${pta(audiogramData.PTA_L)}
      ${speech("L")}`;
  alert(resultt);
}

initSpeech();

// Browsers change a focused number input's value on mouse wheel / trackpad
// scroll. Keep arrow keys working but let the wheel scroll the page instead.
document.addEventListener(
  "wheel",
  (event) => {
    const input = event.target;
    if (input.matches?.('input[type="number"]') && input === document.activeElement) {
      event.preventDefault();
      window.scrollBy(event.deltaX, event.deltaY);
    }
  },
  { passive: false }
);

const NRbtns = document.querySelectorAll(".NR");
NRbtns.forEach((btn) => {
  btn.addEventListener("click", setNR);
});

function setNR() {
  const index = parseInt(this.dataset.index);
  const earNR = this.dataset.ear;

  if (transducer === "Aided") {
    const IO = earNR === "R" ? audiogramData.interOctTested_Aided_R : audiogramData.interOctTested_Aided_L;
    if (IO[index] === 0) return;

    const thresh = earNR === "R" ? audiogramData.thresh_Aided_R : audiogramData.thresh_Aided_L;
    const NR = earNR === "R" ? audiogramData.thresh_NR_Aided_R : audiogramData.thresh_NR_Aided_L;
    const size = earNR === "R" ? audiogramData.pointSize_NR_Aided_R : audiogramData.pointSize_NR_Aided_L;
    const old_dB = thresh[index];
    if (old_dB !== null) {
      NR.splice(index, 1, old_dB);
      size.splice(index, 1, 10);
      thresh.splice(index, 1, null);
      if (thresh[1] !== undefined && thresh[3] !== undefined) {
        const nonFreqValue = nonFreq(thresh[1], thresh[3], earNR);
        if (nonFreqValue !== undefined) thresh.splice(2, 1, nonFreqValue);
      }
    }
    if ([4, 6, 8, 10].includes(index)) {
      calcInterOct(index, 1, earNR);
    } else {
      calcInterOct(index, null, earNR);
    }
    updateCharts();
    return;
  }

  let thresh =
    earNR === "R" ? audiogramData.thresh_AC_R : audiogramData.thresh_AC_L;
  let thresh_BC =
    earNR === "R" ? audiogramData.thresh_BC_R : audiogramData.thresh_BC_L;
  let old_dB =
    earNR === "R"
      ? audiogramData.thresh_AC_R[index]
      : audiogramData.thresh_AC_L[index];
  let NR =
    earNR === "R" ? audiogramData.thresh_NR_R : audiogramData.thresh_NR_L;
  let size =
    earNR === "R" ? audiogramData.pointSize_NR_R : audiogramData.pointSize_NR_L;
  let size_BC =
    earNR === "R"
      ? audiogramData.pointSize_NR_BC_R
      : audiogramData.pointSize_NR_BC_L;
  let changeNR =
    earNR === "R"
      ? audiogramData.changeDetails.change_R
      : audiogramData.changeDetails.change_L;
  let IO =
    earNR === "R"
      ? audiogramData.interOctTested_AC_R
      : audiogramData.interOctTested_AC_L;

  // Early return if conditions aren't met
  if (IO[index] === 0 && transducer !== "BC") {
    return;
  }

  // Handle AC transducer case
  if (old_dB !== null && transducer === "AC") {
    // Make sure we have valid arrays before splicing
    if (
      Array.isArray(NR) &&
      Array.isArray(size) &&
      Array.isArray(thresh) &&
      Array.isArray(changeNR)
    ) {
      NR.splice(index, 1, old_dB);
      size.splice(index, 1, 10);
      thresh.splice(index, 1, null);

      // Only update index 2 if we have valid surrounding values
      if (thresh[1] !== undefined && thresh[3] !== undefined) {
        const nonFreqValue = nonFreq(thresh[1], thresh[3], earNR);
        if (nonFreqValue !== undefined) {
          thresh.splice(2, 1, nonFreqValue);
        }
      }

      changeNR.splice(index, 1, null);
    }
  }
  // Handle BC transducer case
  else if (transducer === "BC" && Array.isArray(size_BC)) {
    size_BC.splice(index, 1, 10);
  }

  // Early return for BC transducer
  if (transducer === "BC") {
    updateCharts();
    return;
  }
  // Handle interOct calculations
  if ([4, 6, 8, 10].includes(index)) {
    calcInterOct(index, 1, earNR);
  } else {
    calcInterOct(index, null, earNR);
  }
  audiogramData.PTA_R = calcPTA(audiogramData.thresh_AC_R);
  audiogramData.PTA_L = calcPTA(audiogramData.thresh_AC_L);
  annotatePTA();
  updateCharts();
}

function prepareMovement(index, dB, ear) {
  if (index === 2 || index < 0 || index > 11 || dB < -10 || dB > 120) {
    return;
  }
  let olddB;
  if (ear === "R") {
    olddB =
      transducer === "AC"
        ? audiogramData.thresh_AC_R[index]
        : transducer === "BC"
        ? audiogramData.thresh_BC_R[index]
        : audiogramData.thresh_Aided_R[index];
  }
  if (ear === "L") {
    olddB =
      transducer === "AC"
        ? audiogramData.thresh_AC_L[index]
        : transducer === "BC"
        ? audiogramData.thresh_BC_L[index]
        : audiogramData.thresh_Aided_L[index];
  }
  if (
    ear === "R" &&
    dB === olddB &&
    transducer === "AC" &&
    ((index === 4 && audiogramData.interOctTested_AC_R[3] === 0) ||
      (index === 6 && audiogramData.interOctTested_AC_R[5] === 0) ||
      (index === 8 && audiogramData.interOctTested_AC_R[7] === 0) ||
      (index === 10 && audiogramData.interOctTested_AC_R[9] === 0))
  ) {
    return;
  }

  if (
    ear === "L" &&
    dB === olddB &&
    transducer === "AC" &&
    ((index === 4 && audiogramData.interOctTested_AC_L[3] === 0) ||
      (index === 6 && audiogramData.interOctTested_AC_L[5] === 0) ||
      (index === 8 && audiogramData.interOctTested_AC_L[7] === 0) ||
      (index === 10 && audiogramData.interOctTested_AC_L[9] === 0))
  ) {
    return;
  }
  if (
    ear === "R" &&
    dB === olddB &&
    transducer === "Aided" &&
    ((index === 4 && audiogramData.interOctTested_Aided_R[3] === 0) ||
      (index === 6 && audiogramData.interOctTested_Aided_R[5] === 0) ||
      (index === 8 && audiogramData.interOctTested_Aided_R[7] === 0) ||
      (index === 10 && audiogramData.interOctTested_Aided_R[9] === 0))
  ) {
    return;
  }
  if (
    ear === "L" &&
    dB === olddB &&
    transducer === "Aided" &&
    ((index === 4 && audiogramData.interOctTested_Aided_L[3] === 0) ||
      (index === 6 && audiogramData.interOctTested_Aided_L[5] === 0) ||
      (index === 8 && audiogramData.interOctTested_Aided_L[7] === 0) ||
      (index === 10 && audiogramData.interOctTested_Aided_L[9] === 0))
  ) {
    return;
  }
  if (dB === undefined || dB === -15 || dB === 125) {
    return;
  }
  if (dB === olddB) {
    if (transducer === "AC") {
      if (
        (ear === "R" && audiogramData.interOctTested_AC_R[index] === 0) ||
        (ear === "L" && audiogramData.interOctTested_AC_L[index] === 0)
      ) {
        // don't reassign dB, let the dB through
      } else {
        dB = null;
      }
    } else if (transducer === "Aided") {
      if (
        (ear === "R" && audiogramData.interOctTested_Aided_R[index] === 0) ||
        (ear === "L" && audiogramData.interOctTested_Aided_L[index] === 0)
      ) {
        // don't reassign dB, let the dB through
      } else {
        dB = null;
      }
    } else {
      dB = null;
    }
  }
  const category = transducer === "AC" ? "AC" : transducer === "BC" ? "BC" : "Aided";
  if (legendHidden[category]) toggleLegendCategory(category);
  moveIt(index, dB, ear);
}

function calcInterOct(index, dB, ear) {
  let interOct;
  const tested = dB === null ? 0 : 1;
  const isAided = transducer === "Aided";

  //check for interoct
  if (index === 4 || index === 6 || index === 8 || index === 10) {
    if (ear === "R") {
      if (isAided) {
        audiogramData.interOctTested_Aided_R.splice(index, 1, tested);
      } else {
        audiogramData.interOctTested_AC_R.splice(index, 1, tested);
      }
    } else if (ear === "L") {
      if (isAided) {
        audiogramData.interOctTested_Aided_L.splice(index, 1, tested);
      } else {
        audiogramData.interOctTested_AC_L.splice(index, 1, tested);
      }
    }
    interOct = 1;
  }

  if (ear === "R") {
    const ioTested = isAided ? audiogramData.interOctTested_Aided_R : audiogramData.interOctTested_AC_R;
    const thresh = isAided ? audiogramData.thresh_Aided_R : audiogramData.thresh_AC_R;
    const pSize = isAided ? audiogramData.pointSize_Aided_R : audiogramData.pointSize_AC_R;

    //-----start of loop
    for (let i = 0; i < 12; i++) {
      //sets point size to show if tested is true
      if (ioTested[i] === 1) {
        pSize.splice(i, 1, isAided ? aidedPointSize : acPointSize);
        if (!isAided) audiogramData.pointSize_hover_AC_R.splice(i, 1, acPointSize);
      }
      //calcs the interoct
      if (ioTested[i] === 0) {
        let a = thresh[i - 1];
        let b = thresh[i + 1];
        if (a === null || b === null) {
        } else {
          thresh.splice(i, 1, (a + b) / 2);
          pSize.splice(i, 1, 0);
        }
      }
    } //-----end of loop
    if (!interOct && dB === null) {
      //look left and right of the index in thresh and in io tested
      //if io tested left = 0 and index left thresh <> null, set index left thresh = null
      let leftSideIO = ioTested[index - 1];
      let rightSideIO = ioTested[index + 1];
      let leftSideThresh = thresh[index - 1];
      let rightSideThresh = thresh[index + 1];

      if (leftSideIO === 0 && leftSideThresh !== null) {
        thresh.splice(index - 1, 1, null);
      }
      if (rightSideIO === 0 && rightSideThresh !== null) {
        thresh.splice(index + 1, 1, null);
      }
    }
  }
  if (ear === "L") {
    const ioTested = isAided ? audiogramData.interOctTested_Aided_L : audiogramData.interOctTested_AC_L;
    const thresh = isAided ? audiogramData.thresh_Aided_L : audiogramData.thresh_AC_L;
    const pSize = isAided ? audiogramData.pointSize_Aided_L : audiogramData.pointSize_AC_L;

    for (let i = 0; i < 12; i++) {
      if (ioTested[i] === 1) {
        pSize.splice(i, 1, isAided ? aidedPointSize : acPointSize);
        if (!isAided) audiogramData.pointSize_hover_AC_L.splice(i, 1, acPointSize);
      }
      if (ioTested[i] === 0) {
        let a = thresh[i - 1];
        let b = thresh[i + 1];
        if (a === null || b === null) {
        } else {
          thresh.splice(i, 1, (a + b) / 2);
          pSize.splice(i, 1, 0);
        }
      }
    }
    if (!interOct && dB === null) {
      let leftSideIO = ioTested[index - 1];
      let rightSideIO = ioTested[index + 1];
      let leftSideThresh = thresh[index - 1];
      let rightSideThresh = thresh[index + 1];
      if (leftSideIO === 0 && leftSideThresh !== null) {
        thresh.splice(index - 1, 1, null);
      }
      if (rightSideIO === 0 && rightSideThresh !== null) {
        thresh.splice(index + 1, 1, null);
      }
    }
  }
  if (!isAided) calcChange(index, ear);
}

//-----------------------------------this is the main function
//-----------------------------------this is the main function
//-----------------------------------this is the main function
function moveIt(freqIndex, dB, ear) {
  if (ear === "R" && transducer === "AC") {
    audiogramData.thresh_NR_R.splice(freqIndex, 1, null);
    audiogramData.pointSize_NR_R.splice(freqIndex, 1, 0);
    audiogramData.thresh_AC_R.splice(freqIndex, 1, dB);
    audiogramData.thresh_AC_R.splice(
      2,
      1,
      nonFreq(audiogramData.thresh_AC_R[1], audiogramData.thresh_AC_R[3], "R")
    );

    calcInterOct(freqIndex, dB, "R");
    calcChange(freqIndex, "R");
  }
  if (ear === "R" && transducer === "BC") {
    audiogramData.thresh_NR_BC_R.splice(freqIndex, 1, null);
    audiogramData.pointSize_NR_BC_R.splice(freqIndex, 1, null);
    audiogramData.thresh_BC_R.splice(freqIndex, 1, dB);
  }
  if (ear === "L" && transducer === "AC") {
    audiogramData.thresh_NR_L.splice(freqIndex, 1, null);
    audiogramData.pointSize_NR_L.splice(freqIndex, 1, null);
    audiogramData.thresh_AC_L.splice(freqIndex, 1, dB);
    audiogramData.thresh_AC_L.splice(
      2,
      1,
      nonFreq(audiogramData.thresh_AC_L[1], audiogramData.thresh_AC_L[3], "L")
    );
    calcInterOct(freqIndex, dB, "L");
    calcChange(freqIndex, "L");
  }
  if (ear === "L" && transducer === "BC") {
    audiogramData.thresh_NR_BC_L.splice(freqIndex, 1, null);
    audiogramData.pointSize_NR_BC_L.splice(freqIndex, 1, null);
    audiogramData.thresh_BC_L.splice(freqIndex, 1, dB);
  }
  if (ear === "R" && transducer === "Aided") {
    audiogramData.thresh_NR_Aided_R.splice(freqIndex, 1, null);
    audiogramData.pointSize_NR_Aided_R.splice(freqIndex, 1, 0);
    audiogramData.thresh_Aided_R.splice(freqIndex, 1, dB);
    audiogramData.thresh_Aided_R.splice(
      2,
      1,
      nonFreq(audiogramData.thresh_Aided_R[1], audiogramData.thresh_Aided_R[3], "R")
    );
    calcInterOct(freqIndex, dB, "R");
  }
  if (ear === "L" && transducer === "Aided") {
    audiogramData.thresh_NR_Aided_L.splice(freqIndex, 1, null);
    audiogramData.pointSize_NR_Aided_L.splice(freqIndex, 1, 0);
    audiogramData.thresh_Aided_L.splice(freqIndex, 1, dB);
    audiogramData.thresh_Aided_L.splice(
      2,
      1,
      nonFreq(audiogramData.thresh_Aided_L[1], audiogramData.thresh_Aided_L[3], "L")
    );
    calcInterOct(freqIndex, dB, "L");
  }
  audiogramData.PTA_R = calcPTA(audiogramData.thresh_AC_R);
  audiogramData.PTA_L = calcPTA(audiogramData.thresh_AC_L);
  updateCharts();
  annotatePTA();
}
export function updateCharts() {
  refreshBarCharts();
  myChart.update();
  myChart2.update();
  myChart3.update();
  myChart4.update();
  fillInLegend();
}

const userPrefs = {
  crosshairFlag: "on",
  normShadeFlag: "off",
  lossShadeFlag: "off",
};


const barColors_LMH_R = [
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
];
const barColors_LMH_L = [
  "rgba(0, 0, 255, 0.2)",
  "rgba(0, 0, 255, 0.2)",
  "rgba(0, 0, 255, 0.2)",
];

const barColors_PTA_R = ["rgba(255, 0, 0, 0.2)"];
const barColors_PTA_L = ["rgba(0, 0, 255, 0.2)"];

const shaders = {
  loss_fill_on: {
    above: "rgba(0,0,0,0)",
    below: "rgba(0,0,0,0.1)",
    target: {
      value: 25,
    },
  },
  loss_fill_off: {
    above: "rgba(0,0,0,0)",
    below: "rgba(0,0,0,0)",
    target: {
      value: 25,
    },
  },
};
shadeLossOn.addEventListener("click", HideHrgLossShade);
shadeLossOff.addEventListener("click", HideHrgLossShade);
function HideHrgLossShade() {
  const onButton = document.getElementById("shadeLossOn");
  const offButton = document.getElementById("shadeLossOff");
  shadeLossOn.removeAttribute("class");
  shadeLossOff.removeAttribute("class");
  if (this.id === "shadeLossOff") {
    myChart.config.data.datasets[0].fill = shaders.loss_fill_off;
    myChart2.config.data.datasets[0].fill = shaders.loss_fill_off;
    shadeLossOn.classList.add("toggle-button-disabled");
    shadeLossOff.classList.add("toggle-button-enabled");
    userPrefs.lossShadeFlag = "off";
  }
  if (this.id === "shadeLossOn") {
    myChart.config.data.datasets[0].fill = shaders.loss_fill_on;
    myChart2.config.data.datasets[0].fill = shaders.loss_fill_on;
    shadeLossOn.classList.add("toggle-button-enabled");
    shadeLossOff.classList.add("toggle-button-disabled");
    userPrefs.lossShadeFlag = "on";
  }
  updateCharts();
}

let crosshairFlag = "on";
const crosshairOptions = {
  audioRight: {
    sync: {
      enabled: false,
    },
    line: {
      width: 3,
      color: "red",
    },
    zoom: {
      enabled: false,
    },
    snap: {
      enabled: false,
    },
  },
  audioLeft: {
    sync: {
      enabled: false,
    },
    line: {
      width: 3,
      color: "blue",
    },
    zoom: {
      enabled: false,
    },
    snap: {
      enabled: false,
    },
  },
  barRight: {
    sync: {
      enabled: false,
    },
    line: {
      width: 3,
      color: "red",
    },
    zoom: {
      enabled: false,
    },
    snap: {
      enabled: false,
    },
  },
  barLeft: {
    sync: {
      enabled: false,
    },
    line: {
      width: 3,
      color: "blue",
    },
    zoom: {
      enabled: false,
    },
    snap: {
      enabled: false,
    },
  },
};
shade_norm_on.addEventListener("click", toggleNormShade);
shade_norm_off.addEventListener("click", toggleNormShade);
function toggleNormShade() {
  shade_norm_on.removeAttribute("class");
  shade_norm_off.removeAttribute("class");
  if (this.id === "shade_norm_off") {
    myChart.config.options.plugins.annotation.annotations.normAdult.yMax = 0;
    myChart2.config.options.plugins.annotation.annotations.normAdult.yMax = 0;
    shade_norm_on.classList.add("toggle-button-disabled");
    shade_norm_off.classList.add("toggle-button-enabled");
  }
  if (this.id === "shade_norm_on") {
    myChart.config.options.plugins.annotation.annotations.normAdult.yMax = 25;
    myChart2.config.options.plugins.annotation.annotations.normAdult.yMax = 25;
    shade_norm_off.classList.add("toggle-button-disabled");
    shade_norm_on.classList.add("toggle-button-enabled");
  }
  updateCharts();
}
crosshairOn.addEventListener("click", toggleCrosshair);
crosshairOff.addEventListener("click", toggleCrosshair);
function toggleCrosshair() {
  crosshairOn.removeAttribute("class");
  crosshairOff.removeAttribute("class");

  if (this.id === "crosshairOff") {
    myChart.config.options.plugins.crosshair = false;
    myChart2.config.options.plugins.crosshair = false;
    myChart3.config.options.plugins.crosshair = false;
    myChart4.config.options.plugins.crosshair = false;
    crosshairOn.classList.add("toggle-button-disabled");
    crosshairOff.classList.add("toggle-button-enabled");
    userPrefs.crosshairFlag = "off";
  }
  if (this.id === "crosshairOn") {
    myChart.config.options.plugins.crosshair = crosshairOptions.audioRight;
    myChart2.config.options.plugins.crosshair = crosshairOptions.audioLeft;
    myChart3.config.options.plugins.crosshair = crosshairOptions.barRight;
    myChart4.config.options.plugins.crosshair = crosshairOptions.barLeft;
    crosshairOn.classList.add("toggle-button-enabled");
    crosshairOff.classList.add("toggle-button-disabled");
    userPrefs.crosshairFlag = "on";
  }
  updateCharts();
}
//**
function calcChange(index, ear) {
  if (ear === "R") {
    if (
      oldAudiogramData.thresh_AC_R[index] === null ||
      audiogramData.thresh_AC_R[index] === null ||
      audiogramData.interOctTested_AC_R[index] === 0
    )
      audiogramData.changeDetails.change_R.splice(index, 1, null);
  }
  if (ear === "L") {
    if (
      oldAudiogramData.thresh_AC_L[index] === null ||
      audiogramData.thresh_AC_L[index] === null ||
      audiogramData.interOctTested_AC_L[index] === 0
    )
      audiogramData.changeDetails.change_R.splice(index, 1, null);
  }

  let threshOld =
    ear === "R" ? oldAudiogramData.thresh_AC_R : oldAudiogramData.thresh_AC_L;
  let threshNew =
    ear === "R" ? audiogramData.thresh_AC_R : audiogramData.thresh_AC_L;
  let change =
    ear === "R"
      ? audiogramData.changeDetails.change_R
      : audiogramData.changeDetails.change_L;
  let newNR =
    ear === "R" ? audiogramData.thresh_NR_R : audiogramData.thresh_NR_L;
  let oldNR =
    ear === "R" ? oldAudiogramData.thresh_NR_R : oldAudiogramData.thresh_NR_L;
  let ioTestNew =
    ear === "R"
      ? audiogramData.interOctTested_AC_R
      : audiogramData.interOctTested_AC_L;
  let ioTestOld =
    ear === "R"
      ? oldAudiogramData.interOctTested_AC_R
      : oldAudiogramData.interOctTested_AC_L;
  let barColors = ear === "R" ? barColors_R : barColors_L;
  let color1 = ear === "R" ? "rgba(255, 0, 0, 0.05)" : "rgba(0, 0, 255, 0.05)";
  let color2 = ear === "R" ? "rgba(255, 0, 0, 0.10)" : "rgba(0, 0, 255, 0.10)";
  let color3 = ear === "R" ? "rgba(255, 0, 0, 0.20)" : "rgba(0, 0, 255, 0.20)";
  let color4 = ear === "R" ? "rgba(255, 0, 0, 0.30)" : "rgba(0, 0, 255, 0.30)";

  if (
    [4, 6, 8, 10].includes(index) &&
    (ioTestOld[index] === 0 || ioTestNew[index] === 0)
  ) {
    change.splice(index, 1, null);
    return;
  }
  if (
    threshNew[index] === null ||
    threshOld[index] === null ||
    newNR[index] !== null ||
    oldNR[index] !== null
  ) {
    change.splice(index, 1, null);
    return;
  } else {
    change.splice(index, 1, threshOld[index] - threshNew[index]);
    change.splice(2, 1, null);
    if (ioTestNew[3] === 0 || ioTestOld[3] === 0) {
      change.splice(4, 1, null);
    }
    if (ioTestNew[5] === 0 || ioTestOld[5] === 0) {
      change.splice(6, 1, null);
    }
    if (ioTestNew[7] === 0 || ioTestOld[7] === 0) {
      change.splice(8, 1, null);
    }
    if (ioTestNew[9] === 0 || ioTestOld[9] === 0) {
      change.splice(10, 1, null);
    }
    if (audiogramData.changeDetails.changeResolution_R === "full") {
      if (Math.abs(threshOld[index] - threshNew[index]) < 10) {
        barColors.splice(index, 1, color1);
      } else if (
        Math.abs(threshOld[index] - threshNew[index]) > 9 &&
        Math.abs(threshOld[index] - threshNew[index]) < 20
      ) {
        barColors.splice(index, 1, color2);
      } else if (
        Math.abs(threshOld[index] - threshNew[index]) > 19 &&
        Math.abs(threshOld[index] - threshNew[index]) < 30
      ) {
        barColors.splice(index, 1, color3);
      } else if (Math.abs(threshOld[index] - threshNew[index]) > 29) {
        barColors.splice(index, 1, color4);
      }
    }
    if (ear === "R") {
      LMH(audiogramData.changeDetails.change_R, "R");
      audiogramData.changeDetails.changePTA_R.splice(
        0,
        1,
        Math.floor(calcPTA(audiogramData.changeDetails.change_R))
      );

      if (audiogramData.changeDetails.changeResolution_R === "lowMidHigh") {
        barColors = barColors_LMH_R;
        const colorThresholds = [10, 20, 30];
        const colors = [color1, color2, color3, color4];

        for (let i = 0; i < audiogramData.changeDetails.LMH_R.length; i++) {
          const value = audiogramData.changeDetails.LMH_R[i];
          let color = color4;

          for (let j = 0; j < colorThresholds.length; j++) {
            if (value < colorThresholds[j]) {
              color = colors[j];
              break;
            }
          }
          barColors.splice(i, 1, color);
          myChart3.config.data.datasets[0].backgroundColor = barColors;
        }
      }
      if (audiogramData.changeDetails.changeResolution_R === "PTA") {
        barColors = barColors_PTA_R;
        const colorThresholds = [10, 20, 30];
        const colors = [color1, color2, color3, color4];

        for (let i = 0; i < colorThresholds.length; i++) {
          if (audiogramData.changeDetails.changePTA_R[0] < colorThresholds[i]) {
            barColors.splice(0, 1, colors[i]);
            break;
          }
        }
        myChart3.config.data.datasets[0].backgroundColor = barColors;
      }
    }
    if (ear === "L") {
      LMH(audiogramData.changeDetails.change_L, "L");
      audiogramData.changeDetails.changePTA_L.splice(
        0,
        1,
        Math.floor(calcPTA(audiogramData.changeDetails.change_L))
      );

      if (audiogramData.changeDetails.changeResolution_L === "lowMidHigh") {
        barColors = barColors_LMH_L;
        const colorThresholds = [10, 20, 30];
        const colors = [color1, color2, color3, color4];

        for (let i = 0; i < audiogramData.changeDetails.LMH_L.length; i++) {
          const value = audiogramData.changeDetails.LMH_L[i];
          let color = color4;

          for (let j = 0; j < colorThresholds.length; j++) {
            if (value < colorThresholds[j]) {
              color = colors[j];
              break;
            }
          }
          barColors.splice(i, 1, color);
          myChart4.config.data.datasets[0].backgroundColor = barColors;
        }
      }
      if (audiogramData.changeDetails.changeResolution_L === "PTA") {
        barColors = barColors_PTA_L;
        const colorThresholds = [10, 20, 30];
        const colors = [color1, color2, color3, color4];

        for (let i = 0; i < colorThresholds.length; i++) {
          if (audiogramData.changeDetails.changePTA_L[0] < colorThresholds[i]) {
            barColors.splice(0, 1, colors[i]);
            break;
          }
        }
        myChart4.config.data.datasets[0].backgroundColor = barColors;
      }
    }
    updateCharts();
  }
}

let transducer = "AC";
//----sets AC BC toggle to AC when load.

export const options_R = createOptionsR(prepareMovement);
export const options_L = createOptionsL(prepareMovement);

const ctx = document.getElementById("audiogram_R").getContext("2d");
const myChart = new Chart(ctx, options_R);

const ctx2 = document.getElementById("audiogram_L").getContext("2d");
const myChart2 = new Chart(ctx2, options_L);

const ctx3 = document.getElementById("change_R").getContext("2d");
const myChart3 = new Chart(ctx3, options_bar_R);

const ctx4 = document.getElementById("change_L").getContext("2d");
const myChart4 = new Chart(ctx4, options_bar_L);

change_R.addEventListener("click", function (evt) {
  changeResolution();
});

const legendHidden = { AC: false, BC: false, NR: false, previous: false, Aided: false };

function toggleLegendCategory(category) {
  legendHidden[category] = !legendHidden[category];
  const hidden = legendHidden[category];

  const setVisibility = (datasets) => {
    datasets.forEach((i) => {
      hidden ? myChart.hide(i) : myChart.show(i);
      hidden ? myChart2.hide(i) : myChart2.show(i);
    });
  };

  if (category === "AC") {
    setVisibility([0]);
    ACnormal.classList.toggle("legend-row-hidden", hidden);
    ACmasked.classList.toggle("legend-row-hidden", hidden);
  } else if (category === "BC") {
    setVisibility([1]);
    BCnormal.classList.toggle("legend-row-hidden", hidden);
    BCmasked.classList.toggle("legend-row-hidden", hidden);
  } else if (category === "NR") {
    setVisibility([2, 3, 4]);
    NR.classList.toggle("legend-row-hidden", hidden);
  } else if (category === "previous") {
    setVisibility([6]);
    previousLegend.classList.toggle("legend-row-hidden", hidden);
  } else if (category === "Aided") {
    setVisibility([7, 8, 9]);
    AidedLegend.classList.toggle("legend-row-hidden", hidden);
  }
}

document.querySelectorAll(".legend-label").forEach((td) => {
  td.addEventListener("click", () =>
    toggleLegendCategory(td.dataset.category)
  );
});
change_L.addEventListener("click", function (evt) {
  changeResolution();
});

function download_image() {
  const canvas = document.getElementById("audiogram_R");
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  const fileName = "Audiogram " + new Date().toLocaleTimeString();
  link.download = fileName + ".png";
  link.href = image;
  link.click();
}
mask_right.addEventListener("click", maskAll);
mask_left.addEventListener("click", maskAll);
function maskAll() {
  const ear = this.id === "mask_right" ? "R" : "L";
  const rightSymbol =
    audiogramData.maskAll_AC_R_L_BC_R_L[0] === 0
      ? ["triangle", 1]
      : ["circle", 0];
  const leftSymbol =
    audiogramData.maskAll_AC_R_L_BC_R_L[1] === 0
      ? ["rect", 1]
      : ["crossRot", 0];
  const rightBC =
    audiogramData.maskAll_AC_R_L_BC_R_L[2] === 0 ? [BC_R_M, 1] : [BC_R, 0];
  const leftBC =
    audiogramData.maskAll_AC_R_L_BC_R_L[3] === 0 ? [BC_L_M, 1] : [BC_L, 0];

  //flip the maskAll flag before mutating the symbols array
  if (transducer === "AC" && ear === "R") {
    audiogramData.maskAll_AC_R_L_BC_R_L.splice(0, 1, rightSymbol[1]);
  } else if (transducer === "AC" && ear === "L") {
    audiogramData.maskAll_AC_R_L_BC_R_L.splice(1, 1, leftSymbol[1]);
  } else if (transducer === "BC" && ear === "R") {
    audiogramData.maskAll_AC_R_L_BC_R_L.splice(2, 1, rightBC[1]);
  } else if (transducer === "BC" && ear === "L") {
    audiogramData.maskAll_AC_R_L_BC_R_L.splice(3, 1, leftBC[1]);
  }
  //mutate the array
  if (transducer === "AC" && ear === "R") {
    audiogramData.symbols_R.forEach(function (part, index, theArray) {
      audiogramData.symbols_R[index] = rightSymbol[0];
    });
  } else if (transducer === "AC" && ear === "L") {
    audiogramData.symbols_L.forEach(function (part, index, theArray) {
      audiogramData.symbols_L[index] = leftSymbol[0];
    });
  } else if (transducer === "BC" && ear === "R") {
    audiogramData.symbols_BC_R.forEach(function (part, index, theArray) {
      audiogramData.symbols_BC_R[index] = rightBC[0];
    });
  } else if (transducer === "BC" && ear === "L") {
    audiogramData.symbols_BC_L.forEach(function (part, index, theArray) {
      audiogramData.symbols_BC_L[index] = leftBC[0];
    });
  }
  updateCharts();
}

// NR All: if the ear has any regular responses on the current transducer,
// mark every tested point NR; otherwise turn every NR point back into a
// regular threshold at the same level.
NR_all_right.addEventListener("click", nrAll);
NR_all_left.addEventListener("click", nrAll);
function nrAll() {
  const ear = this.id === "NR_all_right" ? "R" : "L";
  const data = {
    AC: {
      thresh: audiogramData[`thresh_AC_${ear}`],
      NR: audiogramData[`thresh_NR_${ear}`],
      IO: audiogramData[`interOctTested_AC_${ear}`],
    },
    Aided: {
      thresh: audiogramData[`thresh_Aided_${ear}`],
      NR: audiogramData[`thresh_NR_Aided_${ear}`],
      IO: audiogramData[`interOctTested_Aided_${ear}`],
    },
  };
  const indices = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  if (transducer === "BC") {
    const thresh = audiogramData[`thresh_BC_${ear}`];
    const sizeNR = audiogramData[`pointSize_NR_BC_${ear}`];
    const tested = indices.filter((i) => thresh[i] !== null && thresh[i] !== undefined);
    const anyRegular = tested.some((i) => sizeNR[i] !== 10);
    tested.forEach((i) => {
      if (anyRegular) sizeNR.splice(i, 1, 10);
      else moveIt(i, thresh[i], ear);
    });
    updateCharts();
    return;
  }

  const { thresh, NR, IO } = data[transducer];
  const regular = indices.filter((i) => thresh[i] !== null && IO[i] !== 0);
  if (regular.length > 0) {
    regular.forEach((i) => setNR.call({ dataset: { index: String(i), ear } }));
  } else {
    indices
      .filter((i) => NR[i] !== null && NR[i] !== undefined)
      .forEach((i) => moveIt(i, NR[i], ear));
  }
}

// Masking / NR toolbar pills open their <details> panel
document.querySelectorAll("[data-toggle-panel]").forEach((button) => {
  const panel = document.getElementById(button.dataset.togglePanel);
  button.addEventListener("click", () => {
    panel.open = !panel.open;
  });
  panel.addEventListener("toggle", () => {
    button.setAttribute("aria-expanded", String(panel.open));
  });
});

copy_ear_right.addEventListener("click", copyEar);
copy_ear_left.addEventListener("click", copyEar);
function copyEar() {
  let ear;
  if (this.id === "copy_ear_right") {
    ear = "R";
  } else {
    ear = "L";
  }
  const copyAlertMessage = `Are you sure you want to copy ${
    ear === "R" ? "right" : "left"
  } ${transducer} to ${ear === "R" ? "left" : "right"} ${transducer}?`;
  if (!confirm(copyAlertMessage)) return;

  const from = ear;
  const to = ear === "R" ? "L" : "R";
  // Arrays that make up one ear's data for each transducer
  const keysByTransducer = {
    AC: (e) => [
      `thresh_AC_${e}`,
      `pointSize_AC_${e}`,
      `pointSize_hover_AC_${e}`,
      `pointSize_NR_${e}`,
      `thresh_NR_${e}`,
      `interOctTested_AC_${e}`,
    ],
    BC: (e) => [`thresh_BC_${e}`, `pointSize_NR_BC_${e}`, `thresh_NR_BC_${e}`],
    Aided: (e) => [
      `thresh_Aided_${e}`,
      `pointSize_Aided_${e}`,
      `pointSize_NR_Aided_${e}`,
      `thresh_NR_Aided_${e}`,
      `interOctTested_Aided_${e}`,
    ],
  };
  const sourceKeys = keysByTransducer[transducer](from);
  const targetKeys = keysByTransducer[transducer](to);
  sourceKeys.forEach((key, i) => {
    const target = audiogramData[targetKeys[i]];
    target.splice(0, target.length, ...audiogramData[key]);
  });

  if (ear === "R" && transducer === "AC") {
    audiogramData.symbols_L.forEach(function (part, index, theArray) {
      if (audiogramData.symbols_R[index] === "triangle") {
        audiogramData.symbols_L[index] = "rect";
      } else {
        audiogramData.symbols_L[index] = "crossRot";
      }
    });
  }
  if (ear === "L" && transducer === "AC") {
    audiogramData.symbols_R.forEach(function (part, index, theArray) {
      if (audiogramData.symbols_L[index] === "rect") {
        audiogramData.symbols_R[index] = "triangle";
      } else {
        audiogramData.symbols_R[index] = "circle";
      }
    });
  }
  if (ear === "R" && transducer === "BC") {
    audiogramData.symbols_BC_L.forEach(function (part, index, theArray) {
      if (audiogramData.symbols_BC_R[index] === BC_R_M) {
        audiogramData.symbols_BC_L[index] = BC_L_M;
      } else {
        audiogramData.symbols_BC_L[index] = BC_L;
      }
    });
  }
  if (ear === "L" && transducer === "BC") {
    audiogramData.symbols_BC_R.forEach(function (part, index, theArray) {
      if (audiogramData.symbols_BC_L[index] === BC_L_M) {
        audiogramData.symbols_BC_R[index] = BC_R_M;
      } else {
        audiogramData.symbols_BC_R[index] = BC_R;
      }
    });
  }
  if (transducer === "AC") {
    for (let i = 0; i < 12; i++) calcChange(i, to);
    audiogramData.PTA_R = calcPTA(audiogramData.thresh_AC_R);
    audiogramData.PTA_L = calcPTA(audiogramData.thresh_AC_L);
    annotatePTA();
  }
  updateCharts();
}

//fx used to handle freq between 250 and 500. Takes input and returns 375 interpolation if valid. The calling script does the splice.
function nonFreq(a, b, ear) {
  if (transducer === "AC" || transducer === "Aided") {
    if (ear === "R") {
      if (a === null || b === null) {
        return null;
      } else return (a + b) / 2;
    } else if (ear === "L") {
      if (a === null || b === null) {
        return null;
      } else return (a + b) / 2;
    }
  }
}
AC_button.addEventListener("click", toggleTransducer);
BC_button.addEventListener("click", toggleTransducer);
aided_button.addEventListener("click", toggleTransducer);
function toggleTransducer(initialState) {
  document.getElementById("AC_button").className = "button_T";
  document.getElementById("BC_button").className = "button_T";
  document.getElementById("aided_button").className = "button_T";
  if (initialState === "AC" || this.id === "AC_button") {
    transducer = "AC";
    document.getElementById("AC_button").className = "button_U";
  } else if (this.id === "BC_button") {
    transducer = "BC";
    document.getElementById("BC_button").className = "button_U";
  } else if (this.id === "aided_button") {
    transducer = "Aided";
    document.getElementById("aided_button").className = "button_U";
  }
}

const maskingBtns = document.querySelectorAll("[data-masking]");
maskingBtns.forEach((btn) => {
  btn.addEventListener("click", setMask);
});

function setMask() {
  const ear = this.dataset.ear;
  const index = this.dataset.index;
  if (ear === "R" && transducer === "AC") {
    if (audiogramData.symbols_R[index] === "circle") {
      audiogramData.symbols_R.splice(index, 1, "triangle");
    } else {
      audiogramData.symbols_R.splice(index, 1, "circle");
    }
  } else if (ear === "L" && transducer === "AC") {
    if (audiogramData.symbols_L[index] === "crossRot") {
      audiogramData.symbols_L.splice(index, 1, "rect");
    } else {
      audiogramData.symbols_L.splice(index, 1, "crossRot");
    }
  } else if (ear === "R" && transducer === "BC") {
    if (audiogramData.symbols_BC_R[index] === BC_R) {
      audiogramData.symbols_BC_R.splice(index, 1, BC_R_M);
    } else {
      audiogramData.symbols_BC_R.splice(index, 1, BC_R);
    }
  } else if (ear === "L" && transducer === "BC") {
    if (audiogramData.symbols_BC_L[index] === BC_L) {
      audiogramData.symbols_BC_L.splice(index, 1, BC_L_M);
    } else {
      audiogramData.symbols_BC_L.splice(index, 1, BC_L);
    }
  }
  updateCharts();
}
secondary_data.addEventListener("change", toggleData);
//used for toggling old threshold curve and or for ghost ears
function toggleData() {
  const selectedValue = secondary_data.value;
  if (selectedValue === "None") {
    myChart.hide(5);
    myChart2.hide(5);
    myChart.hide(6);
    myChart2.hide(6);
    previousLegend.style.display = "none";
    return;
  }
  if (selectedValue === "Prev. Results") {
    //previous is visible
    myChart.hide(5);
    myChart2.hide(5);
    myChart.show(6);
    myChart2.show(6);
    previousLegend.style.display = "table-row";
  }
  if (selectedValue === "Other Ear") {
    myChart.hide(6);
    myChart2.hide(6);
    myChart.show(5);
    myChart2.show(5);
    previousLegend.style.display = "none";
  }
}

function calcChangeOnLoad() {
  for (let i = 0; i < audiogramData.thresh_AC_R.length; i++) {
    calcChange(i, "R");
  }
  for (let i = 0; i < audiogramData.thresh_AC_L.length; i++) {
    calcChange(i, "L");
  }
}

calcChangeOnLoad();

function reduceOldPointSizes() {
  for (let i = 0; i < oldAudiogramData.pointSize_AC_R.length; i++) {
    if (oldAudiogramData.pointSize_AC_R[i] === null) {
    } else {
      oldAudiogramData.pointSize_AC_R.splice(i, 1, 2);
    }
  }
  for (let i = 0; i < oldAudiogramData.pointSize_AC_L.length; i++) {
    if (oldAudiogramData.pointSize_AC_L[i] === null) {
    } else {
      oldAudiogramData.pointSize_AC_L.splice(i, 1, 2);
    }
  }
}
reduceOldPointSizes();

function calcPTA(array) {
  if (array[3] === null || array[5] === null || array[7] === null) {
  } else return (array[3] + array[5] + array[7]) / 3;
}

let annotatePTApref = "on";
annotatePTAon.addEventListener("click", annotatePTA);
annotatePTAoff.addEventListener("click", annotatePTA);
function annotatePTA() {
  updateSpeechPTA(audiogramData.PTA_R, audiogramData.PTA_L);
  if (this == annotatePTAon) {
    annotatePTApref = "on";
  }
  if (this == annotatePTAoff) {
    annotatePTApref = "off";
  }
  if (this) {
    annotatePTAon.removeAttribute("class");
    annotatePTAoff.removeAttribute("class");
    if (annotatePTApref === "off") {
      annotatePTAon.classList.add("toggle-button-disabled");
      annotatePTAoff.classList.add("toggle-button-enabled");
    } else {
      annotatePTAon.classList.add("toggle-button-enabled");
      annotatePTAoff.classList.add("toggle-button-disabled");
    }
  }

  if (annotatePTApref === "off") {
    myChart.options.plugins.annotation.annotations.labelPTA.display = false;
    myChart2.options.plugins.annotation.annotations.labelPTA.display = false;
    updateCharts();
    return;
  }

  const labelR = myChart.options.plugins.annotation.annotations.labelPTA;
  const labelL = myChart2.options.plugins.annotation.annotations.labelPTA;

  if (audiogramData.PTA_R === undefined) {
    labelR.display = false;
  } else {
    labelR.yValue = audiogramData.PTA_R;
    labelR.content = ["PTA", String(Math.round(audiogramData.PTA_R))];
    labelR.display = true;
  }
  if (audiogramData.PTA_L === undefined) {
    labelL.display = false;
  } else {
    labelL.yValue = audiogramData.PTA_L;
    labelL.content = ["PTA", String(Math.round(audiogramData.PTA_L))];
    labelL.display = true;
  }
  updateCharts();
}

function LMH(array, ear) {
  const targetLMH =
    ear === "R"
      ? audiogramData.changeDetails.LMH_R
      : audiogramData.changeDetails.LMH_L;

  if (array[1] === null || array[3] === null) {
    targetLMH.splice(0, 1, null);
  } else {
    targetLMH.splice(0, 1, Math.floor((array[1] + array[3]) / 2));
  }
  if (array[5] === null || array[7] === null) {
    targetLMH.splice(1, 1, null);
  } else {
    targetLMH.splice(1, 1, Math.floor((array[5] + array[7]) / 2));
  }
  if (array[9] === null || array[11] === null) {
    targetLMH.splice(2, 1, null);
  } else {
    targetLMH.splice(2, 1, Math.floor((array[9] + array[11]) / 2));
  }
}

function barTint(ear, value) {
  const rgb = ear === "R" ? "255, 0, 0" : "0, 0, 255";
  const size = Math.abs(value);
  const alpha = size < 10 ? 0.05 : size < 20 ? 0.1 : size < 30 ? 0.2 : 0.3;
  return `rgba(${rgb}, ${alpha})`;
}

function hasAnyThreshold(...arrays) {
  return arrays.some((array) => array.some((value) => value !== null && value !== undefined));
}

function compareAvailable(compare) {
  if (compare === "previous") {
    return hasAnyThreshold(
      oldAudiogramData.thresh_AC_R,
      oldAudiogramData.thresh_AC_L,
      oldAudiogramData.thresh_NR_R,
      oldAudiogramData.thresh_NR_L
    );
  }
  // aided: either ear has both unaided and aided thresholds
  return ["R", "L"].some(
    (ear) =>
      hasAnyThreshold(audiogramData[`thresh_AC_${ear}`], audiogramData[`thresh_NR_${ear}`]) &&
      hasAnyThreshold(audiogramData[`thresh_Aided_${ear}`], audiogramData[`thresh_NR_Aided_${ear}`])
  );
}

// Aided benefit = unaided AC minus aided, so positive means aided is better.
// Frequencies missing either threshold, or an untested inter-octave, are skipped.
function calcAidedBenefit(ear) {
  const unaided = audiogramData[`thresh_AC_${ear}`];
  const aided = audiogramData[`thresh_Aided_${ear}`];
  const ioUnaided = audiogramData[`interOctTested_AC_${ear}`];
  const ioAided = audiogramData[`interOctTested_Aided_${ear}`];
  const benefit = aidedBenefit[ear];
  for (let i = 0; i < 12; i++) {
    const comparable =
      i !== 2 && unaided[i] !== null && aided[i] !== null && ioUnaided[i] !== 0 && ioAided[i] !== 0;
    benefit.full.splice(i, 1, comparable ? unaided[i] - aided[i] : null);
  }
  const average = (a, b) => (a === null || b === null ? null : Math.floor((a + b) / 2));
  const f = benefit.full;
  benefit.lowMidHigh.splice(0, 3, average(f[1], f[3]), average(f[5], f[7]), average(f[9], f[11]));
  const pta = calcPTA(f);
  benefit.PTA.splice(0, 1, pta === undefined ? null : Math.floor(pta));
}

function barTitle() {
  if (barState.compare === "previous") {
    const date = oldAudiogramData.DateOfTest;
    return `Change vs. ${date ? date : "previous"}${BAR_SUFFIX[barState.resolution]}`;
  }
  if (barState.compare === "aided") return `Aided benefit${BAR_SUFFIX[barState.resolution]}`;
  return "No comparison available";
}

function barSeries(ear) {
  const res = barState.resolution;
  const details = audiogramData.changeDetails;
  if (barState.compare === "previous") {
    const data = { full: details[`change_${ear}`], lowMidHigh: details[`LMH_${ear}`], PTA: details[`changePTA_${ear}`] }[res];
    const colors = {
      full: ear === "R" ? barColors_R : barColors_L,
      lowMidHigh: ear === "R" ? barColors_LMH_R : barColors_LMH_L,
      PTA: ear === "R" ? barColors_PTA_R : barColors_PTA_L,
    }[res];
    return [data, colors];
  }
  if (barState.compare === "aided") {
    const data = aidedBenefit[ear][res];
    return [data, data.map((value) => (value === null ? null : barTint(ear, value)))];
  }
  return [[], []];
}

// Picks the comparison (the user's choice if still available, otherwise
// previous, then aided) and points both charts at the right series.
// Called from updateCharts, so it stays current as thresholds change.
function refreshBarCharts() {
  calcAidedBenefit("R");
  calcAidedBenefit("L");
  const order = [barState.chosenCompare, "previous", "aided"].filter(Boolean);
  barState.compare = order.find(compareAvailable) ?? null;

  // calcChange colors L/M/H and PTA bars only when it sees those modes
  const changeMode = barState.compare === "previous" ? barState.resolution : "full";
  audiogramData.changeDetails.changeResolution_R = changeMode;
  audiogramData.changeDetails.changeResolution_L = changeMode;

  [["R", myChart3], ["L", myChart4]].forEach(([ear, chart]) => {
    const [data, colors] = barSeries(ear);
    chart.config.data.datasets[0].data = data;
    chart.config.data.datasets[0].backgroundColor = colors;
    chart.config.data.labels = BAR_LABELS[barState.resolution];
    document.getElementById(`bar_title_${ear}`).textContent = barTitle();
  });

  document.querySelectorAll("[data-bar-compare]").forEach((button) => {
    const value = button.dataset.barCompare;
    button.disabled = !compareAvailable(value);
    button.setAttribute("aria-pressed", String(value === barState.compare));
  });
  document.querySelectorAll("[data-bar-resolution]").forEach((button) => {
    button.disabled = barState.compare === null;
    button.setAttribute("aria-pressed", String(button.dataset.barResolution === barState.resolution));
  });
}

function setBarView({ compare, resolution }) {
  if (compare) barState.chosenCompare = compare;
  if (resolution) barState.resolution = resolution;
  // calcChange fills the L/M/H and PTA bar colors for the previous comparison
  if (resolution) calcChangeOnLoad();
  updateCharts();
}

function changeResolution() {
  const order = ["full", "lowMidHigh", "PTA"];
  setBarView({ resolution: order[(order.indexOf(barState.resolution) + 1) % order.length] });
}

document.querySelectorAll("[data-bar-compare]").forEach((button) => {
  button.addEventListener("click", () => setBarView({ compare: button.dataset.barCompare }));
});
document.querySelectorAll("[data-bar-resolution]").forEach((button) => {
  button.addEventListener("click", () => setBarView({ resolution: button.dataset.barResolution }));
});
refreshBarCharts();

audiogramData.PTA_R = calcPTA(audiogramData.thresh_AC_R);
audiogramData.PTA_L = calcPTA(audiogramData.thresh_AC_L);
updateSpeechPTA(audiogramData.PTA_R, audiogramData.PTA_L);

oldAudiogramData.PTA_R = calcPTA(oldAudiogramData.thresh_AC_R);
oldAudiogramData.PTA_L = calcPTA(oldAudiogramData.thresh_AC_L);

function fillInLegendPrevDate() {
  if (
    oldAudiogramData.DateOfTest === null ||
    oldAudiogramData.DateOfTest === ""
  ) {
    return;
  }
  previousLegend.style.display = "table-row";
  previous_dateContent.innerText = "Previous " + oldAudiogramData.DateOfTest;
}

function fillInLegend() {
  //stops function if legend is full.
  if (
    audiogramData.legend.ACunmasked === "show" &&
    audiogramData.legend.ACmasked === "show" &&
    audiogramData.legend.BCunmasked === "show" &&
    audiogramData.legend.BCmasked === "show" &&
    audiogramData.legend.NR === "show" &&
    audiogramData.legend.Aided === "show"
  ) {
    return;
  }

  if (audiogramData.legend.ACunmasked !== "show") {
    //set legend table rows to show if the category has been tested.
    const any_R_AC = audiogramData.thresh_AC_R.filter(
      (thresh) => thresh !== null
    );
    const any_L_AC = audiogramData.thresh_AC_L.filter(
      (thresh) => thresh !== null
    );

    if (any_R_AC.length > 0 || any_L_AC.length > 0) {
      audiogramData.legend.ACunmasked = "show";
      ACnormal.style.display = "table-row";
    }
  }
  if (audiogramData.legend.ACmasked !== "show") {
    const any_RmaskedAC = audiogramData.symbols_R.filter(
      (symbol) => symbol === "triangle"
    );
    const any_LmaskedAC = audiogramData.symbols_L.filter(
      (symbol) => symbol === "rect"
    );

    if (any_RmaskedAC.length > 0 || any_LmaskedAC.length > 0) {
      audiogramData.legend.ACmasked = "show";
      ACmasked.style.display = "table-row";
    }
  }
  if (audiogramData.legend.BCunmasked !== "show") {
    const any_R_BC = audiogramData.thresh_BC_R.filter(
      (thresh) => thresh !== null
    );
    const any_L_BC = audiogramData.thresh_BC_L.filter(
      (thresh) => thresh !== null
    );

    if (any_L_BC.length > 0 || any_R_BC.length > 0) {
      audiogramData.legend.BCunmasked = "show";
      BCnormal.style.display = "table-row";
    }
  }
  if (audiogramData.legend.BCmasked !== "show") {
    const any_RmaskedBC = audiogramData.symbols_BC_R.filter(
      (symbol) => symbol === BC_R_M
    );
    const any_LmaskedBC = audiogramData.symbols_BC_L.filter(
      (symbol) => symbol === BC_L_M
    );

    if (any_RmaskedBC.length > 0 || any_LmaskedBC.length > 0) {
      audiogramData.legend.BCmasked = "show";
      BCmasked.style.display = "table-row";
    }
  }
  if (audiogramData.legend.NR !== "show") {
    const any_R_NR = audiogramData.thresh_NR_R.filter(
      (thresh) => thresh !== null
    );
    const any_L_NR = audiogramData.thresh_NR_L.filter(
      (thresh) => thresh !== null
    );

    if (any_L_NR.length > 0 || any_R_NR.length > 0) {
      audiogramData.legend.NR = "show";
      NR.style.display = "table-row";
    }

    const any_R_BC_NR = audiogramData.pointSize_NR_BC_R.filter(
      (thresh) => thresh === 10
    );
    const any_L_BC_NR = audiogramData.pointSize_NR_BC_L.filter(
      (thresh) => thresh === 10
    );

    if (any_R_BC_NR.length > 0 || any_L_BC_NR.length > 0) {
      audiogramData.legend.NR = "show";
      NR.style.display = "table-row";
    }
  }
  if (audiogramData.legend.Aided !== "show") {
    const any_R_Aided = audiogramData.thresh_Aided_R.filter((thresh) => thresh !== null);
    const any_L_Aided = audiogramData.thresh_Aided_L.filter((thresh) => thresh !== null);
    const any_R_Aided_NR = audiogramData.thresh_NR_Aided_R.filter((thresh) => thresh !== null);
    const any_L_Aided_NR = audiogramData.thresh_NR_Aided_L.filter((thresh) => thresh !== null);

    if (any_R_Aided.length > 0 || any_L_Aided.length > 0 || any_R_Aided_NR.length > 0 || any_L_Aided_NR.length > 0) {
      audiogramData.legend.Aided = "show";
      AidedLegend.style.display = "table-row";
    }
  }
}

const maskingNorms = {
  insert: [],
  circumaural: [],
  supraaural: [],
};

window.onload = () => {
  toggleTransducer("AC");
  toggleData(5);
  toggleData(6);
  fillInLegendPrevDate();
};

window.onbeforeprint = (event) => {
  if (userPrefs.crosshairFlag === "on") {
    toggleCrosshair("off");
  }
};

window.onafterprint = (event) => {
  if (userPrefs.crosshairFlag === "on") {
    toggleCrosshair("on");
  }
};

ac_point_size_slider.addEventListener("change", adjustAllACpointSizes);
bc_point_size_slider.addEventListener("change", adjustAllBCpointSizes);
aided_point_size_slider.addEventListener("change", adjustAllAidedPointSizes);

import {
  audiogramData,
  oldAudiogramData,
  BC_R,
  BC_L,
  BC_R_M,
  BC_L_M,
  R_NR,
  L_NR,
} from "./dataAndImages.js";

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

function calcMasking() {
  const OKtoCalc = document.getElementById("calc_WR_masking_please");
  if (OKtoCalc.checked === false) {
    return;
  }
  const SRT_R = document.getElementById("SRT_right_advanced").value;
  const SRT_L = document.getElementById("SRT_left_advanced").value;
  const WR_R = document.getElementById("WR_right_pres_level").value;
  const WR_L = document.getElementById("WR_left_pres_level").value;
  const maskSRT_R = document.getElementById("SRT_right_masking");
  const maskSRT_L = document.getElementById("SRT_left_masking");
  const maskWR_R = document.getElementById("WR_right_mask_level");
  const maskWR_L = document.getElementById("WR_left_mask_level");

  if (SRT_R) {
    maskSRT_R.value = SRT_R - 35;
    if (maskSRT_R.value <= SRT_L) {
      maskSRT_R.value = parseInt(SRT_L) + 5;
    }
    if (SRT_R <= 40) {
      maskSRT_R.value = "";
    }
  }
  if (SRT_L) {
    maskSRT_L.value = SRT_L - 35;
    if (maskSRT_L.value <= SRT_R) {
      maskSRT_L.value = parseInt(SRT_R) + 5;
    }
    if (SRT_L <= 40) {
      maskSRT_L.value = "";
    }
  }
  if (WR_R) {
    maskWR_R.value = WR_R - 35;
    if (maskWR_R.value <= WR_L) {
      maskWR_R.value = parseInt(WR_L) + 5;
    }
    if (WR_R <= 40) {
      maskWR_R.value = "";
    }
  }
  if (WR_L) {
    maskWR_L.value = WR_L - 35;
    if (maskWR_L.value <= WR_R) {
      maskWR_L.value = parseInt(WR_R) + 5;
    }
    if (WR_L <= 40) {
      maskWR_L.value = "";
    }
  }
}
copy_data.addEventListener("click", copyData);
function copyData() {
  const RPTA = !audiogramData.PTA_R
    ? "Not available"
    : Math.floor(audiogramData.PTA_R) + " dB";
  const LPTA = !audiogramData.PTA_L
    ? "Not available"
    : Math.floor(audiogramData.PTA_L) + " dB";
  const RWR = !audiogramData.wordRec_R[0]
    ? "Not available"
    : audiogramData.wordRec_R + " %";
  const LWR = !audiogramData.wordRec_L[0]
    ? "Not available"
    : audiogramData.wordRec_L + " %";

  const resultt = `Right Ear:
    	PTA: 
      	${RPTA}.
      Word Recognition: 
      	${RWR}.
        
Left Ear:
    	PTA: 
      	${LPTA}.
      Word Recognition: 
      	${LWR}.`;
  alert(resultt);
}

const WR_modal = document.getElementById("WR_modal");
const closeWRbutton = document.getElementById("closeWR");
const command_modal = document.getElementById("command_modal");
command_palette.addEventListener("click", launchCommandPalette);
function closeWordRec(event) {
  if (event.target === WR_modal || event.target === closeWRbutton) {
    WR_modal.style.display = "none";
    WR_modal.removeEventListener("click", closeWordRec);
  }
}
word_rec.addEventListener("click", launchWordRec);
function launchWordRec() {
  WR_modal.style.display = "block";
  WR_modal.addEventListener("click", closeWordRec);
  const PTA_R = document.getElementById("PTA_R_forWR");
  const PTA_L = document.getElementById("PTA_L_forWR");
  if (audiogramData.PTA_R !== undefined) {
    PTA_R.innerText = `PTA ${Math.floor(audiogramData.PTA_R)} dB`;
  }
  if (audiogramData.PTA_L !== undefined) {
    PTA_L.innerText = `PTA ${Math.floor(audiogramData.PTA_L)} dB`;
  }
}

function launchCommandPalette() {
  command_modal.style.display = "block";
  command_modal.addEventListener("click", closeCommandPalette);
}

function closeCommandPalette(event) {
  if (event.target.id === "command_modal") {
    command_modal.style.display = "none";
    command_modal.removeEventListener("click", closeCommandPalette);
  }
}

const NRbtns = document.querySelectorAll(".NR");
NRbtns.forEach((btn) => {
  btn.addEventListener("click", setNR);
});

function setNR() {
  const index = parseInt(this.dataset.index);
  const earNR = this.dataset.ear;

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
        : audiogramData.thresh_BC_R[index];
  }
  if (ear === "L") {
    olddB =
      transducer === "AC"
        ? audiogramData.thresh_AC_L[index]
        : audiogramData.thresh_BC_L[index];
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
    } else {
      dB = null;
    }
  }
  moveIt(index, dB, ear);
}

function calcInterOct(index, dB, ear) {
  let interOct;
  const tested = dB === null ? 0 : 1;
  //check for interoct
  if (index === 4 || index === 6 || index === 8 || index === 10) {
    if (ear === "R") {
      audiogramData.interOctTested_AC_R.splice(index, 1, tested);
    } else if (ear === "L") {
      audiogramData.interOctTested_AC_L.splice(index, 1, tested);
    }
    interOct = 1;
  }

  if (ear === "R") {
    //-----start of loop
    for (let i = 0; i < 12; i++) {
      //sets point size to show if tested is true
      if (audiogramData.interOctTested_AC_R[i] === 1) {
        audiogramData.pointSize_AC_R.splice(i, 1, 10);
      }
      //calcs the interoct
      if (audiogramData.interOctTested_AC_R[i] === 0) {
        let a = audiogramData.thresh_AC_R[i - 1];
        let b = audiogramData.thresh_AC_R[i + 1];
        if (a === null || b === null) {
        } else {
          audiogramData.thresh_AC_R.splice(i, 1, (a + b) / 2);
          audiogramData.pointSize_AC_R.splice(i, 1, 0);
        }
      }
    } //-----end of loop
    if (!interOct && dB === null) {
      //look left and right of the index in thresh and in io tested
      //if io tested left = 0 and index left thresh <> null, set index left thresh = null
      let leftSideIO = audiogramData.interOctTested_AC_R[index - 1];
      let rightSideIO = audiogramData.interOctTested_AC_R[index + 1];
      let leftSideThresh = audiogramData.thresh_AC_R[index - 1];
      let rightSideThresh = audiogramData.thresh_AC_R[index + 1];

      if (leftSideIO === 0 && leftSideThresh !== null) {
        audiogramData.thresh_AC_R.splice(index - 1, 1, null);
      }
      if (rightSideIO === 0 && rightSideThresh !== null) {
        audiogramData.thresh_AC_R.splice(index + 1, 1, null);
      }
    }
  }
  if (ear === "L") {
    for (let i = 0; i < 12; i++) {
      if (audiogramData.interOctTested_AC_L[i] === 1) {
        audiogramData.pointSize_AC_L.splice(i, 1, 10);
      }
      if (audiogramData.interOctTested_AC_L[i] === 0) {
        let a = audiogramData.thresh_AC_L[i - 1];
        let b = audiogramData.thresh_AC_L[i + 1];
        if (a === null || b === null) {
        } else {
          audiogramData.thresh_AC_L.splice(i, 1, (a + b) / 2);
          audiogramData.pointSize_AC_L.splice(i, 1, 0);
        }
      }
    }
    if (!interOct && dB === null) {
      let leftSideIO = audiogramData.interOctTested_AC_L[index - 1];
      let rightSideIO = audiogramData.interOctTested_AC_L[index + 1];
      let leftSideThresh = audiogramData.thresh_AC_L[index - 1];
      let rightSideThresh = audiogramData.thresh_AC_L[index + 1];
      if (leftSideIO === 0 && leftSideThresh !== null) {
        audiogramData.thresh_AC_L.splice(index - 1, 1, null);
      }
      if (rightSideIO === 0 && rightSideThresh !== null) {
        audiogramData.thresh_AC_L.splice(index + 1, 1, null);
      }
    }
  }
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
  audiogramData.PTA_R = calcPTA(audiogramData.thresh_AC_R);
  audiogramData.PTA_L = calcPTA(audiogramData.thresh_AC_L);
  updateCharts();
  annotatePTA();
}

function updateCharts() {
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

const bigHz = [125, 250, "", 500, "", 1000, "", 2000, "", 4000, "", 8000];
const lilHz = ["", 250, "", 500, "", 1000, "", 2000, "", 4000, "", 8000];

const barColors_R = [
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
];
const barColors_L = [
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
];

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
    (ioTestNew[index] === 0 && index === 4) ||
    index === 6 ||
    index === 8 ||
    index === 10
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
          myChart3.config.data.datasets[0].backgroundColor = barColors;
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
        myChart3.config.data.datasets[0].backgroundColor = barColors;
      }
    }
    updateCharts();
  }
}

let transducer = "AC";
//----sets AC BC toggle to AC when load.

const options_R = {
  type: "line",
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
          linePTA: {
            type: "line",
            yMin: 0,
            yMax: 0,
            xMin: 3,
            xMax: 7,
            borderColor: "rgba(255, 0, 0, 0.4)",
            borderWidth: 0,
            drawTime: "beforeDatasetsDraw",
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
        display: false,
        align: "center",
        text: "Right",
        padding: 5,
      },
      crosshair: {
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

const options_L = {
  type: "line",
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
          linePTA: {
            type: "line",
            yMin: 0,
            yMax: 0,
            xMin: 3,
            xMax: 7,
            borderColor: "rgba(0, 0, 255, 0.4)",
            borderWidth: 0,
            drawTime: "beforeDatasetsDraw",
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
        display: false,
        text: "Left",
        padding: 5,
      },
      crosshair: {
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

const options_bar_R = {
  type: "bar",
  data: {
    labels: lilHz,
    datasets: [
      {
        label: "R Change",
        data: audiogramData.changeDetails.change_R,
        borderWidth: 0.5,
        backgroundColor: barColors_R,
        borderColor: "gray",
      },
    ],
  },
  plugins: [ChartDataLabels],
  options: {
    animation: {
      delay: 50,
      duration: 1000,
      easing: "easeOutSine",
    },
    layout: {
      padding: {
        right: 4,
        left: 3,
      },
    },
    responsive: false,
    plugins: {
      datalabels: {
        color: "red",
        formatter: function (value, context) {
          var i = context.dataIndex;
          var direction = context.dataset.data[i];
          var glyph = direction > 0 ? "▲" : direction < 0 ? "▼" : "=";
          return value === null ? "" : glyph + " " + Math.abs(value);
        },
        align: "center",
        //        align: function(context) {
        //          var index = context.dataIndex;
        //          var position = context.dataset.data[index];
        //          return position > 0 ? 'end' :
        //            position < 0 ? 'start' :
        //           'center';
        //        },
        padding: 15,
      },
      crosshair: {
        line: {
          width: 1,
          color: "red",
        },
        zoom: {
          enabled: false,
        },
        snap: {
          enabled: false,
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      annotation: {
        annotations: {
          line0: {
            type: "line",
            yMin: 0,
            yMax: 0,
            borderColor: "rgb(0, 0, 0)",
            borderWidth: 1,
          },
          line1: {
            type: "line",
            yMin: 10,
            yMax: 10,
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 1,
            borderDash: [3, 3],
          },
          line2: {
            type: "line",
            yMin: -10,
            yMax: -10,
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 1,
            borderDash: [3, 3],
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: false,
          color: "rgb(255, 0, 0)",
        },
      },
      y: {
        display: false,
        min: -60,
        max: 60,
        ticks: {
          stepSize: 10,
        },
        reverse: false,
      },
    },
  },
};

const options_bar_L = {
  type: "bar",
  data: {
    labels: lilHz,
    datasets: [
      {
        label: "L Change",
        data: audiogramData.changeDetails.change_L,
        borderWidth: 0.2,
        backgroundColor: barColors_L,
        borderColor: "gray",
      },
    ],
  },
  plugins: [ChartDataLabels],
  options: {
    animation: {
      delay: 50,
      duration: 1000,
      easing: "easeOutSine",
    },
    layout: {
      padding: {
        right: 13,
      },
    },
    responsive: false,
    plugins: {
      datalabels: {
        color: "blue",
        formatter: function (value, context) {
          var i = context.dataIndex;
          var direction = context.dataset.data[i];
          var glyph = direction > 0 ? "▲" : direction < 0 ? "▼" : "=";
          return value === null ? "" : glyph + " " + Math.abs(value);
        },
        align: function (context) {
          var index = context.dataIndex;
          var position = context.dataset.data[index];
          return position > 0 ? "end" : position < 0 ? "start" : "center";
        },
        padding: 15,
      },
      crosshair: {
        line: {
          width: 1,
          color: "blue",
        },
        zoom: {
          enabled: false,
        },
        snap: {
          enabled: false,
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Change L",
      },
      annotation: {
        annotations: {
          line0: {
            type: "line",
            yMin: 0,
            yMax: 0,
            borderColor: "rgb(0, 0, 0)",
            borderWidth: 1,
          },
          line1: {
            type: "line",
            yMin: 10,
            yMax: 10,
            borderColor: "rgba(0, 0, 0,0.5)",
            borderWidth: 1,
            borderDash: [3, 3],
          },
          line2: {
            type: "line",
            yMin: -10,
            yMax: -10,
            borderColor: "rgb(0, 0, 0,0.5)",
            borderWidth: 1,
            borderDash: [3, 3],
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: false,
          color: "rgb(0, 0, 255)",
        },
      },
      y: {
        display: false,
        min: -60,
        max: 60,
        ticks: {
          stepSize: 10,
        },
        reverse: false,
      },
    },
  },
};

const ctx = document.getElementById("audiogram_R").getContext("2d");
const myChart = new Chart(ctx, options_R);

const ctx2 = document.getElementById("audiogram_L").getContext("2d");
const myChart2 = new Chart(ctx2, options_L);

const ctx3 = document.getElementById("change_R").getContext("2d");
const myChart3 = new Chart(ctx3, options_bar_R);

const ctx4 = document.getElementById("change_L").getContext("2d");
const myChart4 = new Chart(ctx4, options_bar_L);

change_R.addEventListener("click", function (evt) {
  changeResolution("R");
});
change_L.addEventListener("click", function (evt) {
  changeResolution("L");
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
  const copyObj = {};
  if (ear === "R" && transducer === "AC") {
    copyObj.sourceThresh = audiogramData.thresh_AC_R;
    copyObj.sourcePS = audiogramData.pointSize_AC_R;
    copyObj.sourcePsNr = audiogramData.pointSize_NR_R;
    copyObj.sourceThreshNR = audiogramData.thresh_NR_R;
    copyObj.sourceInterOctTested = audiogramData.interOctTested_AC_R;
    copyObj.targetThresh = audiogramData.thresh_AC_L;
    copyObj.targetPS = audiogramData.pointSize_AC_L;
    copyObj.targetPsNr = audiogramData.pointSize_NR_L;
    copyObj.targetThreshNR = audiogramData.thresh_NR_L;
    copyObj.targetinterOctTested = audiogramData.interOctTested_AC_L;
  }
  if (ear === "L" && transducer === "AC") {
    copyObj.sourceThresh = audiogramData.thresh_AC_L;
    copyObj.sourcePS = audiogramData.pointSize_AC_L;
    copyObj.sourcePsNr = audiogramData.pointSize_NR_L;
    copyObj.sourceThreshNR = audiogramData.thresh_NR_L;
    copyObj.sourceInterOctTested = audiogramData.interOctTested_AC_L;
    copyObj.targetThresh = audiogramData.thresh_AC_R;
    copyObj.targetPS = audiogramData.pointSize_AC_R;
    copyObj.targetPsNr = audiogramData.pointSize_NR_R;
    copyObj.targetThreshNR = audiogramData.thresh_NR_R;
    copyObj.targetinterOctTested = audiogramData.interOctTested_AC_R;
  }
  if (ear === "R" && transducer === "BC") {
    copyObj.sourceThresh = audiogramData.thresh_BC_R;
    copyObj.sourcePsNr = audiogramData.pointSize_NR_BC_R;
    copyObj.sourceThreshNR = audiogramData.thresh_NR_R;
    copyObj.targetThresh = audiogramData.thresh_BC_L;
    copyObj.targetPsNr = audiogramData.pointSize_NR_L;
    copyObj.targetThreshNR = audiogramData.thresh_NR_L;
  }
  if (ear === "L" && transducer === "BC") {
    copyObj.sourceThresh = audiogramData.thresh_BC_L;
    copyObj.sourcePsNr = audiogramData.pointSize_NR_L;
    copyObj.sourceThreshNR = audiogramData.thresh_NR_L;
    copyObj.targetThresh = audiogramData.thresh_BC_R;
    copyObj.targetPsNr = audiogramData.pointSize_NR_R;
    copyObj.targetThreshNR = audiogramData.thresh_NR_R;
  }
  if (confirm(copyAlertMessage)) {
    //spread in the source arrays to the target arrays
    copyObj.targetThresh.splice(
      0,
      copyObj.targetThresh.length,
      ...copyObj.sourceThresh
    );
    copyObj.targetPS?.splice(0, copyObj.targetPS.length, ...copyObj.sourcePS);
    copyObj.targetPsNr.splice(
      0,
      copyObj.targetPsNr.length,
      ...copyObj.sourcePsNr
    );
    copyObj.targetThreshNR.splice(
      0,
      copyObj.targetThreshNR.length,
      ...copyObj.sourceThreshNR
    );
    copyObj.targetinterOctTested?.splice(
      0,
      copyObj.targetinterOctTested.length,
      ...copyObj.sourceInterOctTested
    );
  }
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
  updateCharts();
}

//fx used to handle freq between 250 and 500. Takes input and returns 375 interpolation if valid. The calling script does the splice.
function nonFreq(a, b, ear) {
  //AC branch
  if (transducer === "AC") {
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
function toggleTransducer(initialState) {
  if (initialState === "AC" || this.id === "AC_button") {
    transducer = "AC";
    document.getElementById("AC_button").className = "button_U";
    document.getElementById("BC_button").className = "button_T";
  } else {
    transducer = "BC";
    document.getElementById("BC_button").className = "button_U";
    document.getElementById("AC_button").className = "button_T";
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
      myChart.options.plugins.annotation.annotations.linePTA.yMin = 0;
      myChart.options.plugins.annotation.annotations.linePTA.yMax = 0;
      myChart.options.plugins.annotation.annotations.linePTA.borderWidth = 0;
      myChart2.options.plugins.annotation.annotations.linePTA.yMin = 0;
      myChart2.options.plugins.annotation.annotations.linePTA.yMax = 0;
      myChart2.options.plugins.annotation.annotations.linePTA.borderWidth = 0;
      updateCharts();
      return;
    }
    if (annotatePTApref === "on") {
      annotatePTAon.classList.add("toggle-button-enabled");
      annotatePTAoff.classList.add("toggle-button-disabled");
    }
  }

  let valueR;
  let valueL;
  let lineR = 4;
  let lineL = 4;
  if (audiogramData.PTA_R === undefined) {
    valueR = 0;
    lineR = 0;
  } else {
    valueR = audiogramData.PTA_R;
  }
  if (audiogramData.PTA_L === undefined) {
    valueL = 0;
    lineL = 0;
  } else {
    valueL = audiogramData.PTA_L;
  }

  myChart.options.plugins.annotation.annotations.linePTA.yMin = valueR;
  myChart.options.plugins.annotation.annotations.linePTA.yMax = valueR;
  myChart.options.plugins.annotation.annotations.linePTA.borderWidth = lineR;
  myChart2.options.plugins.annotation.annotations.linePTA.yMin = valueL;
  myChart2.options.plugins.annotation.annotations.linePTA.yMax = valueL;
  myChart2.options.plugins.annotation.annotations.linePTA.borderWidth = lineL;
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

function changeResolution(ear) {
  //  this changes which bar chart is showing. change calc is done elsewhere
  let state =
    ear === "R"
      ? audiogramData.changeDetails.changeResolution_R
      : audiogramData.changeDetails.changeResolution_L;
  const changePTA =
    ear === "R"
      ? audiogramData.changeDetails.changePTA_R
      : audiogramData.changeDetails.changePTA_L;

  if (state === "full") {
    if (ear === "R") {
      myChart3.config.data.datasets[0].data = audiogramData.changeDetails.LMH_R;
      myChart3.config.data.labels = ["Low", "Mid", "High"];
      myChart3.update();
      audiogramData.changeDetails.changeResolution_R = "lowMidHigh";
      return;
    } else {
      myChart4.config.data.datasets[0].data = audiogramData.changeDetails.LMH_L;
      myChart4.config.data.labels = ["Low", "Mid", "High"];
      myChart4.update();
      audiogramData.changeDetails.changeResolution_L = "lowMidHigh";
      return;
    }
  }
  if (state === "lowMidHigh") {
    if (ear === "R") {
      myChart3.config.data.datasets[0].data = changePTA;
      myChart3.config.data.labels = ["PTA"];
      myChart3.update();
      audiogramData.changeDetails.changeResolution_R = "PTA";
      return;
    } else {
      myChart4.config.data.datasets[0].data = changePTA;
      myChart4.config.data.labels = ["PTA"];
      myChart4.update();
      audiogramData.changeDetails.changeResolution_L = "PTA";
      return;
    }
  }
  if (state === "PTA") {
    if (ear === "R") {
      myChart3.config.data.datasets[0].data =
        audiogramData.changeDetails.change_R;
      myChart3.config.data.labels = lilHz;
      myChart3.update();
      audiogramData.changeDetails.changeResolution_R = "full";
      return;
    } else {
      myChart4.config.data.datasets[0].data =
        audiogramData.changeDetails.change_L;
      myChart4.config.data.labels = lilHz;
      myChart4.update();
      audiogramData.changeDetails.changeResolution_L = "full";
      return;
    }
  }
}

audiogramData.PTA_R = calcPTA(audiogramData.thresh_AC_R);
audiogramData.PTA_L = calcPTA(audiogramData.thresh_AC_L);

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
  previous_dateContent.innerText = oldAudiogramData.DateOfTest;
}

function fillInLegend() {
  //stops function if legend is full.
  if (
    audiogramData.legend.ACunmasked === "show" &&
    audiogramData.legend.ACmasked === "show" &&
    audiogramData.legend.BCunmasked === "show" &&
    audiogramData.legend.BCmasked === "show" &&
    audiogramData.legend.NR === "show"
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

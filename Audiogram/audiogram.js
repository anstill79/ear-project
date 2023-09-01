const CrosshairRemover = {
  id: 'crosshair-remover',
  afterEvent: (chart, args, options) => {
    if (args.event.type == 'mouseout') {
      chart.update('none')
    }
  }
}

Chart.register(CrosshairRemover);

function calcMasking() {
  const OKtoCalc = document.getElementById('calc_WR_masking_please');
  if (OKtoCalc.checked === false) {
    return
  }
  const SRT_R = document.getElementById('SRT_right_advanced').value;
  const SRT_L = document.getElementById('SRT_left_advanced').value;
  const WR_R = document.getElementById('WR_right_pres_level').value;
  const WR_L = document.getElementById('WR_left_pres_level').value;
  const maskSRT_R = document.getElementById('SRT_right_masking');
  const maskSRT_L = document.getElementById('SRT_left_masking');
  const maskWR_R = document.getElementById('WR_right_mask_level');
  const maskWR_L = document.getElementById('WR_left_mask_level');

  if (SRT_R) {
    maskSRT_R.value = SRT_R - 35;
    if (maskSRT_R.value <= SRT_L) {
      maskSRT_R.value = parseInt(SRT_L) + 5
    }
    if (SRT_R <= 40) {
      maskSRT_R.value = ""
    }
  }
  if (SRT_L) {
    maskSRT_L.value = SRT_L - 35;
    if (maskSRT_L.value <= SRT_R) {
      maskSRT_L.value = parseInt(SRT_R) + 5
    }
    if (SRT_L <= 40) {
      maskSRT_L.value = ""
    }
  }
  if (WR_R) {
    maskWR_R.value = WR_R - 35;
    if (maskWR_R.value <= WR_L) {
      maskWR_R.value = parseInt(WR_L) + 5
    }
    if (WR_R <= 40) {
      maskWR_R.value = ""
    }
  }
  if (WR_L) {
    maskWR_L.value = WR_L - 35;
    if (maskWR_L.value <= WR_R) {
      maskWR_L.value = parseInt(WR_R) + 5
    }
    if (WR_L <= 40) {
      maskWR_L.value = ""
    }
  }
}

function copyData() {

  const RPTA = !audiogramData.PTA_R ? 'Not available' : Math.floor(audiogramData.PTA_R) + ' dB';
  const LPTA = !audiogramData.PTA_L ? 'Not available' : Math.floor(audiogramData.PTA_L) + ' dB';
  const RWR = !audiogramData.wordRec_R[0] ? 'Not available' : audiogramData.wordRec_R + ' %';
  const LWR = !audiogramData.wordRec_L[0] ? 'Not available' : audiogramData.wordRec_L + ' %';

  const resultt =
    `Right Ear:
    	PTA: 
      	${RPTA}.
      Word Recognition: 
      	${RWR}.
        
Left Ear:
    	PTA: 
      	${LPTA}.
      Word Recognition: 
      	${LWR}.`
  alert(resultt);
}

const WR_modal = document.getElementById("WR_modal");
const closeWRbutton = document.getElementById("closeWR");
const command_modal = document.getElementById("command_modal");

function closeWordRec(event) {
  if (event.target === WR_modal || event.target === closeWRbutton) {
    WR_modal.style.display = "none";
    WR_modal.removeEventListener("click", closeWordRec);
  }
}

function launchWordRec() {
  WR_modal.style.display = "block";
  WR_modal.addEventListener("click", closeWordRec);
  const PTA_R = document.getElementById('PTA_R_forWR');
  const PTA_L = document.getElementById('PTA_L_forWR');
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


function setNR(index, ear, transducer) {

  let thresh = ear === 'R' ? audiogramData.thresh_AC_R : audiogramData.thresh_AC_L;
  let thresh_BC = ear === 'R' ? audiogramData.thresh_BC_R : audiogramData.thresh_BC_L;
  let old_dB = ear === 'R' ? audiogramData.thresh_AC_R[index] : audiogramData.thresh_AC_L[index];
  let NR = ear === 'R' ? audiogramData.thresh_NR_R : audiogramData.thresh_NR_L;
  let size = ear === 'R' ? audiogramData.pointSize_NR_R : audiogramData.pointSize_NR_L;
  let size_BC = ear === 'R' ? audiogramData.pointSize_NR_BC_R : audiogramData.pointSize_NR_BC_L;
  let changeNR = ear === 'R' ? audiogramData.change_R : audiogramData.change_L;
  let IO = ear === 'R' ? audiogramData.interOctTested_AC_R : audiogramData.interOctTested_AC_L;

  if (IO[index] === 0 && transducer !== "BC") {
    return
  }

  if (old_dB !== null && transducer === "AC") {
    NR.splice(index, 1, old_dB);
    size.splice(index, 1, 10);
    thresh.splice(index, 1, null);
    thresh.splice(2, 1, nonFreq(thresh[1], thresh[3], ear));
    changeNR.splice(index, 1, null);
  } else if (transducer === "BC") {
    size_BC.splice(index, 1, 10);
  }
  if (transducer === 'BC') {
    updateCharts();
    return;
  }
  if (index === 4 || index === 6 || index === 8 || index === 10) {
    calcInterOct(index, 1, ear)
  } else {
    calcInterOct(index, null, ear)
  }
  updateCharts();
}

function prepareMovement(index, dB, ear) {

  if (index === 2 || index < 0 || index > 11 || dB < -10 || dB > 120) {
    return
  }

  let olddB;
  if (ear === 'R') {
    olddB = (transducer === 'AC' ? audiogramData.thresh_AC_R[index] : audiogramData.thresh_BC_R[index])
  }
  if (ear === 'L') {
    olddB = (transducer === 'AC' ? audiogramData.thresh_AC_L[index] : audiogramData.thresh_BC_L[index])
  }

  let newdB;

  if (ear === 'R' && dB === olddB && transducer === 'AC' && index === 4 && audiogramData.interOctTested_AC_R[3] === 0 || index === 6 && audiogramData.interOctTested_AC_R[5] === 0 || index === 8 && audiogramData.interOctTested_AC_R[7] === 0 || index === 10 && audiogramData.interOctTested_AC_R[9] === 0) {
    return;
  }

  if (ear === 'L' && dB === olddB && transducer === 'AC' && index === 4 && audiogramData.interOctTested_AC_L[3] === 0 || index === 6 && audiogramData.interOctTested_AC_L[5] === 0 || index === 8 && audiogramData.interOctTested_AC_L[7] === 0 || index === 10 && audiogramData.interOctTested_AC_L[9] === 0) {
    return;
  }
  if (dB === undefined || dB === -15 || dB === 125) {
    return
  }
  if (dB === olddB) {
    dB = null
  }
  moveIt(index, dB, ear);
}

function calcInterOct(index, dB, ear) {

  let interOct;
  const tested = dB === null ? 0 : 1;
  //check for interoct
  if (index === 4 || index === 6 || index === 8 || index === 10) {
    if (ear === 'R') {
      audiogramData.interOctTested_AC_R.splice(index, 1, tested)
    } else
      if (ear === 'L') {
        audiogramData.interOctTested_AC_L.splice(index, 1, tested)
      }
    interOct = 1;
  }

  if (ear === 'R') {
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
        if (a === null || b === null) { } else {
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
        audiogramData.thresh_AC_R.splice(index - 1, 1, null)
      }
      if (rightSideIO === 0 && rightSideThresh !== null) {
        audiogramData.thresh_AC_R.splice(index + 1, 1, null)
      }
    }
  }
  if (ear === 'L') {
    for (let i = 0; i < 12; i++) {
      if (audiogramData.interOctTested_AC_L[i] === 1) {
        audiogramData.pointSize_AC_L.splice(i, 1, 10);
      }
      if (audiogramData.interOctTested_AC_L[i] === 0) {
        let a = audiogramData.thresh_AC_L[i - 1];
        let b = audiogramData.thresh_AC_L[i + 1];
        if (a === null || b === null) { } else {
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
        audiogramData.thresh_AC_L.splice(index - 1, 1, null)
      }
      if (rightSideIO === 0 && rightSideThresh !== null) {
        audiogramData.thresh_AC_L.splice(index + 1, 1, null)
      }
    }
  }
}

//-----------------------------------this is the main function
function moveIt(freqIndex, dB, ear) {

  if (ear === 'R' && transducer === 'AC') {
    audiogramData.thresh_NR_R.splice(freqIndex, 1, null);
    audiogramData.pointSize_NR_R.splice(freqIndex, 1, null);
    audiogramData.thresh_AC_R.splice(freqIndex, 1, dB);
    audiogramData.thresh_AC_R.splice(2, 1, nonFreq(audiogramData.thresh_AC_R[1], audiogramData.thresh_AC_R[3], 'R'));
    calcInterOct(freqIndex, dB, 'R');
    calcChange(freqIndex, 'R');

  }
  if (ear === 'R' && transducer === 'BC') {

    audiogramData.thresh_NR_BC_R.splice(freqIndex, 1, null);
    audiogramData.pointSize_NR_BC_R.splice(freqIndex, 1, null);
    audiogramData.thresh_BC_R.splice(freqIndex, 1, dB);
  }
  if (ear === 'L' && transducer === 'AC') {
    audiogramData.thresh_NR_L.splice(freqIndex, 1, null);
    audiogramData.pointSize_NR_L.splice(freqIndex, 1, null);
    audiogramData.thresh_AC_L.splice(freqIndex, 1, dB);
    audiogramData.thresh_AC_L.splice(2, 1, nonFreq(audiogramData.thresh_AC_L[1], audiogramData.thresh_AC_L[3], 'L'));
    calcInterOct(freqIndex, dB, 'L');
    calcChange(freqIndex, 'L');
  }
  if (ear === 'L' && transducer === 'BC') {
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

const changePTA_R = [null];
const changePTA_L = [null];

let changeResolution_R = 'full';
let changeResolution_L = 'full';

const audiogramData = {
  PTA_R: null,
  PTA_L: null,
  SRT_R: [null],
  SRT_L: [null],
  wordRec_R: [null],
  wordRec_L: [null],
  change_R: [null, null, null, null, null, null, null, null, null, null, null, null],
  change_L: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_AC_R: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_AC_L: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_BC_R: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_BC_L: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_NR_R: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_NR_L: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_NR_BC_R: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_NR_BC_L: [null, null, null, null, null, null, null, null, null, null, null, null],
  interOctTested_AC_R: [null, null, 0, null, 0, null, 0, null, 0, null, 0, null],
  interOctTested_AC_L: [null, null, 0, null, 0, null, 0, null, 0, null, 0, null],
  pointSize_AC_R: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_AC_L: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_hover_AC_R: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_hover_AC_L: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_NR_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  symbols_BC_R: [BC_R, BC_R, BC_R, BC_R, BC_R, BC_R, BC_R, BC_R, BC_R, BC_R, BC_R, BC_R],
  symbols_BC_L: [BC_L, BC_L, BC_L, BC_L, BC_L, BC_L, BC_L, BC_L, BC_L, BC_L, BC_L, BC_L],
  symbols_R: ['circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'circle'],
  symbols_L: ['crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot'],
  maskAll_AC_R_L_BC_R_L: [0, 0, 0, 0],
  legend: {
    ACunmasked: "hide",
    BCunmasked: "hide",
    ACmasked: "hide",
    BCmasked: "hide",
    NR: "hide"
  },
};

let oldAudiogramData = {
  thresh_AC_R: [null, 20, null, 35, 35, 40, 45, 55, 55, 60, 70, 80],
  thresh_AC_L: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_BC_R: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_BC_L: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_NR_R: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_NR_L: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_NR_BC_R: [null, null, null, null, null, null, null, null, null, null, null, null],
  thresh_NR_BC_L: [null, null, null, null, null, null, null, null, null, null, null, null],
  interOctTested_AC_R: [null, null, null, null, 0, 0, null, 0, null, 0, null, 0, null],
  interOctTested_AC_L: [null, null, null, null, 0, 0, null, 0, null, 0, null, 0, null],
  pointSize_AC_R: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_AC_L: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_hover_AC_R: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_hover_AC_L: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_NR_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  maskAll_AC_R_L_BC_R_L: [0, 0, 0, 0],
  DateOfTest: "6/1/2021"
};

const bigHz = [125, 250, '', 500, '', 1000, '', 2000, '', 4000, '', 8000];
const lilHz = ['', 250, '', 500, '', 1000, '', 2000, '', 4000, '', 8000];

const barColors_R = ['rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)'];
const barColors_L = ['rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)'];

const shaders = {
  loss_fill_on: {
    above: 'rgba(0,0,0,0)',
    below: 'rgba(0,0,0,0.1)',
    target: {
      value: 25
    }
  },
  loss_fill_off: {
    above: 'rgba(0,0,0,0)',
    below: 'rgba(0,0,0,0)',
    target: {
      value: 25
    }
  }
};

function HideHrgLossShade(bool) {

  const onButton = document.getElementById("shadeLossOn");
  const offButton = document.getElementById("shadeLossOff");
  onButton.removeAttribute('class');
  offButton.removeAttribute('class');

  if (bool === 'off') {
    myChart.config.data.datasets[0].fill = shaders.loss_fill_off;
    myChart2.config.data.datasets[0].fill = shaders.loss_fill_off;
    onButton.classList.add("toggle-button-disabled");
    offButton.classList.add("toggle-button-enabled");
  } else if (bool === 'on') {
    myChart.config.data.datasets[0].fill = shaders.loss_fill_on;
    myChart2.config.data.datasets[0].fill = shaders.loss_fill_on;
    onButton.classList.add("toggle-button-enabled");
    offButton.classList.add("toggle-button-disabled");
  }
  updateCharts();
}

let crosshairFlag = "on";
const crosshairOptions = {
  audioRight: {
    sync: {
      enabled: false
    },
    line: {
      width: 3,
      color: 'red'
    },
    zoom: {
      enabled: false
    },
    snap: {
      enabled: false
    },
  },
  audioLeft: {
    sync: {
      enabled: false
    },
    line: {
      width: 3,
      color: 'blue'
    },
    zoom: {
      enabled: false
    },
    snap: {
      enabled: false
    },
  },
  barRight: {
    sync: {
      enabled: false
    },
    line: {
      width: 3,
      color: 'red'
    },
    zoom: {
      enabled: false
    },
    snap: {
      enabled: false
    },
  },
  barLeft: {
    sync: {
      enabled: false
    },
    line: {
      width: 3,
      color: 'blue'
    },
    zoom: {
      enabled: false
    },
    snap: {
      enabled: false
    },
  },

}

function toggleNormShade(bool) {

  const normOn = document.getElementById('shadeNormOn');
  const normOff = document.getElementById('shadeNormOff');
  normOn.removeAttribute('class');
  normOff.removeAttribute('class');

  if (bool === "off") {
    myChart.config.options.plugins.annotation.annotations.normAdult.yMax = 0;
    myChart2.config.options.plugins.annotation.annotations.normAdult.yMax = 0;
    normOn.classList.add('toggle-button-disabled');
    normOff.classList.add('toggle-button-enabled');
  }
  if (bool === "on") {
    myChart.config.options.plugins.annotation.annotations.normAdult.yMax = 25;
    myChart2.config.options.plugins.annotation.annotations.normAdult.yMax = 25;
    normOff.classList.add('toggle-button-disabled');
    normOn.classList.add('toggle-button-enabled');
  }
  updateCharts();
}

function toggleCrosshair(bool) {

  const cHairOn = document.getElementById('crosshairOn');
  const cHairOff = document.getElementById('crosshairOff');
  cHairOn.removeAttribute('class');
  cHairOff.removeAttribute('class');

  if (bool === "off") {
    myChart.config.options.plugins.crosshair = false;
    myChart2.config.options.plugins.crosshair = false;
    myChart3.config.options.plugins.crosshair = false;
    myChart4.config.options.plugins.crosshair = false;
    cHairOn.classList.add('toggle-button-disabled');
    cHairOff.classList.add('toggle-button-enabled');

  }
  if (bool === "on") {
    myChart.config.options.plugins.crosshair = crosshairOptions.audioRight;
    myChart2.config.options.plugins.crosshair = crosshairOptions.audioLeft;
    myChart3.config.options.plugins.crosshair = crosshairOptions.barRight;
    myChart4.config.options.plugins.crosshair = crosshairOptions.barLeft;
    cHairOn.classList.add('toggle-button-enabled');
    cHairOff.classList.add('toggle-button-disabled');
  }
  updateCharts();
}

function calcChange(index, ear) {

  let threshOld = ear === 'R' ? oldAudiogramData.thresh_AC_R : oldAudiogramData.thresh_AC_L;
  let threshNew = ear === 'R' ? audiogramData.thresh_AC_R : audiogramData.thresh_AC_L;
  let change = ear === 'R' ? audiogramData.change_R : audiogramData.change_L;
  let newNR = ear === 'R' ? audiogramData.thresh_NR_R : audiogramData.thresh_NR_L;
  let oldNR = ear === 'R' ? oldAudiogramData.thresh_NR_R : oldAudiogramData.thresh_NR_L;
  let ioTestNew = ear === 'R' ? audiogramData.interOctTested_AC_R : audiogramData.interOctTested_AC_L;
  let ioTestOld = ear === 'R' ? oldAudiogramData.interOctTested_AC_R : oldAudiogramData.interOctTested_AC_L;
  let barColors = ear === 'R' ? barColors_R : barColors_L;
  let color1 = ear === 'R' ? 'rgba(255, 0, 0, 0.05)' : 'rgba(0, 0, 255, 0.05)';
  let color2 = ear === 'R' ? 'rgba(255, 0, 0, 0.10)' : 'rgba(0, 0, 255, 0.10)';
  let color3 = ear === 'R' ? 'rgba(255, 0, 0, 0.20)' : 'rgba(0, 0, 255, 0.20)';
  let color4 = ear === 'R' ? 'rgba(255, 0, 0, 0.30)' : 'rgba(0, 0, 255, 0.30)';

  if (ioTestNew[index] === 0 && index === 4 || index === 6 || index === 8 || index === 10) {
    change.splice(index, 1, null);
    return
  }

  if (threshNew[index] === null || threshOld[index] === null || newNR[index] !== null || oldNR[index] !== null) {

    change.splice(index, 1, null);
    return

  } else {
    change.splice(index, 1, threshOld[index] - threshNew[index]);
    change.splice(2, 1, null);
    if (ioTestNew[3] === 0 || ioTestOld[3] === 0) {
      change.splice(4, 1, null)
    }
    if (ioTestNew[5] === 0 || ioTestOld[5] === 0) {
      change.splice(6, 1, null)
    }
    if (ioTestNew[7] === 0 || ioTestOld[7] === 0) {
      change.splice(8, 1, null)
    }
    if (ioTestNew[9] === 0 || ioTestOld[9] === 0) {
      change.splice(10, 1, null)
    }
    if (Math.abs(threshOld[index] - threshNew[index]) < 10) {
      barColors.splice(index, 1, color1)
    } else
      if (Math.abs(threshOld[index] - threshNew[index]) > 9 && Math.abs(threshOld[index] - threshNew[index]) < 20) {
        barColors.splice(index, 1, color2)
      } else
        if (Math.abs(threshOld[index] - threshNew[index]) > 19 && Math.abs(threshOld[index] - threshNew[index]) < 30) {
          barColors.splice(index, 1, color3)
        } else
          if (Math.abs(threshOld[index] - threshNew[index]) > 29) {
            barColors.splice(index, 1, color4)
          }
    updateCharts();
  }
}

let transducer = 'AC';
//----sets AC BC toggle to AC when load. 

const options_R = {
  type: 'line',
  data: {
    labels: bigHz,
    datasets: [{
      label: 'AC_R',
      data: audiogramData.thresh_AC_R,
      borderWidth: 1,
      pointStyle: audiogramData.symbols_R,
      pointRadius: audiogramData.pointSize_AC_R,
      pointHoverRadius: audiogramData.pointSize_hover_AC_R,
      pointBorderWidth: 2,
      pointBackgroundColor: 'rgba(0, 0, 0, 0)',
      lineTension: 0,
      spanGaps: false,
      borderColor: "rgba(255,0,0,0.7)",
      clip: {
        left: false,
        top: false,
        right: false,
        bottom: false
      },
      fill: {
        above: 'rgba(0,0,0,0)',
        below: 'rgba(0,0,0,0.1)',
        target: {
          value: 25
        }
      }
    },
    {
      label: 'BC_R',
      data: audiogramData.thresh_BC_R,
      borderWidth: 0,
      pointStyle: audiogramData.symbols_BC_R,
      pointBackgroundColor: 'rgba(0, 0, 0, 0)',
      pointRadius: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      lineTension: 0,
      clip: {
        left: false,
        top: false,
        right: false,
        bottom: false
      }
    },
    {
      label: 'AC NR arrow',
      data: audiogramData.thresh_NR_R,
      pointRadius: audiogramData.pointSize_NR_R,
      pointStyle: R_NR,
      borderWidth: 0,
      clip: {
        left: false,
        top: false,
        right: false,
        bottom: false
      }
    },
    {
      label: 'AC NR thresh',
      data: audiogramData.thresh_NR_R,
      pointRadius: audiogramData.pointSize_NR_R,
      pointStyle: audiogramData.symbols_R,
      borderWidth: 0,
      pointBorderWidth: 2,
      pointBackgroundColor: 'rgba(0, 0, 0, 0)',
      borderColor: "rgba(255,0,0,0.3)",
      spanGaps: false,
      clip: {
        left: false,
        top: false,
        right: false,
        bottom: false
      }
    },
    {
      label: 'BC NR arrow',
      data: audiogramData.thresh_BC_R,
      pointRadius: audiogramData.pointSize_NR_BC_R,
      pointStyle: R_NR,
      pointHoverRadius: 0,
      borderWidth: 0,
      clip: {
        left: false,
        top: false,
        right: false,
        bottom: false
      },
    },
    {
      label: 'ghost',
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
        bottom: false
      }
    },
    {
      label: 'old',
      data: oldAudiogramData.thresh_AC_R,
      pointRadius: oldAudiogramData.pointSize_AC_R,
      borderColor: "rgba(255,0,0,0.1)",
      pointStyle: 'circle',
      spanGaps: true,
      pointHoverRadius: 0,
      borderWidth: 2,
      borderDash: [5, 5]
    },
    ]
  },
  options: {
    layout: {
      padding: 0,
    },

    transitions: {
      show: {
        animations: {
          x: {
            from: 300
          },
          y: {
            from: -100
          }
        }
      },
      hide: {
        animations: {
          x: {
            to: 60
          },
          y: {
            to: 1000
          }
        }
      }
    },
    elements: {
      point: {
        hitRadius: 3,
        hoverRadius: 15
      }
    },

    animations: {
      tension: {
        duration: 700,
        easing: 'easeInOutSine',
        from: 0.4,
        to: 0,
        loop: false
      }
    },
    animation: {
      duration: 0
    },
    interaction: {
      mode: 'index'
    },
    responsive: false,
    plugins: {
      autocolors: false,
      annotation: {
        annotations: {
          normAdult: {
            type: 'box',
            yMin: 0,
            yMax: 25,
            xMin: 1,
            backgroundColor: "rgba(230, 255, 110, 0.1)",
            borderColor: 'gray',
            borderWidth: 0,
            drawTime: 'beforeDatasetsDraw',
          },
          linePTA: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            xMin: 3,
            xMax: 7,
            borderColor: "rgba(255, 0, 0, 0.4)",
            borderWidth: 0,
            drawTime: 'beforeDatasetsDraw',
          },
        }
      },
      legend: {
        display: false,
        labels: {
          padding: 0,
          boxWidth: 5
        }
      },
      tooltip: {
        enabled: false
      },
      title: {
        display: false,
        align: 'center',
        text: 'Right',

        padding: 5
      },
      crosshair: {
        sync: {
          enabled: false
        },
        line: {
          width: 3,
          color: 'red'
        },
        zoom: {
          enabled: false
        },
        snap: {
          enabled: false
        },
      },
    },
    scales: {
      y: {
        grid: {
          drawTicks: false,
          color: 'grey',
          lineWidth: 0.5
        },
        min: -10,
        max: 120,
        ticks: {
          stepSize: 10,
          padding: 20,
          color: 'red',
          font: {
            size: 12
          },
        },
        reverse: true,
        beginAtZero: false
      },
      x: {
        grid: {
          display: true,
          drawTicks: false,
          lineWidth: [0, 0.5, 0, 0.5, 0.2, 0.5, 0.2, 0.5, 0.2, 0.5, 0.2, 0.5],
          color: 'grey',
        },
        ticks: {
          //space between Hz and border
          padding: 10,
          color: 'red',
          maxRotation: 0,
          autoSkip: false,
          font: {
            size: 12
          },
        },
      }
    },
    onClick: function (e) {
      const xLabel = this.scales.x.getValueForPixel(e.x);
      let yLabel = this.scales.y.getValueForPixel(e.y);
      yLabel = Math.round(yLabel / 5) * 5;
      prepareMovement(xLabel, yLabel, 'R');
    },
  }
};

const options_L = {
  type: 'line',
  data: {
    labels: bigHz,
    datasets: [{
      label: 'AC_L',
      data: audiogramData.thresh_AC_L,
      borderWidth: 1,
      pointStyle: audiogramData.symbols_L,
      pointRadius: audiogramData.pointSize_AC_L,
      pointHoverRadius: audiogramData.pointSize_hover_AC_L,
      pointBorderWidth: 2,
      pointBackgroundColor: 'rgba(0, 0, 0, 0)',
      lineTension: 0,
      spanGaps: false,
      borderColor: "rgba(0,0,255,0.7)",
      clip: {
        left: false,
        top: false,
        right: false,
        bottom: false
      },
      fill: {
        above: 'rgba(0,0,0,0)',
        below: 'rgba(0,0,0,0.1)',
        target: {
          value: 25
        }
      }
    },
    {
      label: 'BC_L',
      data: audiogramData.thresh_BC_L,
      borderWidth: 0,
      pointStyle: audiogramData.symbols_BC_L,
      pointBackgroundColor: 'rgba(0, 0, 0, 0)',
      pointRadius: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      lineTension: 0,
      clip: {
        left: false,
        top: false,
        right: false,
        bottom: false
      }
    },
    {
      label: 'AC NR arrow',
      data: audiogramData.thresh_NR_L,
      pointRadius: audiogramData.pointSize_NR_L,
      pointStyle: L_NR,
      borderWidth: 0,
      clip: {
        left: false,
        top: false,
        right: false,
        bottom: false
      }
    },
    {
      label: 'AC NR thresh',
      data: audiogramData.thresh_NR_L,
      pointRadius: audiogramData.pointSize_NR_L,
      pointStyle: audiogramData.symbols_L,
      borderWidth: 0,
      pointBorderWidth: 2,
      pointBackgroundColor: 'rgba(0, 0, 0, 0)',
      borderColor: "rgba(0,0,255,0.3)",
      spanGaps: false,
      clip: {
        left: false,
        top: false,
        right: false,
        bottom: false
      }
    },
    {
      label: 'BC NR arrow',
      data: audiogramData.thresh_BC_L,
      pointRadius: audiogramData.pointSize_NR_BC_L,
      pointStyle: L_NR,
      pointHoverRadius: 0,
      borderWidth: 0,
      clip: {
        left: false,
        top: false,
        right: false,
        bottom: false
      }
    },
    {
      label: 'ghost',
      data: audiogramData.thresh_AC_R,
      pointRadius: audiogramData.pointSize_AC_R,
      borderColor: "rgba(255,0,0,0.1)",
      pointBackgroundColor: 'rgba(0, 0, 0, 0)',
      pointStyle: audiogramData.symbols_R,
      spanGaps: true,
      pointHoverRadius: 0,
      borderWidth: 2,
      borderDash: [5, 5],
      clip: {
        left: false,
        top: false,
        right: false,
        bottom: false
      }
    },
    {
      label: 'old',
      data: oldAudiogramData.thresh_AC_L,
      pointRadius: oldAudiogramData.pointSize_AC_L,
      borderColor: "rgba(0,0,255,0.1)",
      pointStyle: 'circle',
      spanGaps: true,
      pointHoverRadius: 0,
      borderWidth: 2,
      borderDash: [5, 5],
      clip: {
        left: false,
        top: false,
        right: false,
        bottom: false
      }
    },
    ]
  },
  options: {
    transitions: {
      show: {
        animations: {
          x: {
            from: 300
          },
          y: {
            from: -100
          }
        }
      },
      hide: {
        animations: {
          x: {
            to: 60
          },
          y: {
            to: 1000
          }
        }
      }
    },
    elements: {
      point: {
        hitRadius: 15,
        hoverRadius: 15,
      }
    },

    animations: {
      tension: {
        duration: 700,
        easing: 'easeInOutSine',
        from: 0.4,
        to: 0,
      }
    },
    animation: {
      duration: 0
    },
    interaction: {
      mode: 'index'
    },
    responsive: false,
    plugins: {
      annotation: {
        annotations: {
          normAdult: {
            type: 'box',
            yMin: 0,
            yMax: 25,
            xMin: 1,
            backgroundColor: "rgba(230, 255, 110, 0.1)",
            borderColor: 'gray',
            borderWidth: 0,
            drawTime: 'beforeDatasetsDraw',
          },
          linePTA: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            xMin: 3,
            xMax: 7,
            borderColor: "rgba(0, 0, 255, 0.4)",
            borderWidth: 0,
            drawTime: 'beforeDatasetsDraw',
          },
        }
      },
      legend: {
        display: false,
        labels: {
          padding: 0,
          boxWidth: 5
        }

      },
      tooltip: {
        enabled: false
      },
      title: {
        display: false,
        text: 'Left',
        padding: 5
      },
      crosshair: {
        sync: {
          enabled: false
        },
        line: {
          width: 3,
          color: 'blue'
        },
        zoom: {
          enabled: false
        },
        snap: {
          enabled: false
        },
      },

    },
    scales: {
      y: {
        grid: {
          drawTicks: false,
          color: 'grey',
          lineWidth: 0.5
        },
        min: -10,
        max: 120,
        ticks: {
          stepSize: 10,
          padding: 20,
          color: 'blue',
          font: {
            size: 12
          },
        },
        reverse: true,
        beginAtZero: false
      },
      x: {
        grid: {
          display: true,
          drawTicks: false,
          lineWidth: [0, 0.5, 0, 0.5, 0.2, 0.5, 0.2, 0.5, 0.2, 0.5, 0.2, 0.5],
          color: 'grey',
        },
        ticks: {
          //space between Hz and border
          padding: 10,
          color: 'blue',
          maxRotation: 0,
          autoSkip: false,
          font: {
            size: 12
          },
        },
      }
    },
    onClick: function (e) {
      const xLabel = this.scales.x.getValueForPixel(e.x);
      let yLabel = this.scales.y.getValueForPixel(e.y);
      yLabel = Math.round(yLabel / 5) * 5;
      prepareMovement(xLabel, yLabel, 'L');
    },
  }
};


const options_bar_R = {
  type: 'bar',
  data: {
    labels: lilHz,
    datasets: [{
      label: 'R Change',
      data: audiogramData.change_R,
      borderWidth: 0.5,
      backgroundColor: barColors_R,
      borderColor: 'gray',
    }]
  },
  plugins: [ChartDataLabels],
  options: {
    animation: {
      delay: 50,
      duration: 1000,
      easing: 'easeOutSine',
    },
    layout: {
      padding: {
        right: 4,
        left: 3
      }
    },
    responsive: false,
    plugins: {
      datalabels: {
        color: 'red',
        formatter: function (value, context) {
          var i = context.dataIndex;
          var direction = context.dataset.data[i];
          var glyph = direction > 0 ? '▲' : direction < 0 ? '▼' : '=';
          return (value === null ? '' : glyph + ' ' + Math.abs(value))
        },
        align: 'center',
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
          color: 'red'
        },
        zoom: {
          enabled: false
        },
        snap: {
          enabled: false
        },
      },
      legend: {
        display: false
      },
      title: {
        display: false,
      },
      annotation: {
        annotations: {
          line0: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            borderColor: 'rgb(0, 0, 0)',
            borderWidth: 1,
          },
          line1: {
            type: 'line',
            yMin: 10,
            yMax: 10,
            borderColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 1,
            borderDash: [3, 3]
          },
          line2: {
            type: 'line',
            yMin: -10,
            yMax: -10,
            borderColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 1,
            borderDash: [3, 3]
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true
        },
        ticks: {
          maxRotation: 0,
          autoSkip: false,
          color: 'rgb(255, 0, 0)',
        }
      },
      y: {
        display: false,
        min: -60,
        max: 60,
        ticks: {
          stepSize: 10
        },
        reverse: false
      }
    },
  }
};

const options_bar_L = {
  type: 'bar',
  data: {
    labels: lilHz,
    datasets: [{
      label: 'L Change',
      data: audiogramData.change_L,
      borderWidth: 0.2,
      backgroundColor: barColors_L,
      borderColor: 'gray'
    }]
  },
  plugins: [ChartDataLabels],
  options: {
    animation: {
      delay: 50,
      duration: 1000,
      easing: 'easeOutSine',
    },
    layout: {
      padding: {
        right: 13,
      }
    },
    responsive: false,
    plugins: {
      datalabels: {
        color: 'blue',
        formatter: function (value, context) {
          var i = context.dataIndex;
          var direction = context.dataset.data[i];
          var glyph = direction > 0 ? '▲' : direction < 0 ? '▼' : '=';
          return (value === null ? '' : glyph + ' ' + Math.abs(value))
        },
        align: function (context) {
          var index = context.dataIndex;
          var position = context.dataset.data[index];
          return position > 0 ? 'end' :
            position < 0 ? 'start' :
              'center';
        },
        padding: 15,
      },
      crosshair: {
        line: {
          width: 1,
          color: 'blue'
        },
        zoom: {
          enabled: false
        },
        snap: {
          enabled: false
        },
      },
      legend: {
        display: false
      },
      title: {
        display: false,
        text: 'Change L'
      },
      annotation: {
        annotations: {
          line0: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            borderColor: 'rgb(0, 0, 0)',
            borderWidth: 1,
          },
          line1: {
            type: 'line',
            yMin: 10,
            yMax: 10,
            borderColor: 'rgba(0, 0, 0,0.5)',
            borderWidth: 1,
            borderDash: [3, 3]
          },
          line2: {
            type: 'line',
            yMin: -10,
            yMax: -10,
            borderColor: 'rgb(0, 0, 0,0.5)',
            borderWidth: 1,
            borderDash: [3, 3]
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true
        },
        ticks: {
          maxRotation: 0,
          autoSkip: false,
          color: 'rgb(0, 0, 255)',
        }
      },
      y: {
        display: false,
        min: -60,
        max: 60,
        ticks: {
          stepSize: 10
        },
        reverse: false
      }
    },
  },
};

const ctx = document.getElementById('audiogram_R').getContext('2d');
const myChart = new Chart(ctx, options_R);

const ctx2 = document.getElementById('audiogram_L').getContext('2d');
const myChart2 = new Chart(ctx2, options_L);

const ctx3 = document.getElementById('change_R').getContext('2d');
const myChart3 = new Chart(ctx3, options_bar_R);

const ctx4 = document.getElementById('change_L').getContext('2d');
const myChart4 = new Chart(ctx4, options_bar_L);

change_R.addEventListener('click', function (evt) {
  changeResolution('R');
})
change_L.addEventListener('click', function (evt) {
  changeResolution('L');
})

function download_image() {
  const canvas = document.getElementById("audiogram_R");
  const image = canvas.toDataURL("image/png");
  const link = document.createElement('a');
  const fileName = "Audiogram " + new Date().toLocaleTimeString();
  link.download = fileName + ".png";
  link.href = image;
  link.click();
}

function maskAll(ear) {

  const rightSymbol = (audiogramData.maskAll_AC_R_L_BC_R_L[0] === 0 ? ['triangle', 1] : ['circle', 0]);
  const leftSymbol = (audiogramData.maskAll_AC_R_L_BC_R_L[1] === 0 ? ['rect', 1] : ['crossRot', 0]);
  const rightBC = (audiogramData.maskAll_AC_R_L_BC_R_L[2] === 0 ? [BC_R_M, 1] : [BC_R, 0]);
  const leftBC = (audiogramData.maskAll_AC_R_L_BC_R_L[3] === 0 ? [BC_L_M, 1] : [BC_L, 0]);

  //flip the maskAll flag before mutating the symbols array
  if (transducer === 'AC' && ear === 'R') {
    audiogramData.maskAll_AC_R_L_BC_R_L.splice(0, 1, rightSymbol[1])
  } else if (transducer === 'AC' && ear === 'L') {
    audiogramData.maskAll_AC_R_L_BC_R_L.splice(1, 1, leftSymbol[1])
  } else if (transducer === 'BC' && ear === 'R') {
    audiogramData.maskAll_AC_R_L_BC_R_L.splice(2, 1, rightBC[1])
  } else if (transducer === 'BC' && ear === 'L') {
    audiogramData.maskAll_AC_R_L_BC_R_L.splice(3, 1, leftBC[1])
  }
  //mutate the array
  if (transducer === 'AC' && ear === 'R') {
    audiogramData.symbols_R.forEach(function (part, index, theArray) {
      audiogramData.symbols_R[index] = rightSymbol[0];
    })
  } else if (transducer === 'AC' && ear === 'L') {
    audiogramData.symbols_L.forEach(function (part, index, theArray) {
      audiogramData.symbols_L[index] = leftSymbol[0];
    })
  } else if (transducer === 'BC' && ear === 'R') {
    audiogramData.symbols_BC_R.forEach(function (part, index, theArray) {
      audiogramData.symbols_BC_R[index] = rightBC[0];
    })
  } else if (transducer === 'BC' && ear === 'L') {
    audiogramData.symbols_BC_L.forEach(function (part, index, theArray) {
      audiogramData.symbols_BC_L[index] = leftBC[0];
    })
  }
  updateCharts();
}

function copyEarAC(ear) {
  const copyAlertMessage = `Are you sure you want to copy ${ear === 'R' ? 'right' : 'left'} ${transducer} to ${ear === 'R' ? 'left' : 'right'} ${transducer}?`;
  const copyObj = {};
  if (ear === 'R' && transducer === 'AC') {
    copyObj.sourceThresh = audiogramData.thresh_AC_R
    copyObj.sourcePS = audiogramData.pointSize_AC_R
    copyObj.sourcePsNr = audiogramData.pointSize_NR_R
    copyObj.sourceThreshNR = audiogramData.thresh_NR_R
    copyObj.sourceInterOctTested = audiogramData.interOctTested_AC_R
    copyObj.targetThresh = audiogramData.thresh_AC_L
    copyObj.targetPS = audiogramData.pointSize_AC_L
    copyObj.targetPsNr = audiogramData.pointSize_NR_L
    copyObj.targetThreshNR = audiogramData.thresh_NR_L
    copyObj.targetinterOctTested = audiogramData.interOctTested_AC_L
  }
  if (ear === 'L' && transducer === 'AC') {
    copyObj.sourceThresh = audiogramData.thresh_AC_L
    copyObj.sourcePS = audiogramData.pointSize_AC_L
    copyObj.sourcePsNr = audiogramData.pointSize_NR_L
    copyObj.sourceThreshNR = audiogramData.thresh_NR_L
    copyObj.sourceInterOctTested = audiogramData.interOctTested_AC_L
    copyObj.targetThresh = audiogramData.thresh_AC_R
    copyObj.targetPS = audiogramData.pointSize_AC_R
    copyObj.targetPsNr = audiogramData.pointSize_NR_R
    copyObj.targetThreshNR = audiogramData.thresh_NR_R
    copyObj.targetinterOctTested = audiogramData.interOctTested_AC_R
  }
  if (ear === 'R' && transducer === 'BC') {
    copyObj.sourceThresh = audiogramData.thresh_BC_R
    copyObj.sourcePsNr = audiogramData.pointSize_NR_BC_R
    copyObj.sourceThreshNR = audiogramData.thresh_NR_R
    copyObj.targetThresh = audiogramData.thresh_BC_L
    copyObj.targetPsNr = audiogramData.pointSize_NR_L
    copyObj.targetThreshNR = audiogramData.thresh_NR_L
  }
  if (ear === 'L' && transducer === 'BC') {
    copyObj.sourceThresh = audiogramData.thresh_BC_L
    copyObj.sourcePsNr = audiogramData.pointSize_NR_L
    copyObj.sourceThreshNR = audiogramData.thresh_NR_L
    copyObj.targetThresh = audiogramData.thresh_BC_R
    copyObj.targetPsNr = audiogramData.pointSize_NR_R
    copyObj.targetThreshNR = audiogramData.thresh_NR_R
  }
  if (confirm(copyAlertMessage)) {
    //spread in the source arrays to the target arrays
    copyObj.targetThresh.splice(0, copyObj.targetThresh.length, ...copyObj.sourceThresh)
    copyObj.targetPS?.splice(0, copyObj.targetPS.length, ...copyObj.sourcePS)
    copyObj.targetPsNr.splice(0, copyObj.targetPsNr.length, ...copyObj.sourcePsNr)
    copyObj.targetThreshNR.splice(0, copyObj.targetThreshNR.length, ...copyObj.sourceThreshNR)
    copyObj.targetinterOctTested?.splice(0, copyObj.targetinterOctTested.length, ...copyObj.sourceInterOctTested)
  }
  if (ear === 'R' && transducer === 'AC') {
    audiogramData.symbols_L.forEach(function (part, index, theArray) {
      if (audiogramData.symbols_R[index] === 'triangle') {
        audiogramData.symbols_L[index] = 'rect';
      } else {
        audiogramData.symbols_L[index] = 'crossRot';
      }
    })
  }
  if (ear === 'L' && transducer === 'AC') {
    audiogramData.symbols_R.forEach(function (part, index, theArray) {
      if (audiogramData.symbols_L[index] === 'rect') {
        audiogramData.symbols_R[index] = 'triangle';
      } else {
        audiogramData.symbols_R[index] = 'circle';
      }
    })
  }
  if (ear === 'R' && transducer === 'BC') {
    audiogramData.symbols_BC_L.forEach(function (part, index, theArray) {
      if (audiogramData.symbols_BC_R[index] === BC_R_M) {
        audiogramData.symbols_BC_L[index] = BC_L_M;
      } else {
        audiogramData.symbols_BC_L[index] = BC_L;
      }
    })
  }
  if (ear === 'L' && transducer === 'BC') {
    audiogramData.symbols_BC_R.forEach(function (part, index, theArray) {
      if (audiogramData.symbols_BC_L[index] === BC_L_M) {
        audiogramData.symbols_BC_R[index] = BC_R_M;
      } else {
        audiogramData.symbols_BC_R[index] = BC_R;
      }
    })
  }
  updateCharts();
}

//fx used to handle freq between 250 and 500. Takes input and returns 375 interpolation if valid. The calling script does the splice.
function nonFreq(a, b, ear) {
  //AC branch
  if (transducer === 'AC') {
    if (ear === 'R') {
      if (a === null || b === null) {
        return null
      } else
        return (a + b) / 2;
    } else
      if (ear === 'L') {
        if (a === null || b === null) {
          return null
        } else
          return (a + b) / 2;
      }
  }
}

function toggleTransducer(input) {
  if (input === 1) {
    transducer = "AC";
    document.getElementById('AC button').className = "button_U";
    document.getElementById('BC button').className = "button_T";
  } else if (input === 2) {
    transducer = "BC";
    document.getElementById('BC button').className = "button_U";
    document.getElementById('AC button').className = "button_T";
  } else if (input === '') {
    transducer = ''
  }
}

function setMask(index, ear, transducer) {
  if (ear === 'R' && transducer === "AC") {
    if (audiogramData.symbols_R[index] === 'circle') {
      audiogramData.symbols_R.splice(index, 1, 'triangle');
    } else {
      audiogramData.symbols_R.splice(index, 1, 'circle');
    }
  } else if (ear === 'L' && transducer === 'AC') {
    if (audiogramData.symbols_L[index] === 'crossRot') {
      audiogramData.symbols_L.splice(index, 1, 'rect');
    } else {
      audiogramData.symbols_L.splice(index, 1, 'crossRot');
    }
  } else if (ear === 'R' && transducer === 'BC') {
    if (audiogramData.symbols_BC_R[index] === BC_R) {
      audiogramData.symbols_BC_R.splice(index, 1, BC_R_M);
    } else {
      audiogramData.symbols_BC_R.splice(index, 1, BC_R);
    }
  } else if (ear === 'L' && transducer === 'BC') {
    if (audiogramData.symbols_BC_L[index] === BC_L) {
      audiogramData.symbols_BC_L.splice(index, 1, BC_L_M);
    } else {
      audiogramData.symbols_BC_L.splice(index, 1, BC_L);
    }
  }
  updateCharts();
}
//used for toggling old threshold curve and or for ghost ears
function toggleData() {

  const showValue = myChart.isDatasetVisible(5);

  if (showValue === true) {
    myChart.hide(5);
    myChart2.hide(5);
    myChart.show(6);
    myChart2.show(6);
    document.getElementById('Toggle').innerText = 'Show: Ghost';
    previousLegend.style.display = "table-row"
  }
  if (showValue === false) {
    myChart.hide(6);
    myChart2.hide(6);
    myChart.show(5);
    myChart2.show(5);
    document.getElementById('Toggle').innerText = 'Show: Previous';
    previousLegend.style.display = "none"
  }
}

function calcChangeOnLoad() {

  for (let i = 0; i < audiogramData.thresh_AC_R.length; i++) {
    calcChange(i, 'R')
  }
  for (let i = 0; i < audiogramData.thresh_AC_L.length; i++) {
    calcChange(i, 'L')
  }
}

calcChangeOnLoad();

function reduceOldPointSizes() {

  for (let i = 0; i < oldAudiogramData.pointSize_AC_R.length; i++) {
    if (oldAudiogramData.pointSize_AC_R[i] === null) { } else {
      oldAudiogramData.pointSize_AC_R.splice(i, 1, 2)
    }
  }
  for (let i = 0; i < oldAudiogramData.pointSize_AC_L.length; i++) {
    if (oldAudiogramData.pointSize_AC_L[i] === null) { } else {
      oldAudiogramData.pointSize_AC_L.splice(i, 1, 2)
    }
  }
}

reduceOldPointSizes();

function calcPTA(array) {

  if (array[3] === null || array[5] === null || array[7] === null) { } else
    return (array[3] + array[5] + array[7]) / 3;
}

let annotatePTAprefFlag = 'off';

function annotatePTA(flagControl) {

  const buttonOn = document.getElementById('annotatePTAon');
  const buttonOff = document.getElementById('annotatePTAoff');
  //first part adjusts the flag to control if the second part happens or not
  if (flagControl === 'off') {
    annotatePTAprefFlag = 'off';
    buttonOn.removeAttribute('class');
    buttonOff.removeAttribute('class');
    myChart.options.plugins.annotation.annotations.linePTA.yMin = 0;
    myChart.options.plugins.annotation.annotations.linePTA.yMax = 0;
    myChart.options.plugins.annotation.annotations.linePTA.borderWidth = 0;
    myChart2.options.plugins.annotation.annotations.linePTA.yMin = 0;
    myChart2.options.plugins.annotation.annotations.linePTA.yMax = 0;
    myChart2.options.plugins.annotation.annotations.linePTA.borderWidth = 0;
    updateCharts();
    buttonOn.classList.add('toggle-button-disabled');
    buttonOff.classList.add('toggle-button-enabled');
    return
  }

  buttonOn.removeAttribute('class');
  buttonOff.removeAttribute('class');
  if (flagControl === 'on' || annotatePTAprefFlag === 'on') {
    annotatePTAprefFlag = 'on';
    buttonOn.classList.add('toggle-button-enabled');
    buttonOff.classList.add('toggle-button-disabled');
  }

  if (annotatePTAprefFlag === 'off') {
    buttonOn.classList.add('toggle-button-disabled');
    buttonOff.classList.add('toggle-button-enabled');
    return
  }

  let valueR;
  let valueL;
  let lineR = 4;
  let lineL = 4;

  if (audiogramData.PTA_R === undefined) {
    valueR = 0;
    lineR = 0
  } else {
    valueR = audiogramData.PTA_R
  }
  if (audiogramData.PTA_L === undefined) {
    valueL = 0;
    lineL = 0
  } else {
    valueL = audiogramData.PTA_L
  }

  myChart.options.plugins.annotation.annotations.linePTA.yMin = valueR;
  myChart.options.plugins.annotation.annotations.linePTA.yMax = valueR;
  myChart.options.plugins.annotation.annotations.linePTA.borderWidth = lineR;
  myChart2.options.plugins.annotation.annotations.linePTA.yMin = valueL;
  myChart2.options.plugins.annotation.annotations.linePTA.yMax = valueL;
  myChart2.options.plugins.annotation.annotations.linePTA.borderWidth = lineL;
  updateCharts();
}


function LMH(array) {
  let lowMidHigh = [null, null, null];
  if (array[1] === null || array[3] === null) {
    lowMidHigh.splice(0, 1, null)
  } else {
    lowMidHigh.splice(0, 1, (array[1] + array[3]) / 2)
  }

  if (array[5] === null || array[7] === null) {
    lowMidHigh.splice(1, 1, null)
  } else {
    lowMidHigh.splice(1, 1, (array[5] + array[7]) / 2)
  }

  if (array[9] === null || array[11] === null) {
    lowMidHigh.splice(2, 1, null)
  } else {
    lowMidHigh.splice(2, 1, (array[9] + array[11]) / 2)
  }
  return lowMidHigh;
}

function changeResolution(ear) {

  if (ear === 'R') {

    const PTAchange = calcPTA(audiogramData.change_R);

    if (changeResolution_R === 'full') {

      const lowMidHigh = LMH(audiogramData.change_R);

      myChart3.config.data.datasets[0].data = lowMidHigh;
      myChart3.config.data.labels = ["Low", "Mid", "High"];
      changeResolution_R = 'lowMidHigh';
      myChart3.update();
      return;

    }

    if (changeResolution_R === 'lowMidHigh') {

      changePTA_R.splice(0, 1, Math.trunc(PTAchange));
      if (isNaN(changePTA_R[0])) {
        changePTA_R.splice(0, 1, null)
      }
      myChart3.config.data.datasets[0].data = changePTA_R;
      myChart3.config.data.labels = ["PTA"];
      changeResolution_R = 'PTA';
      myChart3.update();
      return;
    }

    if (changeResolution_R === 'PTA') {

      myChart3.config.data.datasets[0].data = audiogramData.change_R;
      myChart3.config.data.labels = lilHz;
      changeResolution_R = 'full';
      myChart3.update();
      return;
    }

  }

  if (ear === 'L') {

    const PTAchange = calcPTA(audiogramData.change_L);


    if (changeResolution_L === 'full') {

      const lowMidHigh = LMH(audiogramData.change_L);

      myChart4.config.data.datasets[0].data = lowMidHigh;
      myChart4.config.data.labels = ["Low", "Mid", "High"];

      changeResolution_L = 'lowMidHigh';

      myChart4.update();
      return;

    }

    if (changeResolution_L === 'lowMidHigh') {

      changePTA_L.splice(0, 1, Math.trunc(PTAchange));
      if (isNaN(changePTA_L[0])) {
        changePTA_L.splice(0, 1, null)
      }
      myChart4.config.data.datasets[0].data = changePTA_L;
      myChart4.config.data.labels = ["PTA"];
      changeResolution_L = 'PTA';
      myChart4.update();
      return;
    }

    if (changeResolution_L === 'PTA') {

      myChart4.config.data.datasets[0].data = audiogramData.change_L;
      myChart4.config.data.labels = lilHz;
      changeResolution_L = 'full';
      myChart4.update();
      return;
    }
  }
}

audiogramData.PTA_R = calcPTA(audiogramData.thresh_AC_R);
audiogramData.PTA_L = calcPTA(audiogramData.thresh_AC_L);

oldAudiogramData.PTA_R = calcPTA(oldAudiogramData.thresh_AC_R);
oldAudiogramData.PTA_L = calcPTA(oldAudiogramData.thresh_AC_L);


function turnOffCrosshair() {
  myChart.options.plugins.crosshair = false;
  myChart2.options.plugins.crosshair = false;
  updateCharts();
}

function fillInLegendPrevDate() {
  if (oldAudiogramData.DateOfTest === null || oldAudiogramData.DateOfTest === "") {
    return
  }
  previousLegend.style.display = "table-row";
  previous_dateContent.innerText = oldAudiogramData.DateOfTest;

}

function fillInLegend() {

  //stops function if legend is full. 
  if (audiogramData.legend.ACunmasked === "show" && audiogramData.legend.ACmasked === "show" && audiogramData.legend.BCunmasked === "show" && audiogramData.legend.BCmasked === "show" && audiogramData.legend.NR === "show") {
    return
  }

  if (audiogramData.legend.ACunmasked !== "show") {
    //set legend table rows to show if the category has been tested. 
    const any_R_AC = audiogramData.thresh_AC_R.filter(thresh => thresh !== null);
    const any_L_AC = audiogramData.thresh_AC_L.filter(thresh => thresh !== null);

    if (any_R_AC.length > 0 || any_L_AC.length > 0) {
      audiogramData.legend.ACunmasked = "show";
      ACnormal.style.display = "table-row"
    }
  }
  if (audiogramData.legend.ACmasked !== "show") {
    const any_RmaskedAC = audiogramData.symbols_R.filter(symbol => symbol === 'triangle');
    const any_LmaskedAC = audiogramData.symbols_L.filter(symbol => symbol === 'rect');

    if (any_RmaskedAC.length > 0 || any_LmaskedAC.length > 0) {
      audiogramData.legend.ACmasked = "show";
      ACmasked.style.display = "table-row"
    }
  }
  if (audiogramData.legend.BCunmasked !== "show") {
    const any_R_BC = audiogramData.thresh_BC_R.filter(thresh => thresh !== null);
    const any_L_BC = audiogramData.thresh_BC_L.filter(thresh => thresh !== null);

    if (any_L_BC.length > 0 || any_R_BC.length > 0) {
      audiogramData.legend.BCunmasked = "show";
      BCnormal.style.display = "table-row"
    }
  }
  if (audiogramData.legend.BCmasked !== "show") {
    const any_RmaskedBC = audiogramData.symbols_BC_R.filter(symbol => symbol === BC_R_M);
    const any_LmaskedBC = audiogramData.symbols_BC_L.filter(symbol => symbol === BC_L_M);

    if (any_RmaskedBC.length > 0 || any_LmaskedBC.length > 0) {
      audiogramData.legend.BCmasked = "show";
      BCmasked.style.display = "table-row"
    }
  }
  if (audiogramData.legend.NR !== "show") {
    const any_R_NR = audiogramData.thresh_NR_R.filter(thresh => thresh !== null);
    const any_L_NR = audiogramData.thresh_NR_L.filter(thresh => thresh !== null);

    if (any_L_NR.length > 0 || any_R_NR.length > 0) {
      audiogramData.legend.NR = "show";
      NR.style.display = "table-row"
    }

    const any_R_BC_NR = audiogramData.pointSize_NR_BC_R.filter(thresh => thresh === 10);
    const any_L_BC_NR = audiogramData.pointSize_NR_BC_L.filter(thresh => thresh === 10);

    if (any_R_BC_NR.length > 0 || any_L_BC_NR.length > 0) {
      audiogramData.legend.NR = "show";
      NR.style.display = "table-row"
    }
  }
}


const maskingNorms = {
  insert: [],
  circumaural: [],
  supraaural: []

}

window.onload = () => {
  toggleTransducer(1);
  toggleData(5);
  toggleData(6);
  fillInLegendPrevDate();
};

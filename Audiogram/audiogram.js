
const changePTA_R = [null];
const changePTA_L = [null];

const symbols_BCmask_FMP_L = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const symbols_BC_L = [];

const symbols_BCmask_FMP_R = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const symbols_BC_R = [];

const symbols_L = ['crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot', 'crossRot'];

const symbols_R = ['circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'circle'];

let audiogramData = {

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
  interOctTested_AC_R: [0, 0, 0, 0],
  interOctTested_AC_L: [0, 0, 0, 0],
  pointSize_AC_R: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 0, 10],
  pointSize_AC_L: [10, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_hover_AC_R: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_hover_AC_L: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_NR_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  maskAll_AC_R_L_BC_R_L: [0, 0, 0, 0]
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
  interOctTested_AC_R: [0, 1, 1, 1],
  interOctTested_AC_L: [0, 0, 0, 0],
  pointSize_AC_R: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 0, 10],
  pointSize_AC_L: [10, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_hover_AC_R: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_hover_AC_L: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_NR_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  maskAll_AC_R_L_BC_R_L: [0, 0, 0, 0],
  DateOfTest: null
};

const bigHz = [125, 250, '', 500, '', 1000, '', 2000, '', 4000, '', 8000];
const lilHz = ['', 250, '', 500, '', 1000, '', 2000, '', 4000, '', 8000];

const barColors_R = ['rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)'];
const barColors_L = ['rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.2)'];

const fill_on = {
  above: 'rgba(0,0,0,0)',
  below: 'rgba(0,0,0,0.1)',
  target: {
    value: 25
  }
};

const fill_off = {
  above: 'rgba(0,0,0,0)',
  below: 'rgba(0,0,0,0)',
  target: {
    value: 25
  }
};

const fill_between = {
  above: 'rgba(0,0,0,0)',
  below: 'rgba(0,0,0,0)',
  target: {
    value: 25
  }
};

let fillToggle = 0;

function HideShade1() {
  if (fillToggle === 0) {
    myChart.config.data.datasets[0].fill = fill_off;
    myChart2.config.data.datasets[0].fill = fill_off;
    fillToggle = 1;
    document.getElementById('HideShade1').innerText = 'Shade Loss';
  } else if (fillToggle === 1) {
    myChart.config.data.datasets[0].fill = fill_on;
    myChart2.config.data.datasets[0].fill = fill_on;
    fillToggle = 0;
    document.getElementById('HideShade1').innerText = 'Hide Shade';
  }
  myChart.update();
  myChart2.update();
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

function toggleCrosshair() {

  if (crosshairFlag === "on") {
    myChart.config.options.plugins.crosshair = false;
    myChart.update();
    myChart2.config.options.plugins.crosshair = false;
    myChart2.update();
    myChart3.config.options.plugins.crosshair = false;
    myChart3.update();
    myChart4.config.options.plugins.crosshair = false;
    myChart4.update();
    crosshairFlag = "off";

    console.log(myChart.config.options.plugins.crosshair);
  } else {
    myChart.config.options.plugins.crosshair = crosshairOptions.audioRight;
    myChart.update();
    myChart2.config.options.plugins.crosshair = crosshairOptions.audioLeft;
    myChart2.update();
    myChart3.config.options.plugins.crosshair = crosshairOptions.barRight;
    myChart3.update();
    myChart4.config.options.plugins.crosshair = crosshairOptions.barLeft;
    myChart4.update();
    crosshairFlag = "on";
  }

}

//raw options for left ear audio crosshair
/* {
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
      }, */



function calcChange(index, ear) {

  let threshOld = '';
  let threshNew = '';
  let change = '';
  let newNR = '';
  let oldNR = '';
  let ioTestNew = '';
  let ioTestOld = '';
  let barColors = '';
  let color1 = '';
  let color2 = '';
  let color3 = '';
  let color4 = '';

  if (ear === 'R') {
    threshNew = audiogramData.thresh_AC_R[index];
    threshOld = oldAudiogramData.thresh_AC_R[index];
    change = audiogramData.change_R;
    newNR = audiogramData.thresh_NR_R[index];
    oldNR = oldAudiogramData.thresh_NR_R[index];
    ioTestNew = audiogramData.interOctTested_AC_R;
    ioTestOld = oldAudiogramData.interOctTested_AC_R;
    barColors = barColors_R;
    color1 = 'rgba(255, 0, 0, 0.05)';
    color2 = 'rgba(255, 0, 0, 0.10)';
    color3 = 'rgba(255, 0, 0, 0.20)';
    color4 = 'rgba(255, 0, 0, 0.40)';

  } else {

    threshNew = audiogramData.thresh_AC_L[index];
    threshOld = oldAudiogramData.thresh_AC_L[index];
    change = audiogramData.change_L;
    newNR = audiogramData.thresh_NR_L[index];
    oldNR = oldAudiogramData.thresh_NR_L[index];
    ioTestNew = audiogramData.interOctTested_AC_L;
    ioTestOld = oldAudiogramData.interOctTested_AC_L;
    barColors = barColors_L;
    color1 = 'rgba(0, 0, 255, 0.01)';
    color2 = 'rgba(0, 0, 255, 0.10)';
    color3 = 'rgba(0, 0, 255, 0.20)';
    color4 = 'rgba(0, 0, 255, 0.40)';
  }

  if (threshNew === null || threshOld === null || newNR !== null || oldNR !== null) {} else {
    change.splice(index, 1, threshOld - threshNew);
    change.splice(2, 1, null);
    if (ioTestNew[0] == 0 || ioTestOld[0] == 0) {
      change.splice(4, 1, null)
    };
    if (ioTestNew[1] == 0 || ioTestOld[1] == 0) {
      change.splice(6, 1, null)
    };
    if (ioTestNew[2] == 0 || ioTestOld[2] == 0) {
      change.splice(8, 1, null)
    };
    if (ioTestNew[3] == 0 || ioTestOld[3] == 0) {
      change.splice(10, 1, null)
    };


    if (Math.abs(threshOld - threshNew) < 10) {
      barColors.splice(index, 1, color1)
    } else
    if (Math.abs(threshOld - threshNew) > 9 && Math.abs(threshOld - threshNew) < 20) {
      barColors.splice(index, 1, color2)
    } else
    if (Math.abs(threshOld - threshNew) > 19 && Math.abs(threshOld - threshNew) < 30) {
      barColors.splice(index, 1, color3)
    } else
    if (Math.abs(threshOld - threshNew) > 29) {
      barColors.splice(index, 1, color4)
    };

    myChart3.update();
    myChart4.update();
  }
}



var transducer = 'AC';
//----sets AC BC toggle to AC when load. 

symbols_BCmask_FMP_R.map(BC_R_converter);
symbols_BCmask_FMP_L.map(BC_L_converter);

function BC_R_converter(item) {
  if (item === 1) {
    symbols_BC_R.push(BC_R_M)
  } else {
    symbols_BC_R.push(BC_R)
  }
}

function BC_L_converter(item) {
  if (item === 1) {
    symbols_BC_L.push(BC_L_M)
  } else {
    symbols_BC_L.push(BC_L)
  }
}

function pushSymbolsAtSave() {
  /*   FileMaker.PerformScriptWithOption('pushJSON_audiogramData', JSON.stringify(audiogramData), '0');
    FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_R', JSON.stringify(symbols_R) + ';', '0');
    FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_L', JSON.stringify(symbols_L) + ';', '0');
    FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_arrayOnly_R', JSON.stringify(symbols_R), '0');
    FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_arrayOnly_L', JSON.stringify(symbols_L), '0');
    FileMaker.PerformScriptWithOption('pushJSON_BC_Symbols_arrayOnly_R', JSON.stringify(symbols_BCmask_FMP_R), '0');
    FileMaker.PerformScriptWithOption('pushJSON_BC_Symbols_arrayOnly_L', JSON.stringify(symbols_BCmask_FMP_L), '0'); */
}

pushSymbolsAtSave();

//-----------------------------------this is the main function

function moveIt(freqIndex, dB, ear) {

  if (ear === 'R' && transducer === 'AC') {
    audiogramData.thresh_NR_R.splice(freqIndex, 1, null);
    audiogramData.pointSize_NR_R.splice(freqIndex, 1, null);
    audiogramData.thresh_AC_R.splice(freqIndex, 1, dB);
    audiogramData.thresh_AC_R.splice(2, 1, nonFreq(audiogramData.thresh_AC_R[1], audiogramData.thresh_AC_R[3], 'R'));
    //---markInterOct (freqIndex, ear, dB);
    calcInterOct(freqIndex, dB, 'R');
    //---duplicate fx call just to update the pointsize for deleted interoct
    //calcInterOct();
    calcChange(freqIndex, 'R');
    pushSymbolsAtSave();
    //FileMaker.PerformScriptWithOption('Populate_FMP_AC_R', '', '0');


  } else
  if (ear === 'R' && transducer === 'BC') {
    audiogramData.thresh_NR_BC_R.splice(freqIndex, 1, null);
    audiogramData.pointSize_NR_BC_R.splice(freqIndex, 1, null);
    audiogramData.thresh_BC_R.splice(freqIndex, 1, dB);
    pushSymbolsAtSave();
    //FileMaker.PerformScriptWithOption('Populate_FMP_BC_R', '', '0');

  }
  if (ear === 'L' && transducer === 'AC') {
    audiogramData.thresh_NR_L.splice(freqIndex, 1, null);
    audiogramData.pointSize_NR_L.splice(freqIndex, 1, null);
    audiogramData.thresh_AC_L.splice(freqIndex, 1, dB);
    audiogramData.thresh_AC_L.splice(2, 1, nonFreq(audiogramData.thresh_AC_L[1], audiogramData.thresh_AC_L[3], 'L'));
    calcInterOct(freqIndex, dB, 'L');
    calcInterOct();
    calcChange(freqIndex, 'L');
    pushSymbolsAtSave();
    //FileMaker.PerformScriptWithOption('Populate_FMP_AC_L', '', '0');
  } else
  if (ear === 'L' && transducer === 'BC') {
    audiogramData.thresh_NR_BC_L.splice(freqIndex, 1, null);
    audiogramData.pointSize_NR_BC_L.splice(freqIndex, 1, null);
    audiogramData.thresh_BC_L.splice(freqIndex, 1, dB);
    pushSymbolsAtSave();
    // FileMaker.PerformScriptWithOption('Populate_FMP_BC_L', '', '0');

  }
  myChart.update();
  myChart2.update();

  myChart3.update();
  myChart4.update();
  // FileMaker.PerformScriptWithOption('pushJSON_BC_Symbols_R_numeric', "const symbols_BCmask_FMP_R = " + JSON.stringify(symbols_BCmask_FMP_R) + ";", '0');
  // FileMaker.PerformScriptWithOption('pushJSON_BC_Symbols_L_numeric', "const symbols_BCmask_FMP_L = " + JSON.stringify(symbols_BCmask_FMP_L) + ";", '0');

  audiogramData.PTA_R = calcPTA(audiogramData.thresh_AC_R);
  audiogramData.PTA_L = calcPTA(audiogramData.thresh_AC_L);
  //  FileMaker.PerformScriptWithOption('pushJSON_PTA_R', Math.round(audiogramData.PTA_R), '0');
  //  FileMaker.PerformScriptWithOption('pushJSON_PTA_L', Math.round(audiogramData.PTA_L), '0');

}


function setNR(index, ear, transducer) {

  var thresh = ear === 'R' ? audiogramData.thresh_AC_R : audiogramData.thresh_AC_L;
  var thresh_BC = ear === 'R' ? audiogramData.thresh_BC_R : audiogramData.thresh_BC_L;
  var old_dB = ear === 'R' ? audiogramData.thresh_AC_R[index] : audiogramData.thresh_AC_L[index];
  var NR = ear === 'R' ? audiogramData.thresh_NR_R : audiogramData.thresh_NR_L;
  var size = ear === 'R' ? audiogramData.pointSize_NR_R : audiogramData.pointSize_NR_L;
  var size_BC = ear === 'R' ? audiogramData.pointSize_NR_BC_R : audiogramData.pointSize_NR_BC_L;
  var changeNR = ear === 'R' ? audiogramData.change_R : audiogramData.change_L;

  if (old_dB !== null && transducer === "AC") {
    NR.splice(index, 1, old_dB);
    size.splice(index, 1, 10);
    thresh.splice(index, 1, null);
    thresh.splice(2, 1, nonFreq(thresh[1], thresh[3], ear));
    calcInterOct(index, dB, ear);
    changeNR.splice(index, 1, null);
  } else if (transducer === "BC") {
    size_BC.splice(index, 1, 10);
  }
  myChart.update();
  myChart2.update();
  myChart3.update();
  myChart4.update();
  /*   FileMaker.PerformScriptWithOption('pushJSON_audiogramData', JSON.stringify(audiogramData), '0');
    FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_R', JSON.stringify(symbols_R) + ';', '0');
    FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_L', JSON.stringify(symbols_L) + ';', '0');
    FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_arrayOnly_R', JSON.stringify(symbols_R), '0');
    FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_arrayOnly_L', JSON.stringify(symbols_L), '0');
    FileMaker.PerformScriptWithOption('pushJSON_BC_Symbols_arrayOnly_R', JSON.stringify(symbols_BCmask_FMP_R), '0');
    FileMaker.PerformScriptWithOption('pushJSON_BC_Symbols_arrayOnly_L', JSON.stringify(symbols_BCmask_FMP_L), '0'); */

  pushSymbolsAtSave();
  // FileMaker.PerformScriptWithOption('Populate_FMP_Fields_fromJSON', '', '0');

}

const options_R = {
  type: 'line',
  data: {
    labels: bigHz,
    datasets: [{
        label: 'AC_R',
        data: audiogramData.thresh_AC_R,
        borderWidth: 1,
        pointStyle: symbols_R,
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
        pointStyle: symbols_BC_R,
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
        pointStyle: symbols_R,
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
        pointStyle: symbols_L,
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
          box1: {
            type: 'box',
            yMin: 0,
            yMax: 25,
            xMin: 1,
            backgroundColor: "rgba(230, 255, 110, 0.1)",
            borderColor: 'gray',
            borderWidth: 0,
            drawTime: 'beforeDatasetsDraw',
            label: {
              enabled: false,
              content: 'Austin',
            }
          }
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
        pointStyle: symbols_L,
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
        pointStyle: symbols_BC_L,
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
        pointStyle: symbols_L,
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
        pointStyle: symbols_R,
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
          box1: {
            type: 'box',
            yMin: 0,
            yMax: 25,
            xMin: 1,
            backgroundColor: "rgba(230, 255, 110, 0.1)",
            borderColor: 'gray',
            borderWidth: 0,
            drawTime: 'beforeDatasetsDraw',
            label: {
              enabled: false,
              content: 'Austin',
            }

          }
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
  }
};


const options_bar_R = {
  type: 'bar',
  data: {
    labels: lilHz,
    datasets: [{
      label: 'R Change',
      data: audiogramData.change_R,
      borderWidth: 0.2,
      backgroundColor: barColors_R,
      borderColor: 'gray',
    }]
  },
  plugins: [ChartDataLabels],
  options: {
    responsive: false,
    plugins: {
      datalabels: {
        color: 'red',
        formatter: function(value, context) {
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
        position: 'bottom',
        padding: 5,
        text: 'Change R'
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
          display: false
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
    responsive: false,
    plugins: {
      datalabels: {
        color: 'blue',
        formatter: function(value, context) {
          var i = context.dataIndex;
          var direction = context.dataset.data[i];
          var glyph = direction > 0 ? '▲' : direction < 0 ? '▼' : '=';
          return (value === null ? '' : glyph + ' ' + Math.abs(value))
        },
        align: function(context) {
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
          display: false
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
  }
};

const ctx = document.getElementById('audiogram_R').getContext('2d');
const myChart = new Chart(ctx, options_R);

const ctx2 = document.getElementById('audiogram_L').getContext('2d');
const myChart2 = new Chart(ctx2, options_L);

const ctx3 = document.getElementById('change_R').getContext('2d');
const myChart3 = new Chart(ctx3, options_bar_R);

const ctx4 = document.getElementById('change_L').getContext('2d');
const myChart4 = new Chart(ctx4, options_bar_L);

function getMousePos(audiogram_R, event) {
  var rect = audiogram_R.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

const freqLocations = [62, 84, 109, 133, 158, 181, 205, 229, 254, 279, 302, 326];

const dBlocations = [27, 39, 49, 61, 72, 82, 94, 106, 117, 127, 138, 150, 160, 172, 183, 194, 205, 216, 226, 238, 249, 261, 271, 283, 293, 304, 315];

//intialising for later. not sure if its needed.
var olddB = '';

change_R.addEventListener('click', function(evt) {
  changeResolution('R');
})

audiogram_R.addEventListener('click', function(evt) {
  var mousePos = getMousePos(audiogram_R, evt);

  function closestFreq(num, arr) {
    var mid;
    var lo = 0;
    var hi = arr.length - 1;
    while (hi - lo > 1) {
      mid = Math.floor((lo + hi) / 2);
      if (arr[mid] < num) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    if (num - arr[lo] <= arr[hi] - num) {
      return arr[lo];
    }
    return arr[hi];
  }

  var freqFind = closestFreq(mousePos.x, freqLocations);
  var freqIndex = freqLocations.indexOf(freqFind);

  function closestdB(num, arr) {
    var mid;
    var lo = 0;
    var hi = arr.length - 1;
    while (hi - lo > 1) {
      mid = Math.floor((lo + hi) / 2);
      if (arr[mid] < num) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    if (num - arr[lo] <= arr[hi] - num) {
      return arr[lo];
    }
    return arr[hi];
  }

  function getdB() {
    //return thresh_AC_R[freqIndex]
    return (transducer === 'AC' ? audiogramData.thresh_AC_R[freqIndex] : audiogramData.thresh_BC_R[freqIndex]);
  }

  olddB = getdB();
  var dBfind = closestdB(mousePos.y, dBlocations);
  var dBindex = dBlocations.indexOf(dBfind);

  function setdB() {
    dB = (dBindex * 5) - 10;
    //handles weird case where the threshold you want to enter is exactly at the avg of the neighbor freq thresholds. For interoctaves only in the untested state. If tested it erases dB as expected.  
    if (dB === olddB && transducer === 'AC' && freqIndex === 4 && audiogramData.interOctTested_AC_R[0] === 0 || freqIndex === 6 && audiogramData.interOctTested_AC_R[1] === 0 || freqIndex === 8 && audiogramData.interOctTested_AC_R[2] === 0 || freqIndex === 10 && audiogramData.interOctTested_AC_R[3] === 0) {} else if (dB === olddB) {
      dB = null
    }
  }

  setdB(dBindex);

  if (dB === undefined || freqIndex === 2 || mousePos.y < 22 || mousePos.y > 320 || mousePos.x > 328 || mousePos.x < 57) {} else

  if (transducer === 'AC') {
    moveIt(freqIndex, dB, 'R');

  } else if (transducer === 'BC') {
    moveIt(freqIndex, dB, 'R');
  }
});

audiogram_L.addEventListener('click', function(evt) {
  var mousePos = getMousePos(audiogram_L, evt);

  function closestFreq(num, arr) {
    var mid;
    var lo = 0;
    var hi = arr.length - 1;
    while (hi - lo > 1) {
      mid = Math.floor((lo + hi) / 2);
      if (arr[mid] < num) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    if (num - arr[lo] <= arr[hi] - num) {
      return arr[lo];
    }
    return arr[hi];
  }

  var freqFind = closestFreq(mousePos.x, freqLocations);
  var freqIndex = freqLocations.indexOf(freqFind);

  function closestdB(num, arr) {
    var mid;
    var lo = 0;
    var hi = arr.length - 1;
    while (hi - lo > 1) {
      mid = Math.floor((lo + hi) / 2);
      if (arr[mid] < num) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    if (num - arr[lo] <= arr[hi] - num) {
      return arr[lo];
    }
    return arr[hi];
  }

  function getdB() {
    //return thresh_AC_R[freqIndex]
    return (transducer === 'AC' ? audiogramData.thresh_AC_L[freqIndex] : audiogramData.thresh_BC_L[freqIndex]);
  }

  olddB = getdB();
  var dBfind = closestdB(mousePos.y, dBlocations);
  var dBindex = dBlocations.indexOf(dBfind);

  function setdB() {
    dB = (dBindex * 5) - 10;
    //handles weird case where the threshold you want to enter is exactly at the avg of the neighbor freq thresholds. For interoctaves only in the untested state. If tested it erases dB as expected.  
    if (dB === olddB && transducer === 'AC' && freqIndex === 4 && audiogramData.interOctTested_AC_L[0] === 0 || freqIndex === 6 && audiogramData.interOctTested_AC_L[1] === 0 || freqIndex === 8 && audiogramData.interOctTested_AC_L[2] === 0 || freqIndex === 10 && audiogramData.interOctTested_AC_L[3] === 0) {} else if (dB === olddB) {
      dB = null
    }
  }

  setdB(dBindex);

  if (dB === undefined || freqIndex === 2 || mousePos.y < 22 || mousePos.y > 320 || mousePos.x > 328 || mousePos.x < 57) {} else

  if (transducer === 'AC') {
    moveIt(freqIndex, dB, 'L');

  } else if (transducer === 'BC') {
    moveIt(freqIndex, dB, 'L');
  }
});


/* function drawButton(name, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = "black";
  ctx.fillRect(name.x, name.y, name.width, name.height);
  ctx.lineWidth = 4;
  //strokeRect(name.x, name.y, name.width, name.height);
} */

function download_image() {
  var canvas = document.getElementById("audiogram_R");
  var image = canvas.toDataURL("image/png");
  var link = document.createElement('a');
  var fileName = "Audiogram " + new Date().toLocaleTimeString();
  link.download = fileName + ".png";
  link.href = image;
  link.click();
}

function pushImage() {

  var image_R = myChart.toBase64Image();
  var image_L = myChart2.toBase64Image();

  /*   //FileMaker.PerformScriptWithOption(
      "pushAudioImage_R", image_R, "0"
    );
     // FileMaker.PerformScriptWithOption(
      "pushAudioImage_L", image_L, "0"
    ); */
}

function maskAll_AC(ear) {

  if (transducer === 'AC') {

    if (ear === 'R') {
      symbols_R.forEach(function(part, index, theArray) {
        if (audiogramData.maskAll_AC_R_L_BC_R_L[0] === 0) {
          symbols_R[index] = 'triangle';
        } else {
          symbols_R[index] = 'circle';
        }
      })
      if (audiogramData.maskAll_AC_R_L_BC_R_L[0] === 0) {
        audiogramData.maskAll_AC_R_L_BC_R_L.splice(0, 1, 1)
      } else {
        audiogramData.maskAll_AC_R_L_BC_R_L.splice(0, 1, 0);
      }
    } else if (ear === 'L') {
      symbols_L.forEach(function(part, index, theArray) {
        if (audiogramData.maskAll_AC_R_L_BC_R_L[1] === 0) {
          symbols_L[index] = 'rect';
        } else {
          symbols_L[index] = 'crossRot';
        }
      })
      if (audiogramData.maskAll_AC_R_L_BC_R_L[1] === 0) {
        audiogramData.maskAll_AC_R_L_BC_R_L.splice(1, 1, 1)
      } else {
        audiogramData.maskAll_AC_R_L_BC_R_L.splice(1, 1, 0);
      }
    }
  } else
  if (ear === 'R') {
    symbols_BC_R.forEach(function(part, index, theArray) {
      if (audiogramData.maskAll_AC_R_L_BC_R_L[2] === 0) {
        symbols_BC_R[index] = BC_R_M;
        symbols_BCmask_FMP_R[index] = 1;
      } else {
        symbols_BC_R[index] = BC_R;
        symbols_BCmask_FMP_R[index] = 0;
      }
    })
    if (audiogramData.maskAll_AC_R_L_BC_R_L[2] === 0) {
      audiogramData.maskAll_AC_R_L_BC_R_L.splice(2, 1, 1)
    } else {
      audiogramData.maskAll_AC_R_L_BC_R_L.splice(2, 1, 0);
    }
  } else if (ear === 'L') {
    symbols_BC_L.forEach(function(part, index, theArray) {
      if (audiogramData.maskAll_AC_R_L_BC_R_L[3] === 0) {
        symbols_BC_L[index] = BC_L;
        symbols_BCmask_FMP_L[index] = 0;
      } else {
        symbols_BC_L[index] = BC_L_M;
        symbols_BCmask_FMP_L[index] = 1;
      }
    })
    if (audiogramData.maskAll_AC_R_L_BC_R_L[3] === 0) {
      audiogramData.maskAll_AC_R_L_BC_R_L.splice(3, 1, 1);
    } else {
      audiogramData.maskAll_AC_R_L_BC_R_L.splice(3, 1, 0);
    }
  }

  myChart.update();
  myChart2.update();
  /*   FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_arrayOnly_R', JSON.stringify(symbols_R), '0');
    FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_arrayOnly_L', JSON.stringify(symbols_L), '0');
    FileMaker.PerformScriptWithOption('pushJSON_BC_Symbols_arrayOnly_R', JSON.stringify(symbols_BCmask_FMP_R), '0');
    FileMaker.PerformScriptWithOption('pushJSON_BC_Symbols_arrayOnly_L', JSON.stringify(symbols_BCmask_FMP_L), '0');
    FileMaker.PerformScriptWithOption('pushJSON_audiogramData', JSON.stringify(audiogramData), '0'); */
}


function copyEarAC(ear) {

  if (ear === 'R') {

    if (confirm('Are you sure you want to copy right AC to left AC?')) {

      audiogramData.thresh_AC_L.splice(0, audiogramData.thresh_AC_L.length, ...audiogramData.thresh_AC_R);
      audiogramData.pointSize_AC_L.splice(0, audiogramData.pointSize_AC_L.length, ...audiogramData.pointSize_AC_R);
      audiogramData.pointSize_NR_L.splice(0, audiogramData.pointSize_NR_L.length, ...audiogramData.pointSize_NR_R);
      audiogramData.thresh_NR_L.splice(0, audiogramData.thresh_NR_L.length, ...audiogramData.thresh_NR_R);
      audiogramData.interOctTested_AC_L.splice(0, audiogramData.interOctTested_AC_L.length, ...audiogramData.interOctTested_AC_R);
      myChart.update();
      myChart2.update();

    }
  } else

  {

    if (confirm('Are you sure you want to copy left AC to right AC?')) {

      audiogramData.thresh_AC_R.splice(0, audiogramData.thresh_AC_R.length, ...audiogramData.thresh_AC_L);
      audiogramData.pointSize_AC_R.splice(0, audiogramData.pointSize_AC_R.length, ...audiogramData.pointSize_AC_L);
      audiogramData.pointSize_NR_R.splice(0, audiogramData.pointSize_NR_R.length, ...audiogramData.pointSize_NR_L);
      audiogramData.thresh_NR_R.splice(0, audiogramData.thresh_NR_R.length, ...audiogramData.thresh_NR_L);
      audiogramData.interOctTested_AC_R.splice(0, audiogramData.interOctTested_AC_R.length, ...audiogramData.interOctTested_AC_L);
      myChart.update();
      myChart2.update();

    }
  }

  // FileMaker.PerformScriptWithOption('pushJSON_audiogramData', JSON.stringify(audiogramData), '0');

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
  } else
  if (transducer === 'BC') {
    if (ear === 'R') {
      if (a === null || b === null) {
        return null
      } else
      if (a === audiogramData.thresh_BC_R[1] && audiogramData.pointSize_NR_BC_R[1] === 10 || b === audiogramData.thresh_BC_R[3] && audiogramData.pointSize_NR_BC_R[3] === 10) {
        return null
      } else
        return (a + b) / 2;
    } else
    if (ear === 'L') {
      if (a === null || b === null) {
        return null
      } else
      if (a === audiogramData.thresh_BC_L[1] && audiogramData.pointSize_NR_BC_L[1] === 10 || b === audiogramData.thresh_BC_L[3] && audiogramData.pointSize_NR_BC_L[3] === 10) {
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
    if (symbols_R[index] === 'circle') {
      symbols_R.splice(index, 1, 'triangle');
    } else {
      symbols_R.splice(index, 1, 'circle');
    }
    myChart.update();
  } else if (ear === 'L' && transducer === 'AC') {
    if (symbols_L[index] === 'crossRot') {
      symbols_L.splice(index, 1, 'rect');
    } else {
      symbols_L.splice(index, 1, 'crossRot');
    }
    myChart2.update();
  } else if (ear === 'R' && transducer === 'BC') {
    if (symbols_BC_R[index] === BC_R) {
      symbols_BC_R.splice(index, 1, BC_R_M);
      symbols_BCmask_FMP_R.splice(index, 1, 1);
    } else {
      symbols_BC_R.splice(index, 1, BC_R);
      symbols_BCmask_FMP_R.splice(index, 1, 0);
    }
    myChart.update();
  } else if (ear === 'L' && transducer === 'BC') {
    if (symbols_BC_L[index] === BC_L) {
      symbols_BC_L.splice(index, 1, BC_L_M);
      symbols_BCmask_FMP_L.splice(index, 1, 1);
    } else {
      symbols_BC_L.splice(index, 1, BC_L);
      symbols_BCmask_FMP_L.splice(index, 1, 0);
    }
    myChart2.update();
  }

  /*   FileMaker.PerformScriptWithOption('pushJSON_audiogramData', JSON.stringify(audiogramData), '0');
    FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_R', JSON.stringify(symbols_R) + ';', '0');
    FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_L', JSON.stringify(symbols_L) + ';', '0');
    FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_arrayOnly_R', JSON.stringify(symbols_R), '0');
    FileMaker.PerformScriptWithOption('pushJSON_AC_Symbols_arrayOnly_L', JSON.stringify(symbols_L), '0');
    FileMaker.PerformScriptWithOption('pushJSON_BC_Symbols_arrayOnly_R', JSON.stringify(symbols_BCmask_FMP_R), '0');
    FileMaker.PerformScriptWithOption('pushJSON_BC_Symbols_arrayOnly_L', JSON.stringify(symbols_BCmask_FMP_L), '0');
    FileMaker.PerformScriptWithOption('pushJSON_BC_Symbols_R_numeric', "let symbols_BCmask_FMP_R = " + JSON.stringify(symbols_BCmask_FMP_R) + ";", '0');
    FileMaker.PerformScriptWithOption('pushJSON_BC_Symbols_L_numeric', "let symbols_BCmask_FMP_L = " + JSON.stringify(symbols_BCmask_FMP_L) + ";", '0'); */

}

function calcInterOct(index, dB, ear) {
  //grabs interoct tested var before it gets changed at the top (needed unchanged lower)
  var ioTest_R = audiogramData.interOctTested_AC_R;
  var ioTest_L = audiogramData.interOctTested_AC_L;

  if (transducer === 'AC') {
    //exits if interoct is tested. No need to calc. Sets pointsize to 10
    if (ear === 'R' && dB !== null && index === 4) {
      audiogramData.pointSize_AC_R.splice(index, 1, 10);
      audiogramData.pointSize_hover_AC_R.splice(index, 1, 15);
      audiogramData.interOctTested_AC_R.splice(0, 1, 1);
      return;
    }
    if (ear === 'R' && dB !== null && index === 6) {
      audiogramData.pointSize_AC_R.splice(index, 1, 10);
      audiogramData.pointSize_hover_AC_R.splice(index, 1, 15);
      audiogramData.interOctTested_AC_R.splice(1, 1, 1);
      return;
    }
    if (ear === 'R' && dB !== null && index === 8) {
      audiogramData.pointSize_AC_R.splice(index, 1, 10);
      audiogramData.pointSize_hover_AC_R.splice(index, 1, 15);
      audiogramData.interOctTested_AC_R.splice(2, 1, 1);
      return;
    }
    if (ear === 'R' && dB !== null && index === 10) {
      audiogramData.pointSize_AC_R.splice(index, 1, 10);
      audiogramData.pointSize_hover_AC_R.splice(index, 1, 15);
      audiogramData.interOctTested_AC_R.splice(3, 1, 1);
      return;
    }
    //omg
    if (ear === 'R' && dB === null && index === 4) {
      audiogramData.pointSize_AC_R.splice(index, 1, 10);
      audiogramData.pointSize_hover_AC_R.splice(index, 1, 15);
      audiogramData.interOctTested_AC_R.splice(0, 1, 0);
    }
    if (ear === 'R' && dB === null && index === 6) {
      audiogramData.pointSize_AC_R.splice(index, 1, 10);
      audiogramData.pointSize_hover_AC_R.splice(index, 1, 15);
      audiogramData.interOctTested_AC_R.splice(1, 1, 0);
    }
    if (ear === 'R' && dB === null && index === 8) {
      audiogramData.pointSize_AC_R.splice(index, 1, 10);
      audiogramData.pointSize_hover_AC_R.splice(index, 1, 15);
      audiogramData.interOctTested_AC_R.splice(2, 1, 0);
    }
    if (ear === 'R' && dB === null && index === 10) {
      audiogramData.pointSize_AC_R.splice(index, 1, 10);
      audiogramData.pointSize_hover_AC_R.splice(index, 1, 15);
      audiogramData.interOctTested_AC_R.splice(3, 1, 0);
    }

    if (ear === 'R' && index === 4 && dB === null || ioTest_R[0] === 0) {
      audiogramData.pointSize_AC_R.splice(index, 1, 10);

      audiogramData.pointSize_hover_AC_R.splice(index, 1, 15);
      audiogramData.interOctTested_AC_R.splice(0, 1, 0);
      if (audiogramData.thresh_AC_R[3] === null || audiogramData.thresh_AC_R[5] === null) {
        audiogramData.thresh_AC_R.splice(4, 1, null);
        audiogramData.interOctTested_AC_R.splice(0, 1, 0);
        audiogramData.pointSize_AC_R.splice(4, 1, null);
        audiogramData.pointSize_hover_AC_R.splice(4, 1, null);
      } else {
        audiogramData.thresh_AC_R.splice(4, 1, (((audiogramData.thresh_AC_R[3]) + audiogramData.thresh_AC_R[5]) / 2));
        audiogramData.interOctTested_AC_R.splice(0, 1, 0);
        audiogramData.pointSize_AC_R.splice(4, 1, null);
        audiogramData.pointSize_hover_AC_R.splice(4, 1, null);
      }

    }
    if (ear === 'R' && index === 6 && dB === null || ioTest_R[1] === 0) {
      audiogramData.pointSize_AC_R.splice(index, 1, 10);
      audiogramData.interOctTested_AC_R.splice(1, 1, 0);
      if (audiogramData.thresh_AC_R[5] === null || audiogramData.thresh_AC_R[7] === null) {
        audiogramData.thresh_AC_R.splice(6, 1, null);
        audiogramData.interOctTested_AC_R.splice(1, 1, 0);
        audiogramData.pointSize_AC_R.splice(6, 1, null);
        audiogramData.pointSize_hover_AC_R.splice(6, 1, null);
      } else {
        audiogramData.thresh_AC_R.splice(6, 1, (((audiogramData.thresh_AC_R[5]) + audiogramData.thresh_AC_R[7]) / 2));
        audiogramData.interOctTested_AC_R.splice(1, 1, 0);
        audiogramData.pointSize_AC_R.splice(6, 1, null);
        audiogramData.pointSize_hover_AC_R.splice(6, 1, null);
      }
    }
    if (ear === 'R' && index === 8 && dB === null || ioTest_R[2] === 0) {
      audiogramData.pointSize_AC_R.splice(index, 1, 10);
      audiogramData.interOctTested_AC_R.splice(2, 1, 0);
      audiogramData.pointSize_hover_AC_R.splice(8, 1, 15);

      if (audiogramData.thresh_AC_R[7] === null || audiogramData.thresh_AC_R[9] === null) {
        audiogramData.thresh_AC_R.splice(8, 1, null);
        audiogramData.interOctTested_AC_R.splice(2, 1, 0);
        audiogramData.pointSize_AC_R.splice(8, 1, null);
        audiogramData.pointSize_hover_AC_R.splice(8, 1, null);
      } else {
        audiogramData.thresh_AC_R.splice(8, 1, (((audiogramData.thresh_AC_R[7]) + audiogramData.thresh_AC_R[9]) / 2));
        audiogramData.interOctTested_AC_R.splice(2, 1, 0);
        audiogramData.pointSize_AC_R.splice(8, 1, null);
        audiogramData.pointSize_hover_AC_R.splice(8, 1, null);
      }
    }
    if (ear === 'R' && index === 10 && dB === null || ioTest_R[3] === 0) {
      audiogramData.pointSize_AC_R.splice(index, 1, 10);
      audiogramData.interOctTested_AC_R.splice(3, 1, 0);
      audiogramData.pointSize_hover_AC_R.splice(index, 1, 15);
      if (audiogramData.thresh_AC_R[9] === null || audiogramData.thresh_AC_R[11] === null) {
        audiogramData.thresh_AC_R.splice(10, 1, null);
        audiogramData.interOctTested_AC_R.splice(3, 1, 0);
        audiogramData.pointSize_AC_R.splice(10, 1, null);
        audiogramData.pointSize_hover_AC_R.splice(10, 1, null);
      } else {
        audiogramData.thresh_AC_R.splice(10, 1, (((audiogramData.thresh_AC_R[9]) + audiogramData.thresh_AC_R[11]) / 2));
        audiogramData.interOctTested_AC_R.splice(3, 1, 0);
        audiogramData.pointSize_AC_R.splice(10, 1, null);
        audiogramData.pointSize_hover_AC_R.splice(10, 1, null);
      }
    }

    //exits if interoct is tested. No need to calc. Sets pointsize to 10
    if (ear === 'L' && dB !== null && index === 4) {
      audiogramData.pointSize_AC_L.splice(index, 1, 10);
      audiogramData.interOctTested_AC_L.splice(0, 1, 1);
      audiogramData.pointSize_hover_AC_L.splice(index, 1, 15);
      return;
    }
    if (ear === 'L' && dB !== null && index === 6) {
      audiogramData.pointSize_AC_L.splice(index, 1, 10);
      audiogramData.interOctTested_AC_L.splice(1, 1, 1);
      audiogramData.pointSize_hover_AC_L.splice(index, 1, 15);
      return;
    }
    if (ear === 'L' && dB !== null && index === 8) {
      audiogramData.pointSize_AC_L.splice(index, 1, 10);
      audiogramData.interOctTested_AC_L.splice(2, 1, 1);
      audiogramData.pointSize_hover_AC_L.splice(index, 1, 15);
      return;
    }
    if (ear === 'L' && dB !== null && index === 10) {
      audiogramData.pointSize_AC_L.splice(index, 1, 10);
      audiogramData.interOctTested_AC_L.splice(3, 1, 1);
      audiogramData.pointSize_hover_AC_L.splice(index, 1, 15);
      return;
    }
    //omg
    if (ear === 'L' && dB === null && index === 4) {
      audiogramData.pointSize_AC_L.splice(index, 1, 10);
      audiogramData.interOctTested_AC_L.splice(0, 1, 0);
      audiogramData.pointSize_hover_AC_L.splice(index, 1, 15);
    }
    if (ear === 'L' && dB === null && index === 6) {
      audiogramData.pointSize_AC_L.splice(index, 1, 10);
      audiogramData.interOctTested_AC_L.splice(1, 1, 0);
      audiogramData.pointSize_hover_AC_L.splice(index, 1, 15);
    }
    if (ear === 'L' && dB === null && index === 8) {
      audiogramData.pointSize_AC_L.splice(index, 1, 10);
      audiogramData.interOctTested_AC_L.splice(2, 1, 0);
      audiogramData.pointSize_hover_AC_L.splice(index, 1, 15);
    }
    if (ear === 'L' && dB === null && index === 10) {
      audiogramData.pointSize_AC_L.splice(index, 1, 10);
      audiogramData.interOctTested_AC_L.splice(3, 1, 0);
      audiogramData.pointSize_hover_AC_L.splice(index, 1, 15);
    }

    if (ear === 'L' && index === 4 && dB === null || ioTest_L[0] === 0) {
      audiogramData.pointSize_AC_L.splice(index, 1, 10);
      audiogramData.interOctTested_AC_L.splice(0, 1, 0);
      audiogramData.pointSize_hover_AC_L.splice(index, 1, 15);
      if (audiogramData.thresh_AC_L[3] === null || audiogramData.thresh_AC_L[5] === null) {
        audiogramData.thresh_AC_L.splice(4, 1, null);
        audiogramData.interOctTested_AC_L.splice(0, 1, 0);
        audiogramData.pointSize_AC_L.splice(4, 1, null);
        audiogramData.pointSize_hover_AC_L.splice(4, 1, null);
      } else {
        audiogramData.thresh_AC_L.splice(4, 1, (((audiogramData.thresh_AC_L[3]) + audiogramData.thresh_AC_L[5]) / 2));
        audiogramData.interOctTested_AC_L.splice(0, 1, 0);
        audiogramData.pointSize_AC_L.splice(4, 1, null);
        audiogramData.pointSize_hover_AC_L.splice(4, 1, null);
      }
    }

    if (ear === 'L' && index === 6 && dB === null || ioTest_L[1] === 0) {
      audiogramData.pointSize_AC_L.splice(index, 1, 10);
      audiogramData.interOctTested_AC_L.splice(1, 1, 0);
      if (audiogramData.thresh_AC_L[5] === null || audiogramData.thresh_AC_L[7] === null) {
        audiogramData.thresh_AC_L.splice(6, 1, null);
        audiogramData.interOctTested_AC_L.splice(1, 1, 0);
        audiogramData.pointSize_AC_L.splice(6, 1, null);
        audiogramData.pointSize_hover_AC_L.splice(6, 1, null);
      } else {
        audiogramData.thresh_AC_L.splice(6, 1, (((audiogramData.thresh_AC_L[5]) + audiogramData.thresh_AC_L[7]) / 2));
        audiogramData.interOctTested_AC_L.splice(1, 1, 0);
        audiogramData.pointSize_AC_L.splice(6, 1, null);
        audiogramData.pointSize_hover_AC_L.splice(6, 1, null);
      }
    }
    if (ear === 'L' && index === 8 && dB === null || ioTest_L[2] === 0) {
      audiogramData.pointSize_AC_L.splice(index, 1, 10);
      audiogramData.interOctTested_AC_L.splice(2, 1, 0);
      if (audiogramData.thresh_AC_L[7] === null || audiogramData.thresh_AC_L[9] === null) {
        audiogramData.thresh_AC_L.splice(8, 1, null);
        audiogramData.interOctTested_AC_L.splice(2, 1, 0);
        audiogramData.pointSize_AC_L.splice(8, 1, null);
        audiogramData.pointSize_hover_AC_L.splice(8, 1, null);
      } else {
        audiogramData.thresh_AC_L.splice(8, 1, (((audiogramData.thresh_AC_L[7]) + audiogramData.thresh_AC_L[9]) / 2));
        audiogramData.interOctTested_AC_L.splice(2, 1, 0);
        audiogramData.pointSize_AC_L.splice(8, 1, null);
        audiogramData.pointSize_hover_AC_L.splice(8, 1, null);
      }
    }
    if (ear === 'L' && index === 10 && dB === null || ioTest_L[3] === 0) {
      audiogramData.pointSize_AC_L.splice(index, 1, 10);
      audiogramData.interOctTested_AC_L.splice(3, 1, 0);
      if (audiogramData.thresh_AC_L[9] === null || audiogramData.thresh_AC_L[11] === null) {
        audiogramData.thresh_AC_L.splice(10, 1, null);
        audiogramData.interOctTested_AC_L.splice(3, 1, 0);
        audiogramData.pointSize_AC_L.splice(10, 1, null);
        audiogramData.pointSize_hover_AC_L.splice(10, 1, null);
      } else {
        audiogramData.thresh_AC_L.splice(10, 1, (((audiogramData.thresh_AC_L[9]) + audiogramData.thresh_AC_L[11]) / 2));
        audiogramData.interOctTested_AC_L.splice(3, 1, 0);
        audiogramData.pointSize_AC_L.splice(10, 1, null);
        audiogramData.pointSize_hover_AC_L.splice(10, 1, null);
      }
    }
  }

  // FileMaker.PerformScriptWithOption('pushJSON_audiogramData', JSON.stringify(audiogramData), '0');
}

//used for toggling old threshold curve and or for ghost ears
function toggleData() {

  const showValue = myChart.isDatasetVisible(5);

  if (showValue === true) {
    myChart.hide(5);
    myChart2.hide(5);
    myChart.show(6);
    myChart2.show(6);
    document.getElementById('Toggle').innerText = 'Show Ghost';
  }
  if (showValue === false) {
    myChart.hide(6);
    myChart2.hide(6);
    myChart.show(5);
    myChart2.show(5);
    document.getElementById('Toggle').innerText = 'Show Previous';
  }
}

window.onload = () => {
  toggleTransducer(1);
  toggleData(5);
  toggleData(6);
};

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
    if (oldAudiogramData.pointSize_AC_R[i] === null) {} else {
      oldAudiogramData.pointSize_AC_R.splice(i, 1, 2)
    }
  }
  for (let i = 0; i < oldAudiogramData.pointSize_AC_L.length; i++) {
    if (oldAudiogramData.pointSize_AC_L[i] === null) {} else {
      oldAudiogramData.pointSize_AC_L.splice(i, 1, 2)
    }
  }
}

reduceOldPointSizes();

function calcPTA(array) {

  if (array[3] === null || array[5] === null || array[7] === null) {} else
    return (array[3] + array[5] + array[7]) / 3;

}

let changeResolution_R = 1;
let changeResolution_L = 1;


function changeResolution(ear) {

  let changeArray = (ear === 'R' ? audiogramData.change_R : audiogramData.change_L);
  let lowMidHigh = [];
  let lowMidHigh_labels = ['Low', 'Mid', 'High'];
  let PTA = calcPTA(changeArray);
  let reso = (ear === 'R' ? changeResolution_R : changeResolution_L);
  let chartTarget = (ear === 'R' ? myChart3 : myChart4);
  let PTAtarget = (ear === 'R' ? changePTA_R : changePTA_L);

  if (changeArray[1] === null || changeArray[3] === null) {
    lowMidHigh.splice(0, 1, null)
  } else {
    lowMidHigh.splice(0, 1, (changeArray[1] + changeArray[3]) / 2)
  }
  if (changeArray[5] === null || changeArray[7] === null) {
    lowMidHigh.splice(1, 1, null)
  } else {
    lowMidHigh.splice(1, 1, (changeArray[5] + changeArray[7]) / 2)
  }
  if (changeArray[9] === null || changeArray[11] === null) {
    lowMidHigh.splice(2, 1, null)
  } else {
    lowMidHigh.splice(2, 1, (changeArray[9] + changeArray[11]) / 2)
  }

  if (reso === 3) {

    chartTarget.config.data.datasets[0].data = changeArray;
    chartTarget.config.data.labels = lilHz;
    reso = 1

  } else if (reso === 2) {

    PTAtarget.splice(0, 0, Math.trunc(PTA));

    chartTarget.config.data.datasets[0].data = PTAtarget;
    chartTarget.config.data.labels = ["PTA"];

    reso++

  } else if (reso === 1) {
    chartTarget.config.data.datasets[0].data = lowMidHigh;
    chartTarget.config.data.labels = lowMidHigh_labels;

    reso++

  }

  chartTarget.update();
  console.log(PTAtarget);

}

audiogramData.PTA_R = calcPTA(audiogramData.thresh_AC_R);
audiogramData.PTA_L = calcPTA(audiogramData.thresh_AC_L);

oldAudiogramData.PTA_R = calcPTA(oldAudiogramData.thresh_AC_R);
oldAudiogramData.PTA_L = calcPTA(oldAudiogramData.thresh_AC_L);


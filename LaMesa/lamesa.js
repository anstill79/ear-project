const BCresponses = {
  right: {
    five: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    thresh5: [null, null],
    one: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    thresh1: [null, null],
    two: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    thresh2: [null, null],
    four: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    thresh4: [null, null],
  },

  left: {
    five: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    thresh5: [null, null],
    one: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    thresh1: [null, null],
    two: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    thresh2: [null, null],
    four: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    thresh4: [null, null],
  },
  emptyArray: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
}


let activeMeasure = BCresponses.emptyArray;
let threshResult;

const xLabels = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110];

let chartColor = "black";
let fontColor = "black";

//BCresponses.right.thresh5[0] is the threshold Y value, [1] is the masking index value.
let maskedResult = 0;
let maskedIndex = 0;

//takes in x index which is masking level (where to splice), y index which is threshold (what value to splice), ear (array), 
//and frequency (array)
function pushData(thresh, masking) {

  previousValue = activeMeasure[masking];
  if (!activeMeasure || activeMeasure === BCresponses.emptyArray) {
    return
  }
  if (activeMeasure[masking] === thresh) {
    activeMeasure.splice(masking, 1, null)
  } else {
    activeMeasure.splice(masking, 1, thresh)
  }

  //fx to chekc for duplicates
  detectPlateau(activeMeasure);
  //set result vars to 0 if no duplicates, or result if true

  myChart.update();
}

function detectPlateau(arr) {
  let sorted_arr = arr.slice().sort();
  // You can define the comparing function here. JS by default uses a crappy string compare.
  // (we use slice to clone the array so the original array won't be modified)
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  results = results.filter(item => item !== null);
  results.sort(function(a, b) {
    return a - b;
  });
  const finalResult = results[0];
  //set value in object if not null
  if (finalResult !== undefined) {
    const maskLevel = activeMeasure.indexOf(finalResult);
    threshResult.splice(0, 1, finalResult);
    threshResult.splice(1, 1, maskLevel);
    //update annotation lines
    maskedResult = finalResult;
    maskedIndex = maskLevel;
    setAnnotationLines();
  }
}

function setAnnotationLines() {

  if (threshResult[0] === null || threshResult[1] === null) {
    maskedResult = 0;
    maskedIndex = 0;
  } else {
    maskedResult = threshResult[0];
    maskedIndex = threshResult[1];
  }
  myChart.options.plugins.annotation.annotations.line1.yMin = maskedResult;
  myChart.options.plugins.annotation.annotations.line1.yMax = maskedResult;
  myChart.options.plugins.annotation.annotations.line2.xMin = maskedIndex;
  myChart.options.plugins.annotation.annotations.line2.xMax = maskedIndex;
}

function setActiveMeasure(arg, ID) {

  if (arg === "R5") {
    activeMeasure = BCresponses.right.five;
    threshResult = BCresponses.right.thresh5;
    myChart.config.data.datasets[0].label = " Right 500 Hz";
    chartColor = "rgba(255, 0, 0, 1)";
    fontColor = 'red';
  }
  if (arg === "R1") {
    activeMeasure = BCresponses.right.one;
    threshResult = BCresponses.right.thresh1;
    myChart.config.data.datasets[0].label = " Right 1000 Hz";
    chartColor = "rgba(255, 0, 0, 1)";
    fontColor = 'red';
  }
  if (arg === "R2") {
    activeMeasure = BCresponses.right.two;
    threshResult = BCresponses.right.thresh2;
    myChart.config.data.datasets[0].label = " Right 2000 Hz";
    chartColor = "rgba(255, 0, 0, 1)";
    fontColor = 'red';
  }
  if (arg === "R4") {
    activeMeasure = BCresponses.right.four;
    threshResult = BCresponses.right.thresh4;
    myChart.config.data.datasets[0].label = " Right 4000 Hz";
    chartColor = "rgba(255, 0, 0, 1)";
    fontColor = 'red';
  }
  if (arg === "L5") {
    activeMeasure = BCresponses.left.five;
    threshResult = BCresponses.left.thresh5;
    myChart.config.data.datasets[0].label = " Left 500 Hz";
    chartColor = "rgba(0, 0, 255, 1)";
    fontColor = 'blue';
  }
  if (arg === "L1") {
    activeMeasure = BCresponses.left.one;
    threshResult = BCresponses.left.thresh1;
    myChart.config.data.datasets[0].label = " Left 1000 Hz";
    chartColor = "rgba(0, 0, 255, 1)";
    fontColor = 'blue';
  }
  if (arg === "L2") {
    activeMeasure = BCresponses.left.two;
    threshResult = BCresponses.left.thresh2;
    myChart.config.data.datasets[0].label = " Left 2000 Hz";
    chartColor = "rgba(0, 0, 255, 1)";
    fontColor = 'blue';
  }
  if (arg === "L4") {
    activeMeasure = BCresponses.left.four;
    threshResult = BCresponses.left.thresh4;
    myChart.config.data.datasets[0].label = " Left 4000 Hz";
    chartColor = "rgba(0, 0, 255, 1)";
    fontColor = 'blue';
  }

  setSelectedButton(ID);
  myChart.config.data.datasets[0].data = activeMeasure;
  myChart.config.data.datasets[0].borderColor = chartColor;
  myChart.options.scales.x.ticks.color = fontColor;
  myChart.options.scales.y.ticks.color = fontColor;
  myChart.options.plugins.legend.labels.color = fontColor;

  setAnnotationLines();

  myChart.update();

}

function setSelectedButton(ID) {

  const targetButton = document.getElementById(ID);

  const rights = document.querySelectorAll(".button_R");
  const lefts = document.querySelectorAll(".button_L");
  const selected = document.querySelectorAll(".button_U");

  selected.forEach(e => e.classList.remove("button_U"));
  rights.forEach(e => e.classList.add("button_R"));
  lefts.forEach(e => e.classList.add("button_L"));
  targetButton.classList.add("button_U")
}

const mainOptions_R = {
  type: 'line',
  data: {
    labels: xLabels,
    datasets: [{
      label: " Please select a test frequency",
      data: activeMeasure,
      borderWidth: 1,
      pointStyle: 'circle',
      pointBorderWidth: 2,
      pointBackgroundColor: 'rgba(0, 0, 0, 0.2)',
      lineTension: 0,
      spanGaps: true,
      borderColor: chartColor,
      clip: {
        left: false,
        top: false,
        right: false,
        bottom: false
      },
    }, ]
  },
  options: {
    plugins: {

      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: maskedResult,
            yMax: maskedResult,
            borderColor: 'black',
            borderWidth: 2,
            drawTime: 'beforeDatasetsDraw',
          },
          line2: {
            type: 'line',
            xMin: maskedIndex,
            xMax: maskedIndex,
            borderColor: 'black',
            borderWidth: 1,
            drawTime: 'beforeDatasetsDraw',
          },
        }
      },

      tooltip: {
        enabled: false
      },
      legend: {
        labels: {
          usePointStyle: true,
          //pointStyleWidth: 100,
          color: fontColor
        }
      }
    },
    layout: {
      padding: 0,
    },
    elements: {
      point: {
        hitRadius: 3,
        hoverRadius: 10
      }
    },
    animations: false,
    interaction: {
      mode: 'index'
    },
    aspectRatio: 1,
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Response',
        },
        grid: {
          drawTicks: false,
          color: 'grey',
          lineWidth: 0.5
        },
        min: 0,
        max: 100,
        ticks: {
          autoSkip: false,
          stepSize: 5,
          padding: 20,
          color: fontColor,
          font: {
            size: 12
          },
        },
        reverse: false,
        beginAtZero: false
      },
      x: {
        title: {
          display: true,
          text: 'Masking Level',
        },
        grid: {
          display: true,
          drawTicks: false,
          color: 'grey',
        },
        ticks: {
          //space between Hz and border
          padding: 10,
          color: fontColor,
          maxRotation: 45,
          autoSkip: false,
          font: {
            size: 12
          },
        },
      }
    },
    onClick: function(e) {
      const xLabel = this.scales.x.getValueForPixel(e.x);
      let yLabel = this.scales.y.getValueForPixel(e.y);
      yLabel = Math.round(yLabel / 5) * 5;
      //console.log(yLabel);
      pushData(yLabel, xLabel);
    },
  }
};


const ctx = document.getElementById('maskingGraph').getContext('2d');
const myChart = new Chart(ctx, mainOptions_R);


function clearData() {
  //copied from StackOverflow. Seems to start at 0 index then delete count is set to the original length of the array
  activeMeasure.splice(0, activeMeasure.length);

  activeMeasure.push(...BCresponses.emptyArray);

  myChart.update();

}

function resizeWindow() {
  Window.resizeTo(100, 100)
}

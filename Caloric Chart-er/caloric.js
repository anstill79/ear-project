function updateScore(id) {


  const ear = ['fourKayR', 'fiveHunR', 'threshR'].includes(id) ? 'R' : 'L';

  function setIndex(id) {
    const idMap = {
      "fourKayR": 0,
      "fourKayL": 0,
      "fiveHunR": 1,
      "fiveHunL": 1,
      "threshR": 2,
      "threshL": 2
    };
    index = idMap[id];
  }
  setIndex(id)

  if (ear === 'R') {
    if (data.scoresR[index] === 0) {
      data.scoresR[index] = 1;
      button.classList.add('toggle-button-enabled');
      button.innerText = '+'
    } else {
      data.scoresR[index] = 0;
      button.classList.add('toggle-button-disabled');
      button.innerText = '-'
    }
  }
  if (ear === 'L') {
    if (data.scoresL[index] === 0) {
      data.scoresL[index] = 1;
      button.classList.add('toggle-button-enabled');
      button.innerText = '+'
    } else {
      data.scoresL[index] = 0;
      button.classList.add('toggle-button-disabled');
      button.innerText = '-'
    }
  }
  data.scoreTotalR[0] = sumScore(data.scoresR);
  data.scoreTotalL[0] = sumScore(data.scoresL);

  setStyles();
  chartVEMP.update();
}

function jongkees() {

  //just do MWST right here if data is ready, instead of separate fx
  if (data.warmR && data.warmL) {
    console.log('yo')
  }

}


function sumScore(scores) {
  return scores.reduce((a, b) => a + b, 0);
}

const data = {
  warmR: [10, null],
  warmL: [null,15],
  coolR: [-22, null],
  coolL: [null, -7],
  total: null,
  MWST: -20,
  scoreTotalR: [{
    x: 0,
    y: 20
  }, {
    x: 0,
    y: -3
  }],
  scoreTotalL: [{
    x: 1,
    y: -15
  }, {
    x: 1,
    y: 2
  }],
  bg_R: 'rgba(255, 0, 0, 0.2)',
  bg_L: 'rgba(0, 0, 255, 0.2)',
  border_R: 'rgba(255, 0, 0, 0.4)',
  border_L: 'rgba(0, 0, 255, 0.4)',
  barSize_R: 0.2,
  barSize_L: 0.2,

}

function setStyles() {
  //updates alpha for both ears each time data changes for either

  data.bg_R = `rgba(255, 0, 0, ${data.scoreTotalR[0] / 10})`;
  data.border_R = `rgba(255, 0, 0, ${(data.scoreTotalR[0] / 10) * 2})`;
  data.bg_L = `rgba(0, 0, 255, ${data.scoreTotalL[0] / 10})`;
  data.border_L = `rgba(0, 0, 255, ${(data.scoreTotalL[0] / 10) * 2})`;
  data.barSize_R = (data.scoreTotalR[0] / 10) * 2;
  data.barSize_L = (data.scoreTotalL[0] / 10) * 2;
  chartVEMP.data.datasets[0].backgroundColor = data.bg_R;
  chartVEMP.data.datasets[0].borderColor = data.border_R;
  chartVEMP.data.datasets[1].backgroundColor = data.bg_L;
  chartVEMP.data.datasets[1].borderColor = data.border_L;
  chartVEMP.data.datasets[0].barPercentage = data.barSize_R;
  chartVEMP.data.datasets[1].barPercentage = data.barSize_L;
}

const chartOptions = {
  aspectRatio: 1,
  layout: {
    padding: 0
  },
  scales: {
    y: {
      beginAtZero: false,
      min: -40,
      max: 40,
      ticks: {
        stepSize: 10,
        padding: 0,
      },
      stacked: false
    },
    x: {
      stacked: true
    }
  },
  plugins: {
    legend: {
      display: false,
      position: 'right',
      labels: {
        boxWidth: 20,
        padding: 10,
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y === 1) {
            label += "low suspicion";
          }
          if (context.parsed.y === 2) {
            label += "high suspicion";
          }
          if (context.parsed.y === 3) {
            label += "very high suspicion";
          }
          return label;
        }
      }
    }
  }
}

const chartVEMP = new Chart(document.getElementById('VEMPchart'), {
  type: 'bar',
  data: {
    labels: ['Right', 'Left'],
    datasets: [{
        label: 'Right Warm',
        data: data.warmR,
        borderWidth: data.scoreTotalR,
        backgroundColor: data.bg_R,
        borderColor: data.border_R,
        barPercentage: data.barSize_R,
      },
      {
        label: 'Right Cool',
        data: data.coolR,
        borderWidth: data.scoreTotalR,
        backgroundColor: data.bg_R,
        borderColor: data.border_R,
        barPercentage: data.barSize_R,
      },
      {
        label: 'Left Warm',
        data: data.warmL,
        borderWidth: data.scoreTotalL,
        backgroundColor: data.bg_L,
        borderColor: data.border_L,
        barPercentage: data.barSize_L
      },
      {
        label: 'Left Cool',
        data: data.coolL,
        borderWidth: data.scoreTotalL,
        backgroundColor: data.bg_L,
        borderColor: data.border_L,
        barPercentage: data.barSize_L
      }
      ]
  },
  options: chartOptions
});

const chartOptions2 = {
    indexAxis: 'y',
  aspectRatio: 1,
  layout: {
    padding: 0
  },
  scales: {
    y: {
      beginAtZero: false,
      min: -40,
      max: 40,
      ticks: {
        stepSize: 10,
        padding: 0,
      },
      stacked: false
    },
    x: {
      stacked: true
    }
  },
  plugins: {
    legend: {
      display: false,
      position: 'right',
      labels: {
        boxWidth: 20,
        padding: 10,
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y === 1) {
            label += "low suspicion";
          }
          if (context.parsed.y === 2) {
            label += "high suspicion";
          }
          if (context.parsed.y === 3) {
            label += "very high suspicion";
          }
          return label;
        }
      }
    }
  }
}

const MWSTchart = new Chart(document.getElementById('MWSTchart'), {
  type: 'bar',
  data: {
    labels: ['symmetry'],
    datasets: [{
        label: 'Right Warm',
        data: data.MWST,
        borderWidth: data.scoreTotalR,
        backgroundColor: data.bg_R,
        borderColor: data.border_R,
        barPercentage: data.barSize_R,
      }
      ]
  },
  options: chartOptions2
});


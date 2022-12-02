

function updateScore(id) {
    const button = document.getElementById(id);
    console.log(id, button.id)
    button.removeAttribute('class');

    const ear = () => {
        if (id === "fourKayR" || "fiveHunR" || "threshR") {
            return 'R';
        }
        else {
            return 'L'
        }
    }

console.log(ear)

    const index = (id) => {
        if (id === "fourKayR" || "fourKayL") {
            return 0;
        }
        if (id === "fiveHunR" || "fiveHunL") {
            return 1;
        }
        if (id === "threshR" || "threshL") {
            return 2;
        }
    }

console.log(index)
    if (ear === 'R') {
        if (data.scoresR[index] === 0) {
            data.scoresR[index] = 1; 
            button.classList.add('toggle-button-enabled');
            return
        } else 
        data.scoresR[index] = 0; 
        button.classList.add('toggle-button-disabled');
    } 
    if (ear === 'L') {
        if (data.scoresL[index] === 0) {
            data.scoresL[index] = 1; 
            button.classList.add('toggle-button-enabled');
            return
        } else {
            data.scoresL[index] = 0; 
            button.classList.add('toggle-button-disabled');
        }
    } 

    setColorStyles();
    chartVEMP.update();
}


const data = {
    scoresR: [0, 0, 0],
    scoresL: [0, 0, 0],
    scoreTotalR: [1],
    scoreTotalL: [3],
    bg_R: 'rgba(255, 0, 0, 0.2)',
    bg_L: 'rgba(0, 0, 255, 0.2)',
    border_R: 'rgba(255, 0, 0, 0.4)',
    border_L: 'rgba(0, 0, 255, 0.4)'
}

function setColorStyles() {
    //updates alpha for both ears each time data changes for either

    data.bg_R = `rgba(255, 0, 0, ${data.scoreTotalR[0] / 10})`;
    data.border_R = `rgba(255, 0, 0, ${(data.scoreTotalR[0] / 10) * 2})`;
    data.bg_L = `rgba(0, 0, 255, ${data.scoreTotalL[0] / 10})`;
    data.border_L = `rgba(0, 0, 255, ${(data.scoreTotalL[0] / 10) * 2})`;
}

const chartOptions = {
    scales: {
        y: {
            beginAtZero: true,
            min: 0,
            max: 3,
            ticks: {
                stepSize: 1,
                padding: 20,

            },
        }
    },
    plugins: {
        tooltip: {
            callbacks: {
                label: function (context) {
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
        labels: ['Suspicion Level'],
        datasets: [{
            label: 'Right',
            data: data.scoreTotalR,
            borderWidth: 1,
            backgroundColor: data.bg_R,
            color: data.border_R
        },
        {
            label: 'Left',
            data: data.scoreTotalL,
            borderWidth: 1,
            backgroundColor: 'rgba(0, 0, 255, 0.2)'
        }]
    },
    options: chartOptions
});



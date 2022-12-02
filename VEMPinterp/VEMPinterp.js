

function toggleScore() {
    console.log(this)
}

const data = {
    scoreR: [1],
    scoreL: [3],
    bgR: 'rgba(255, 0, 0, 0.2)',
    bgL: "",
    borderR: "",
    borderL: ""
}

function setColorStyles() {
//updates alpha for both ears each time data changes for either



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

const chartRight = new Chart(document.getElementById('VEMPchart'), {
    type: 'bar',
    data: {
        labels: ['Suspicion Level'],
        datasets: [{
            label: 'Right Score',
            data: data.scoreR,
            borderWidth: 1,
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            color: 'rgba(255, 0, 0, 0.2)'
        }, 
        {
            label: 'Left Score',
            data: data.scoreL,
            borderWidth: 1,
            backgroundColor: 'rgba(0, 0, 255, 0.2)'
        }]
    },
options: chartOptions
});



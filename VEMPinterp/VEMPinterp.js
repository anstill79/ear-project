
function toggleScore() {
    console.log(this)
}

const chartOptions = {
    scales: {
        y: {
            beginAtZero: true
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
        labels: ['No Suspicion', 'Low Suspicion', 'High Suspicion', 'Very High Suspicion'],
        datasets: [{
            label: 'Right Score',
            data: [ 1],
            borderWidth: 1
        }, 
        {
            label: 'Left Score',
            data: [ 3],
            borderWidth: 1
        }]
    },
options: chartOptions
});



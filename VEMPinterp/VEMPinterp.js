
const ctx_R = document.getElementById('VEMPchart_R');
const ctx_L = document.getElementById('VEMPchart_L');

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
                    if (context.parsed.y !== null) {


                        label += context.parsed.y + context.parsed.y + context.parsed.y;
                        //label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                    }
                    return label;
                }
            }
        }
    }
}

const chartRight = new Chart(ctx_R, {
    type: 'bar',
    data: {
        labels: ['No Suspicion', 'Low Suspicion', 'High Suspicion', 'Very High Suspicion'],
        datasets: [{
            label: 'Right Score',
            data: [0, 1, 2, 3],
            borderWidth: 1
        }]
    },
options: chartOptions
});


const chartLeft =new Chart(ctx_L, {
    type: 'bar',
    data: {
        labels: ['No Suspicion', 'Low Suspicion', 'High Suspicion', 'Very High Suspicion'],
        datasets: [{
            label: 'Left Score',
            data: [0, 1, 2, 3],
            borderWidth: 1
        }]
    },
    options: chartOptions
});


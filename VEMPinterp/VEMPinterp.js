
const ctx_R = document.getElementById('VEMPchart_R');
const ctx_L = document.getElementById('VEMPchart_L');

const chartOptions = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
}

new Chart(ctx_R, {
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


new Chart(ctx_L, {
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

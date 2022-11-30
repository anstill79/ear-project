
  const ctx = document.getElementById('VEMPchart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['No Suspicion', 'Low Suspicion', 'High Suspicion', 'Very High Suspicion'],
      datasets: [{
        label: 'Right Score',
        data: [0, 1, 2, 3],
        borderWidth: 1
      },{
        label: 'Left Score',
        data: [0, 1, 2, 3],
        borderWidth: 1
      }, ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

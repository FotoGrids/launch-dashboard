// ─────────────────────────────────────────────────────────────
// FotoGrids Dashboard — Chart helpers (Chart.js)
// ─────────────────────────────────────────────────────────────

const COLOURS = {
  planned:     '#E5E7F0',
  in_progress: '#FFC72A',
  done:        '#27C28A',
  blocked:     '#EE3B49',
  indigo:      '#3B3BFF',
};

// Render the feature-progress stacked bar chart on product.md
function renderFeatureChart(canvasId, labels, plannedData, inProgressData, doneData) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Done',
          data: doneData,
          backgroundColor: COLOURS.done,
          borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
        },
        {
          label: 'In progress',
          data: inProgressData,
          backgroundColor: COLOURS.in_progress,
        },
        {
          label: 'Planned',
          data: plannedData,
          backgroundColor: COLOURS.planned,
          borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: "'Poppins', system-ui", size: 12 },
            color: '#6B7290',
            boxWidth: 12,
            padding: 16,
          },
        },
        tooltip: {
          callbacks: {
            title: (items) => items[0].label,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: {
            font: { family: "'Poppins', system-ui", size: 11 },
            color: '#6B7290',
          },
          border: { display: false },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            font: { family: "'Poppins', system-ui", size: 11 },
            color: '#6B7290',
          },
          grid: { color: '#E5E7F0' },
          border: { display: false },
        },
      },
    },
  });
}

// Render a doughnut for overall launch readiness (used on index.md)
function renderReadinessChart(canvasId, pct) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [pct, 100 - pct],
        backgroundColor: [COLOURS.indigo, '#E5E7F0'],
        borderWidth: 0,
        cutout: '76%',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    },
    plugins: [{
      id: 'centerText',
      afterDraw(chart) {
        const { ctx: c, chartArea: { left, top, width, height } } = chart;
        c.save();
        c.font = "700 28px 'Poppins', system-ui";
        c.fillStyle = '#0E1426';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(pct + '%', left + width / 2, top + height / 2);
        c.restore();
      },
    }],
  });
}

// ─────────────────────────────────────────────────────────────
// FotoGrids Dashboard — Chart helpers (Chart.js)
// ─────────────────────────────────────────────────────────────

const COLOURS = {
  planned:     '#E5E7F0',
  in_progress: '#FFB914',
  done:        '#46B450',
  blocked:     '#F01E32',
  indigo:      '#3C46F0',
  navy:        '#1A1A2E',
};

// Shared font defaults
const FONT = { family: "'Poppins', system-ui", size: 11 };

// Render the feature-progress stacked bar chart on product.md
function renderFeatureChart(canvasId, labels, plannedData, inProgressData, doneData) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Done',        data: doneData,       backgroundColor: COLOURS.done },
        { label: 'In progress', data: inProgressData, backgroundColor: COLOURS.in_progress },
        { label: 'Planned',     data: plannedData,    backgroundColor: COLOURS.planned },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: FONT, color: '#6B7290', boxWidth: 12, padding: 16 },
        },
        tooltip: { callbacks: { title: (items) => items[0].label } },
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { font: FONT, color: '#6B7290' }, border: { display: false } },
        y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1, font: FONT, color: '#6B7290' }, grid: { color: '#E5E7F0' }, border: { display: false } },
      },
    },
  });
}

// Polar area chart — overall readiness by section (used on index.md)
// sections: array of { label, pct } objects
function renderReadinessChart(canvasId, sections) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const palette = [
    '#3C46F0', // indigo  — free features
    '#7B83F5', // indigo light — pro features
    '#46B450', // green   — product tasks
    '#FFB914', // yellow  — website
    '#FF8C42', // orange  — marketing
    '#F01E32', // red     — admin
    '#6B7290', // slate   — legal
  ];

  const sectionColours = sections.map((_, i) => palette[i % palette.length]);

  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: sections.map(s => s.label),
      datasets: [{
        data: sections.map(s => s.pct),
        backgroundColor: sectionColours.map(c => c + 'CC'), // 80% opacity
        borderColor:     sectionColours,
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            font: FONT,
            color: '#6B7290',
            backdropColor: 'transparent',
            callback: v => v + '%',
          },
          grid:        { color: '#E5E7F0' },
          angleLines:  { color: '#E5E7F0' },
          pointLabels: { display: false },
        },
      },
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: { family: "'Poppins', system-ui", size: 12 },
            color: '#6B7290',
            boxWidth: 12,
            padding: 20,
            generateLabels(chart) {
              const data = chart.data;
              const hidden = chart._hiddenIndices || {};
              return data.labels.map((label, i) => ({
                text: label + '  ' + data.datasets[0].data[i] + '%',
                fillStyle:   data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor[i],
                lineWidth: 1,
                hidden: chart.getDataVisibility(i) === false,
                index: i,
              }));
            },
          },
          onClick(e, legendItem, legend) {
            const index = legendItem.index;
            const chart = legend.chart;
            chart.toggleDataVisibility(index);
            chart.update();
          },
        },
        tooltip: {
          callbacks: {
            label: ctx => ' ' + ctx.parsed.r + '%',
          },
        },
      },
    },
  });
}

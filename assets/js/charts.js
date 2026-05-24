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
    '#3C46F0', // indigo       — free features
    '#7B83F5', // indigo light — pro features
    '#46B450', // green        — product tasks
    '#FFB914', // yellow       — website pages
    '#14C4B4', // teal         — documentation
    '#8BC34A', // lime         — blog
    '#FF8C42', // orange       — marketing
    '#F01E32', // red          — admin
    '#6B7290', // slate        — legal
  ];

  const sectionColours = sections.map((_, i) => palette[i % palette.length]);

  const chart = new Chart(ctx, {
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
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ' ' + ctx.parsed.r + '%',
          },
        },
      },
    },
  });
  return chart;
}

// Update only specific indices in an existing readiness chart instance.
// patchMap: { [index]: newPct }  e.g. { 4: 55, 5: 10, 7: 80, 8: 0 }
function updateReadinessChart(chart, patchMap) {
  Object.entries(patchMap).forEach(([idx, val]) => {
    chart.data.datasets[0].data[idx] = val;
  });
  chart.update();
}

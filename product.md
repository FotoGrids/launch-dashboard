---
layout: dashboard
title: Product
---

<h1>Product</h1>
<p class="page-subtitle">Feature development status and product admin tasks.</p>

{% comment %} ── Data only — rendering is JS-driven ───────────────────────── {% endcomment %}
{% assign launch_features = site.data.features | where: "roadmap", false %}

## Section A — Features

<div class="filter-tabs" id="tier-filter">
  <button class="filter-tab active" data-tier="free" onclick="filterTier('free', this)">Free</button>
  <button class="filter-tab" data-tier="pro_starter" onclick="filterTier('pro_starter', this)">PRO Starter</button>
  <button class="filter-tab" data-tier="pro_plus" onclick="filterTier('pro_plus', this)">PRO Plus</button>
  <button class="filter-tab" data-tier="agency" onclick="filterTier('agency', this)">PRO Agency</button>
  <button class="filter-tab" data-tier="addon" onclick="filterTier('addon', this)">Add-ons</button>
  <button class="filter-tab" data-tier="roadmap" onclick="filterTier('roadmap', this)">Post-launch</button>
  <button class="filter-tab filter-tab--all" data-tier="all" onclick="filterTier('all', this)">All tiers</button>
</div>

<div class="stat-grid" id="feature-stat-grid" style="margin-bottom:24px;margin-top:16px;">
  <div class="stat-card highlight"><div class="stat-value" id="stat-released">—</div><div class="stat-label">Features released</div></div>
  <div class="stat-card"><div class="stat-value" id="stat-total">—</div><div class="stat-label" id="stat-total-label">Launch-scoped features</div></div>
  <div class="stat-card"><div class="stat-value" id="stat-inprogress">—</div><div class="stat-label">In progress</div></div>
  <div class="stat-card"><div class="stat-value" id="stat-notstarted">—</div><div class="stat-label">Not started</div></div>
</div>

<div class="progress-wrap" id="feature-progress" style="margin-bottom:24px;">
  <div class="progress-bar-track"><div class="progress-bar-fill" id="feature-progress-fill" style="width:0%;"></div></div>
  <div class="progress-label">
    <span id="feature-progress-label">Feature completion</span>
    <span><strong id="feature-progress-pct">0%</strong> &nbsp;<span id="feature-progress-count"></span></span>
  </div>
</div>

---

{% comment %} ── Stacked bar chart ──────────────────────────────────────────── {% endcomment %}
<div class="chart-wrap">
  <canvas id="featureChart"></canvas>
</div>

{% comment %} ── Feature table (filtered by JS) ─────────────────────────────── {% endcomment %}
<div class="table-scroll">
<table class="dash-table" id="feature-table">
  <thead>
    <tr>
      <th class="col-tier">Tier</th>
      <th style="text-align:left;">Feature</th>
      <th class="col-category">Category</th>
      <th>Backend</th>
      <th>Frontend</th>
      <th>Released</th>
      <th>Doc</th>
      <th style="text-align:left;">Notes</th>
    </tr>
  </thead>
  <tbody>
    {% for cat in site.data.categories %}
      {% assign cat_features = site.data.features | where: "category", cat %}
      {% if cat_features.size > 0 %}
        {% comment %} Collect all tiers present in this category for filter targeting {% endcomment %}
        {% assign cat_tiers = cat_features | map: "tier" | uniq %}
        {% assign cat_has_roadmap = false %}
        {% for f in cat_features %}{% if f.roadmap %}{% assign cat_has_roadmap = true %}{% endif %}{% endfor %}
        <tr class="table-category-row" data-category="{{ cat }}">
          <td colspan="8">{{ cat }}</td>
        </tr>
        {% for f in cat_features %}
        <tr
          data-tier="{{ f.tier }}"
          data-roadmap="{{ f.roadmap }}"
          data-backend="{{ f.dev_status.backend }}"
          data-frontend="{{ f.dev_status.frontend }}"
          data-released="{{ f.dev_status.released }}"
          data-doc="{{ f.has_doc }}"
        >
          <td class="col-tier">
            {% case f.tier %}
              {% when 'free' %}
                <span class="tier-pill tier-free">FREE</span>
              {% when 'pro_starter' %}
                <span class="tier-pill tier-starter"><span class="pro-tag">PRO</span><span class="tier-name">Starter</span></span>
              {% when 'pro_plus' %}
                <span class="tier-pill tier-plus"><span class="pro-tag">PRO</span><span class="tier-name">Plus</span></span>
              {% when 'agency' %}
                <span class="tier-pill tier-agency"><span class="pro-tag">PRO</span><span class="tier-name">Agency</span></span>
              {% when 'addon' %}
                <span class="tier-pill tier-addon">Add-on</span>
            {% endcase %}
          </td>
          <td class="col-name">{{ f.name }}</td>
          <td class="col-category">{{ f.category }}</td>
          <td>{% include status_badge.html status=f.dev_status.backend %}</td>
          <td>{% include status_badge.html status=f.dev_status.frontend %}</td>
          <td>
            {% if f.dev_status.released == true or f.dev_status.released == 'true' %}
              {% include icon_done.html %}
            {% elsif f.dev_status.released == false or f.dev_status.released == 'false' %}
              {% include icon_false.html %}
            {% else %}
              <span class="badge badge-planned">No</span>
            {% endif %}
          </td>
          <td>
            {% if f.has_doc == true or f.has_doc == 'true' %}
              {% include icon_done.html %}
            {% elsif f.has_doc == 'in_progress' %}
              <span class="badge badge-in_progress">WIP</span>
            {% elsif f.has_doc == false or f.has_doc == 'false' %}
              {% include icon_false.html %}
            {% else %}
              <span class="badge badge-planned">No</span>
            {% endif %}
          </td>
          <td class="col-notes">{{ f.notes }}</td>
        </tr>
        {% endfor %}
      {% endif %}
    {% endfor %}
  </tbody>
</table>
</div>

## Section B — Admin & Integration Tasks

{% assign all_product_tasks = site.data.tasks | where: "section", "product" %}
{% assign wporg_cat = "WordPress.org Compliance" %}
<div class="table-scroll">
<table class="dash-table">
  <thead>
    <tr>
      <th style="text-align:left;">Task</th>
      <th>Category</th>
      <th>Status</th>
      <th>Priority</th>
      <th>Blocked by</th>
      <th style="text-align:left;">Notes</th>
    </tr>
  </thead>
  <tbody>
    {% for task in all_product_tasks %}
    {% unless task.category == wporg_cat %}
    <tr>
      <td class="col-name">{{ task.name }}</td>
      <td>{{ task.category }}</td>
      <td>{% include status_badge.html status=task.status %}</td>
      <td>
        {% if task.priority == 'high' %}<span class="col-priority-high">High</span>
        {% elsif task.priority == 'medium' %}<span class="col-priority-medium">Medium</span>
        {% else %}<span class="col-priority-low">Low</span>{% endif %}
      </td>
      <td>{% if task.blocked_by and task.blocked_by != "" %}{{ task.blocked_by }}{% else %}—{% endif %}</td>
      <td class="col-notes">{{ task.notes | default: "—" }}</td>
    </tr>
    {% endunless %}
    {% endfor %}
  </tbody>
</table>
</div>

---

## Section C — WordPress.org Compliance

{% assign wporg_tasks = site.data.tasks | where: "category", "WordPress.org Compliance" %}

{% assign done_wporg = wporg_tasks | where: "status", "done" %}
{% include progress_bar.html done=done_wporg.size total=wporg_tasks.size label="WP.org compliance checklist" %}

<div class="checklist" style="margin-top:16px;">
  {% for task in wporg_tasks %}
  <div class="checklist-item {{ task.status }}">
    <div class="check-icon"></div>
    <div class="item-name">{{ task.name }}</div>
    {% if task.notes and task.notes != "" %}
    <div class="item-notes">{{ task.notes }}</div>
    {% endif %}
    {% include status_badge.html status=task.status %}
  </div>
  {% endfor %}
</div>

<script>
let featureChartState = null;

function normalizeStatus(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, '_');
}

function isCompletedStatus(value) {
  const normalized = normalizeStatus(value);
  return normalized === 'true' || normalized === 'done';
}

function statusBucket(value) {
  const normalized = normalizeStatus(value);
  if (normalized === 'in_progress') return 'in_progress';
  if (normalized === 'true' || normalized === 'done') return 'completed';
  return 'planned';
}

function createFeatureChart(config) {
  const canvas = document.getElementById('featureChart');
  if (!canvas) return;
  if (featureChartState) featureChartState.destroy();
  featureChartState = new Chart(canvas, config);
}

function renderTierSummaryChart() {
  const tiers   = ['free', 'pro_starter', 'pro_plus', 'agency', 'addon'];
  const labels  = ['Free', 'Starter', 'Plus', 'Agency', 'Add-on'];
  const planned = [], inProgress = [], done = [];
  const rows = Array.from(document.querySelectorAll('#feature-table tbody tr'));

  tiers.forEach(tier => {
    const tierRows = rows.filter(r => r.dataset.tier === tier && r.dataset.roadmap === 'false');
    let d = 0, ip = 0, p = 0;
    tierRows.forEach(r => {
      const released = normalizeStatus(r.dataset.released) === 'true';
      const backendStatus = normalizeStatus(r.dataset.backend);
      const frontendStatus = normalizeStatus(r.dataset.frontend);

      if (released) {
        d++;
      } else if (backendStatus === 'in_progress' || frontendStatus === 'in_progress') {
        ip++;
      } else {
        p++;
      }
    });
    done.push(d);
    inProgress.push(ip);
    planned.push(p);
  });

  createFeatureChart({
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Done',        data: done,       backgroundColor: '#46B450' },
        { label: 'In progress', data: inProgress, backgroundColor: '#FFB914' },
        { label: 'Planned',     data: planned,    backgroundColor: '#E5E7F0' },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: "'Poppins', system-ui", size: 11 }, color: '#6B7290', boxWidth: 12, padding: 16 },
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { font: { family: "'Poppins', system-ui", size: 11 }, color: '#6B7290' }, border: { display: false } },
        y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1, font: { family: "'Poppins', system-ui", size: 11 }, color: '#6B7290' }, grid: { color: '#E5E7F0' }, border: { display: false } },
      },
    },
  });
}

function renderTierDetailChart(tier) {
  const rows = Array.from(document.querySelectorAll('#feature-table tbody tr'))
    .filter(r => r.dataset.tier === tier && r.dataset.roadmap === 'false');

  const labels = ['Backend', 'Frontend', 'Released', 'Docs'];
  const completed = [0, 0, 0, 0];
  const inProgress = [0, 0, 0, 0];
  const planned = [0, 0, 0, 0];

  rows.forEach(r => {
    const statuses = [r.dataset.backend, r.dataset.frontend, r.dataset.released, r.dataset.doc];
    statuses.forEach((status, idx) => {
      const bucket = statusBucket(status);
      if (bucket === 'completed') completed[idx]++;
      else if (bucket === 'in_progress') inProgress[idx]++;
      else planned[idx]++;
    });
  });

  createFeatureChart({
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Completed',   data: completed,  backgroundColor: '#46B450' },
        { label: 'In Progress', data: inProgress, backgroundColor: '#FFB914' },
        { label: 'Planned',     data: planned,    backgroundColor: '#E5E7F0' },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: "'Poppins', system-ui", size: 11 }, color: '#6B7290', boxWidth: 12, padding: 16 },
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { font: { family: "'Poppins', system-ui", size: 11 }, color: '#6B7290' }, border: { display: false } },
        y: { stacked: true, beginAtZero: true, max: rows.length > 0 ? rows.length : 1, ticks: { stepSize: 1, font: { family: "'Poppins', system-ui", size: 11 }, color: '#6B7290' }, grid: { color: '#E5E7F0' }, border: { display: false } },
      },
    },
  });
}

function updateFeatureChartForTier(tier) {
  if (tier === 'all' || tier === 'roadmap') {
    renderTierSummaryChart();
    return;
  }
  renderTierDetailChart(tier);
}

// ── Stat grid + progress bar update ─────────────────────────────
function updateStatGrid(tier) {
  const rows = Array.from(document.querySelectorAll('#feature-table tbody tr'))
    .filter(r => !r.classList.contains('table-category-row'));

  const scoped = rows.filter(r => {
    const isRoadmap = r.dataset.roadmap === 'true';
    if (tier === 'all')      return !isRoadmap;
    if (tier === 'roadmap')  return isRoadmap;
    return !isRoadmap && r.dataset.tier === tier;
  });

  let released = 0, inprogress = 0;
  scoped.forEach(r => {
    const isReleased = normalizeStatus(r.dataset.released) === 'true';
    const backendIP  = normalizeStatus(r.dataset.backend)  === 'in_progress';
    const frontendIP = normalizeStatus(r.dataset.frontend) === 'in_progress';
    if (isReleased) released++;
    else if (backendIP || frontendIP) inprogress++;
  });

  const total      = scoped.length;
  const notStarted = total - released - inprogress;
  const pct        = total > 0 ? Math.round(released * 100 / total) : 0;

  document.getElementById('stat-released').textContent    = released;
  document.getElementById('stat-total').textContent       = total;
  document.getElementById('stat-inprogress').textContent  = inprogress;
  document.getElementById('stat-notstarted').textContent  = notStarted;

  const tierLabel = tier === 'all' ? 'all launch-scoped' : tier === 'roadmap' ? 'post-launch' : tier.replace('_', ' ');
  document.getElementById('stat-total-label').textContent      = tier === 'all' ? 'Launch-scoped features' : 'Features in scope';
  document.getElementById('feature-progress-label').textContent = 'Feature completion — ' + tierLabel;
  document.getElementById('feature-progress-fill').style.width  = pct + '%';
  document.getElementById('feature-progress-pct').textContent   = pct + '%';
  document.getElementById('feature-progress-count').textContent = '(' + released + '/' + total + ')';
}

// ── Tier filter ─────────────────────────────────────────────────
function filterTier(tier, btn) {
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const rows = document.querySelectorAll('#feature-table tbody tr');
  rows.forEach(row => {
    if (row.classList.contains('table-category-row')) return;
    const rowTier    = row.dataset.tier;
    const rowRoadmap = row.dataset.roadmap === 'true';

    if (tier === 'all') {
      row.style.display = '';
    } else if (tier === 'roadmap') {
      row.style.display = rowRoadmap ? '' : 'none';
    } else {
      row.style.display = (!rowRoadmap && rowTier === tier) ? '' : 'none';
    }
  });

  // Show category header only if at least one sibling feature row is visible
  document.querySelectorAll('.table-category-row').forEach(catRow => {
    let next = catRow.nextElementSibling;
    let anyVisible = false;
    while (next && !next.classList.contains('table-category-row')) {
      if (next.style.display !== 'none') { anyVisible = true; break; }
      next = next.nextElementSibling;
    }
    catRow.style.display = anyVisible ? '' : 'none';
  });

  updateStatGrid(tier);
  updateFeatureChartForTier(tier);
}

// ── Boot on Free ─────────────────────────────────────────────────
filterTier('free', document.querySelector('.filter-tab[data-tier="free"]'));
</script>

---
layout: dashboard
title: Product
---

<h1>Product</h1>
<p class="page-subtitle">Feature development status and product admin tasks.</p>

{% comment %} ── Progress summary ──────────────────────────────────────────── {% endcomment %}
{% assign launch_features = site.data.features | where: "roadmap", false %}
{% assign done_features = launch_features | where_exp: "f", "f.dev_status.released == true" %}
{% assign ip_backend  = launch_features | where_exp: "f", "f.dev_status.released != true and f.dev_status.backend == 'in_progress'" %}
{% assign ip_frontend = launch_features | where_exp: "f", "f.dev_status.released != true and f.dev_status.frontend == 'in_progress'" %}
{% assign ip_combined = ip_backend | concat: ip_frontend | uniq %}

<div class="stat-grid" style="margin-bottom:24px;">
  {% assign done_pct = done_features.size | times: 100 | divided_by: launch_features.size %}
  {% include stat_card.html value=done_features.size label="Features released" highlight=true %}
  {% include stat_card.html value=launch_features.size label="Launch-scoped features" %}
  {% include stat_card.html value=ip_combined.size label="In progress" %}
  {% assign not_started = launch_features.size | minus: done_features.size | minus: ip_combined.size %}
  {% include stat_card.html value=not_started label="Not started" %}
</div>

{% include progress_bar.html done=done_features.size total=launch_features.size label="Feature completion (launch scope)" %}

---

## Section A — Features

<div class="filter-tabs" id="tier-filter">
  <button class="filter-tab active" onclick="filterTier('all', this)">All tiers</button>
  <button class="filter-tab" onclick="filterTier('free', this)">Free</button>
  <button class="filter-tab" onclick="filterTier('pro_starter', this)">Pro Starter</button>
  <button class="filter-tab" onclick="filterTier('pro_plus', this)">Pro Plus</button>
  <button class="filter-tab" onclick="filterTier('agency', this)">Agency</button>
  <button class="filter-tab" onclick="filterTier('addon', this)">Add-ons</button>
  <button class="filter-tab" onclick="filterTier('roadmap', this)">Post-launch</button>
</div>

{% comment %} ── Stacked bar chart ──────────────────────────────────────────── {% endcomment %}
<div class="chart-wrap">
  <canvas id="featureChart"></canvas>
</div>

{% comment %} ── Feature table (filtered by JS) ─────────────────────────────── {% endcomment %}
<table class="dash-table" id="feature-table">
  <thead>
    <tr>
      <th>Feature</th>
      <th>Category</th>
      <th>Tier</th>
      <th>Backend</th>
      <th>Frontend</th>
      <th>Released</th>
      <th>Doc</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    {% for f in site.data.features %}
    <tr data-tier="{{ f.tier }}" data-roadmap="{{ f.roadmap }}">
      <td class="col-name">{{ f.name }}</td>
      <td>{{ f.category }}</td>
      <td>
        {% case f.tier %}
          {% when 'free' %}<span class="badge badge-shipped">Free</span>
          {% when 'pro_starter' %}<span class="badge badge-roadmap" style="background:#EFF0FF;color:#2B2BAA;">Pro Starter</span>
          {% when 'pro_plus' %}<span class="badge" style="background:#FFF3D6;color:#8A5A00;">Pro Plus</span>
          {% when 'agency' %}<span class="badge" style="background:#F0EEF9;color:#4A3880;">Agency</span>
          {% when 'addon' %}<span class="badge badge-planned">Add-on</span>
        {% endcase %}
      </td>
      <td>{% include status_badge.html status=f.dev_status.backend %}</td>
      <td>{% include status_badge.html status=f.dev_status.frontend %}</td>
      <td>
        {% if f.dev_status.released %}
          <span class="badge badge-done">Yes</span>
        {% else %}
          <span class="badge badge-planned">No</span>
        {% endif %}
      </td>
      <td>
        {% if f.has_doc == true %}
          <span class="badge badge-done">Yes</span>
        {% elsif f.has_doc == 'in_progress' %}
          <span class="badge badge-in_progress">WIP</span>
        {% else %}
          <span class="badge badge-planned">No</span>
        {% endif %}
      </td>
      <td class="col-notes">{{ f.notes | default: "—" }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>

---

## Section B — Admin & Integration Tasks

{% assign product_tasks = site.data.tasks | where: "section", "product" | where_exp: "t", "t.category != 'WordPress.org Compliance'" %}
{% include task_table.html tasks=product_tasks %}

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
// ── Tier filter ─────────────────────────────────────────────────
function filterTier(tier, btn) {
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const rows = document.querySelectorAll('#feature-table tbody tr');
  rows.forEach(row => {
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
}

// ── Feature stacked bar chart ────────────────────────────────────
(function() {
  // Build data from injected Jekyll values
  const tiers   = ['free', 'pro_starter', 'pro_plus', 'agency', 'addon'];
  const labels  = ['Free', 'Pro Starter', 'Pro Plus', 'Agency', 'Add-on'];
  const planned = [], inProgress = [], done = [];

  const rows = Array.from(document.querySelectorAll('#feature-table tbody tr'));

  tiers.forEach(tier => {
    const tierRows = rows.filter(r => r.dataset.tier === tier && r.dataset.roadmap === 'false');
    let d = 0, ip = 0, p = 0;
    tierRows.forEach(r => {
      const cells = r.querySelectorAll('td');
      // released = col index 5 (0-based)
      const released = cells[5].querySelector('.badge-done') !== null;
      // backend = index 3, frontend = index 4
      const backendBadge   = cells[3].querySelector('.badge');
      const frontendBadge  = cells[4].querySelector('.badge');
      const backendText    = backendBadge ? backendBadge.textContent.trim() : '';
      const frontendText   = frontendBadge ? frontendBadge.textContent.trim() : '';

      if (released) {
        d++;
      } else if (backendText === 'in progress' || frontendText === 'in progress') {
        ip++;
      } else {
        p++;
      }
    });
    done.push(d);
    inProgress.push(ip);
    planned.push(p);
  });

  renderFeatureChart('featureChart', labels, planned, inProgress, done);
})();
</script>

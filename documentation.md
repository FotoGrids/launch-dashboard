---
layout: dashboard
title: Documentation
---

<h1>Documentation</h1>
<p class="page-subtitle">Article coverage across all docs sections.</p>

{% assign doc_sections = site.data.documentation.doc_sections %}

<div class="filter-tabs" id="docs-tier-filter">
  <button class="filter-tab active" data-tier="free"        onclick="filterDocsTier('free', this)">Free</button>
  <button class="filter-tab"        data-tier="pro_starter" onclick="filterDocsTier('pro_starter', this)">PRO Starter</button>
  <button class="filter-tab"        data-tier="pro_plus"    onclick="filterDocsTier('pro_plus', this)">PRO Plus</button>
  <button class="filter-tab"        data-tier="agency"      onclick="filterDocsTier('agency', this)">PRO Agency</button>
  <button class="filter-tab filter-tab--all" data-tier="all" onclick="filterDocsTier('all', this)">All tiers</button>
</div>

<div class="stat-grid" style="margin-bottom:24px;margin-top:16px;">
  <div class="stat-card highlight"><div class="stat-value" id="docs-stat-live">—</div><div class="stat-label">Articles live</div></div>
  <div class="stat-card"><div class="stat-value" id="docs-stat-wip">—</div><div class="stat-label">In progress</div></div>
  <div class="stat-card"><div class="stat-value" id="docs-stat-plan">—</div><div class="stat-label">Planned</div></div>
  <div class="stat-card"><div class="stat-value" id="docs-stat-total">—</div><div class="stat-label">Total articles</div></div>
</div>

<div class="progress-wrap" style="margin-bottom:24px;">
  <div class="progress-bar-track"><div class="progress-bar-fill" id="docs-progress-fill" style="width:0%;"></div></div>
  <div class="progress-label">
    <span id="docs-progress-label">Documentation complete</span>
    <span><strong id="docs-progress-pct">0%</strong> &nbsp;<span id="docs-progress-count"></span></span>
  </div>
</div>

{% for section in doc_sections %}
### {{ section.name }}

<div class="table-scroll docs-section-wrap">
<table class="dash-table docs-section-table">
  <thead>
    <tr>
      <th class="col-tier">Tier</th>
      <th class="col-left">Article</th>
      <th>Status</th>
      <th class="col-left">URL</th>
      <th class="col-left">Notes</th>
    </tr>
  </thead>
  <tbody>
    {% for article in section.articles %}
    <tr data-tier="{{ article.tier | default: 'free' }}" data-status="{{ article.status }}">
      <td class="col-tier">
        {% assign t = article.tier | default: "free" %}
        {% if t == 'pro_starter' %}<span class="tier-pill tier-starter"><span class="pro-tag">PRO</span><span class="tier-name">Starter</span></span>
        {% elsif t == 'pro_plus' %}<span class="tier-pill tier-plus"><span class="pro-tag">PRO</span><span class="tier-name">Plus</span></span>
        {% elsif t == 'agency' %}<span class="tier-pill tier-agency"><span class="pro-tag">PRO</span><span class="tier-name">Agency</span></span>
        {% elsif t == 'free' %}<span class="tier-pill tier-free">FREE</span>
        {% else %}<span class="tier-pill tier-addon">{{ t }}</span>{% endif %}
      </td>
      <td class="col-name">{{ article.title }}</td>
      <td>{% include status_badge.html status=article.status %}</td>
      <td class="col-left">
        {% if article.url and article.url != "" %}
          <a href="{{ article.url }}" target="_blank" style="font-size:12px; color:var(--text-muted);">{{ article.url }}</a>
        {% else %}
          <span style="font-size:12px; color:var(--text-muted);">—</span>
        {% endif %}
      </td>
      <td class="col-notes">{{ article.notes | default: "—" }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>
</div>
{% endfor %}

<script>
const DOCS_TIER_LABELS = { free: 'Free', pro_starter: 'PRO Starter', pro_plus: 'PRO Plus', agency: 'PRO Agency', all: 'all tiers' };

function updateDocsStats(tier) {
  const rows = Array.from(document.querySelectorAll('.docs-section-table tbody tr'));
  const scoped = tier === 'all' ? rows : rows.filter(r => r.dataset.tier === tier);
  let live = 0, wip = 0, plan = 0;
  scoped.forEach(r => {
    if      (r.dataset.status === 'live')        live++;
    else if (r.dataset.status === 'in_progress') wip++;
    else                                         plan++;
  });
  const total = scoped.length;
  const pct   = total > 0 ? Math.round(live * 100 / total) : 0;

  document.getElementById('docs-stat-live').textContent     = live;
  document.getElementById('docs-stat-wip').textContent      = wip;
  document.getElementById('docs-stat-plan').textContent     = plan;
  document.getElementById('docs-stat-total').textContent    = total;
  document.getElementById('docs-progress-fill').style.width = pct + '%';
  document.getElementById('docs-progress-pct').textContent  = pct + '%';
  document.getElementById('docs-progress-count').textContent = '(' + live + '/' + total + ')';
  document.getElementById('docs-progress-label').textContent = 'Documentation complete — ' + (DOCS_TIER_LABELS[tier] || tier);
}

function filterDocsTier(tier, btn) {
  document.querySelectorAll('#docs-tier-filter .filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.docs-section-table tbody tr').forEach(row => {
    row.style.display = (tier === 'all' || row.dataset.tier === tier) ? '' : 'none';
  });

  // Hide section heading + table when no rows are visible
  document.querySelectorAll('.docs-section-wrap').forEach(wrap => {
    const anyVisible = Array.from(wrap.querySelectorAll('tbody tr')).some(r => r.style.display !== 'none');
    wrap.style.display = anyVisible ? '' : 'none';
    const heading = wrap.previousElementSibling;
    if (heading && heading.tagName.match(/^H[1-6]$/)) heading.style.display = anyVisible ? '' : 'none';
  });

  updateDocsStats(tier);
}

// Boot on Free
filterDocsTier('free', document.querySelector('#docs-tier-filter .filter-tab[data-tier="free"]'));
</script>

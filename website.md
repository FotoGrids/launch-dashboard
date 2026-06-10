---
layout: dashboard
title: Website
---

<h1>Website</h1>
<p class="page-subtitle">Marketing-site pages. Blog and Documentation now have dedicated pages.</p>

{% assign pages = site.data.website.pages %}

<div class="filter-tabs" id="web-tier-filter">
  <button class="filter-tab active" data-tier="free"        onclick="filterWebTier('free', this)">Free</button>
  <button class="filter-tab"        data-tier="pro_starter" onclick="filterWebTier('pro_starter', this)">PRO Starter</button>
  <button class="filter-tab"        data-tier="pro_plus"    onclick="filterWebTier('pro_plus', this)">PRO Plus</button>
  <button class="filter-tab"        data-tier="agency"      onclick="filterWebTier('agency', this)">PRO Agency</button>
  <button class="filter-tab filter-tab--all" data-tier="all" onclick="filterWebTier('all', this)">All tiers</button>
</div>

<div class="stat-grid" style="margin-bottom:24px;margin-top:16px;">
  <div class="stat-card highlight"><div class="stat-value" id="web-stat-live">—</div><div class="stat-label">Pages live</div></div>
  <div class="stat-card"><div class="stat-value" id="web-stat-wip">—</div><div class="stat-label">In progress</div></div>
  <div class="stat-card"><div class="stat-value" id="web-stat-plan">—</div><div class="stat-label">Planned</div></div>
  <div class="stat-card"><div class="stat-value" id="web-stat-total">—</div><div class="stat-label">Total pages</div></div>
</div>

<div class="progress-wrap" style="margin-bottom:24px;">
  <div class="progress-bar-track"><div class="progress-bar-fill" id="web-progress-fill" style="width:0%;"></div></div>
  <div class="progress-label">
    <span id="web-progress-label">Pages live</span>
    <span><strong id="web-progress-pct">0%</strong> &nbsp;<span id="web-progress-count"></span></span>
  </div>
</div>

## Pages

<div class="table-scroll">
<table class="dash-table" id="web-pages-table">
  <thead>
    <tr>
      <th class="col-tier">Tier</th>
      <th class="col-left">Page</th>
      <th>Status</th>
      <th class="col-left">URL</th>
      <th class="col-left">Notes</th>
    </tr>
  </thead>
  <tbody>
    {% for page in site.data.website.pages %}
    <tr data-tier="{{ page.tier | default: 'free' }}" data-status="{{ page.status }}">
      <td class="col-tier">
        {% assign t = page.tier | default: "free" %}
        {% if t == 'pro_starter' %}<span class="tier-pill tier-starter"><span class="pro-tag">PRO</span><span class="tier-name">Starter</span></span>
        {% elsif t == 'pro_plus' %}<span class="tier-pill tier-plus"><span class="pro-tag">PRO</span><span class="tier-name">Plus</span></span>
        {% elsif t == 'agency' %}<span class="tier-pill tier-agency"><span class="pro-tag">PRO</span><span class="tier-name">Agency</span></span>
        {% elsif t == 'free' %}<span class="tier-pill tier-free">FREE</span>
        {% else %}<span class="tier-pill tier-addon">{{ t }}</span>{% endif %}
      </td>
      <td class="col-name">{{ page.name }}</td>
      <td>{% include status_badge.html status=page.status %}</td>
      <td class="col-left">
        {% if page.url and page.url != "" and page.status == "live" %}
          <a href="{{ page.url }}" style="font-size:12px; color:var(--text-muted);">{{ page.url }}</a>
        {% elsif page.url and page.url != "" %}
          <span style="font-size:12px; color:var(--text-muted);">{{ page.url }}</span>
        {% else %}
          <span style="font-size:12px; color:var(--text-muted);">—</span>
        {% endif %}
      </td>
      <td class="col-notes">{{ page.notes | default: "—" }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>
</div>

<p style="margin-top:32px; color:var(--text-muted); font-size:13px;">
  Looking for blog coverage? See <a href="{{ '/blog' | relative_url }}">Blog</a>.<br/>
  Looking for documentation coverage? See <a href="{{ '/documentation' | relative_url }}">Documentation</a>.
</p>

<script>
const WEB_TIER_LABELS = { free: 'Free', pro_starter: 'PRO Starter', pro_plus: 'PRO Plus', agency: 'PRO Agency', all: 'all tiers' };

function updateWebStats(tier) {
  const rows = Array.from(document.querySelectorAll('#web-pages-table tbody tr'));
  const scoped = tier === 'all' ? rows : rows.filter(r => r.dataset.tier === tier);
  let live = 0, wip = 0, plan = 0;
  scoped.forEach(r => {
    if      (r.dataset.status === 'live')        live++;
    else if (r.dataset.status === 'in_progress') wip++;
    else                                         plan++;
  });
  const total = scoped.length;
  const pct   = total > 0 ? Math.round(live * 100 / total) : 0;

  document.getElementById('web-stat-live').textContent      = live;
  document.getElementById('web-stat-wip').textContent       = wip;
  document.getElementById('web-stat-plan').textContent      = plan;
  document.getElementById('web-stat-total').textContent     = total;
  document.getElementById('web-progress-fill').style.width  = pct + '%';
  document.getElementById('web-progress-pct').textContent   = pct + '%';
  document.getElementById('web-progress-count').textContent = '(' + live + '/' + total + ')';
  document.getElementById('web-progress-label').textContent = 'Pages live — ' + (WEB_TIER_LABELS[tier] || tier);
}

function filterWebTier(tier, btn) {
  document.querySelectorAll('#web-tier-filter .filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('#web-pages-table tbody tr').forEach(row => {
    row.style.display = (tier === 'all' || row.dataset.tier === tier) ? '' : 'none';
  });

  updateWebStats(tier);
}

// Boot on Free
filterWebTier('free', document.querySelector('#web-tier-filter .filter-tab[data-tier="free"]'));
</script>

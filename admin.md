---
layout: dashboard
title: Admin & Legal
---

<h1>Admin & Legal</h1>
<p class="page-subtitle">Infrastructure, legal, and company setup tasks.</p>

{% assign admin_items = site.data.admin %}

<div class="filter-tabs" id="admin-tier-filter">
  <button class="filter-tab active" data-tier="free"        onclick="filterAdminTier('free', this)">Free</button>
  <button class="filter-tab"        data-tier="pro_starter" onclick="filterAdminTier('pro_starter', this)">PRO Starter</button>
  <button class="filter-tab filter-tab--all" data-tier="all" onclick="filterAdminTier('all', this)">All tiers</button>
</div>

<div class="stat-grid" style="margin-bottom:24px;margin-top:16px;">
  <div class="stat-card highlight"><div class="stat-value" id="admin-stat-done">—</div><div class="stat-label">Items complete</div></div>
  <div class="stat-card"><div class="stat-value" id="admin-stat-wip">—</div><div class="stat-label">In progress</div></div>
  <div class="stat-card"><div class="stat-value" id="admin-stat-plan">—</div><div class="stat-label">Not started</div></div>
  <div class="stat-card"><div class="stat-value" id="admin-stat-total">—</div><div class="stat-label">Total items</div></div>
</div>

<div class="progress-wrap" style="margin-bottom:24px;">
  <div class="progress-bar-track"><div class="progress-bar-fill" id="admin-progress-fill" style="width:0%;"></div></div>
  <div class="progress-label">
    <span id="admin-progress-label">Admin &amp; legal complete</span>
    <span><strong id="admin-progress-pct">0%</strong> &nbsp;<span id="admin-progress-count"></span></span>
  </div>
</div>

{% assign categories = admin_items | map: "category" | uniq %}

{% for cat in categories %}
<div class="section admin-section" id="admin-section-{{ cat | slugify }}">
  <h2>{{ cat }}</h2>
  <div class="checklist">
    {% assign cat_items = admin_items | where: "category", cat %}
    {% for item in cat_items %}
    <div class="checklist-item {{ item.status }}" data-tier="{{ item.tier | default: 'free' }}" data-status="{{ item.status }}">
      <div class="check-icon"></div>
      <div class="tier-wrapper">
        {% assign t = item.tier | default: "free" %}
        {% if t == 'pro_starter' %}<span class="tier-pill tier-starter"><span class="pro-tag">PRO</span><span class="tier-name">Starter</span></span>
        {% elsif t == 'pro_plus' %}<span class="tier-pill tier-plus"><span class="pro-tag">PRO</span><span class="tier-name">Plus</span></span>
        {% elsif t == 'agency' %}<span class="tier-pill tier-agency"><span class="pro-tag">PRO</span><span class="tier-name">Agency</span></span>
        {% elsif t == 'free' %}<span class="tier-pill tier-free">FREE</span>
        {% else %}<span class="tier-pill tier-addon">{{ t }}</span>{% endif %}
      </div>
      <div class="item-name">{{ item.name }}</div>
      {% if item.notes and item.notes != "" %}
      <div class="item-notes">{{ item.notes }}</div>
      {% endif %}
      {% include status_badge.html status=item.status %}
    </div>
    {% endfor %}
  </div>
</div>
{% endfor %}

<script>
const ADMIN_TIER_LABELS = { free: 'Free', pro_starter: 'PRO Starter', all: 'all tiers' };

function updateAdminStats(tier) {
  const items = Array.from(document.querySelectorAll('.admin-section .checklist-item'));
  const scoped = tier === 'all' ? items : items.filter(i => i.dataset.tier === tier);
  let done = 0, wip = 0, plan = 0;
  scoped.forEach(i => {
    if      (i.dataset.status === 'done')        done++;
    else if (i.dataset.status === 'in_progress') wip++;
    else                                         plan++;
  });
  const total = scoped.length;
  const pct   = total > 0 ? Math.round(done * 100 / total) : 0;

  document.getElementById('admin-stat-done').textContent    = done;
  document.getElementById('admin-stat-wip').textContent     = wip;
  document.getElementById('admin-stat-plan').textContent    = plan;
  document.getElementById('admin-stat-total').textContent   = total;
  document.getElementById('admin-progress-fill').style.width = pct + '%';
  document.getElementById('admin-progress-pct').textContent  = pct + '%';
  document.getElementById('admin-progress-count').textContent = '(' + done + '/' + total + ')';
  document.getElementById('admin-progress-label').textContent = 'Admin & legal complete — ' + (ADMIN_TIER_LABELS[tier] || tier);
}

function filterAdminTier(tier, btn) {
  document.querySelectorAll('#admin-tier-filter .filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.admin-section .checklist-item').forEach(item => {
    item.style.display = (tier === 'all' || item.dataset.tier === tier) ? '' : 'none';
  });

  // Hide sections where all items are hidden
  document.querySelectorAll('.admin-section').forEach(section => {
    const anyVisible = Array.from(section.querySelectorAll('.checklist-item'))
      .some(i => i.style.display !== 'none');
    section.style.display = anyVisible ? '' : 'none';
  });

  updateAdminStats(tier);
}

// Boot on Free
filterAdminTier('free', document.querySelector('#admin-tier-filter .filter-tab[data-tier="free"]'));
</script>

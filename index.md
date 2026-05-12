---
layout: dashboard
title: Overview
---

<h1>Launch Overview</h1>
<p class="page-subtitle">FotoGrids v{{ site.data.milestones.launch.version }} · Target: {{ site.data.milestones.launch.target_date }}</p>

{% comment %} ── Calculate overall readiness ────────────────────────────────── {% endcomment %}

{% comment %} Feature progress {% endcomment %}
{% assign launch_features   = site.data.features | where: "roadmap", false %}
{% assign done_features     = launch_features | where: "dev_status.released", true %}

{% comment %} Task progress {% endcomment %}
{% assign all_tasks         = site.data.tasks %}
{% assign done_tasks        = all_tasks | where: "status", "done" %}
{% assign blocked_tasks     = all_tasks | where: "status", "blocked" %}

{% comment %} Section: product tasks {% endcomment %}
{% assign product_tasks     = all_tasks | where: "section", "product" %}
{% assign product_done      = product_tasks | where: "status", "done" %}

{% comment %} Website section {% endcomment %}
{% assign website_pages     = site.data.website.pages %}
{% assign website_pages_done = website_pages | where: "status", "live" %}
{% assign blog_posts        = site.data.website.blog.posts %}
{% assign blog_published    = blog_posts | where: "status", "published" %}
{% assign docs_items        = site.data.website.docs %}
{% assign docs_done         = docs_items | where: "status", "done" %}
{% assign website_total     = website_pages.size | plus: blog_posts.size | plus: docs_items.size %}
{% assign website_done      = website_pages_done.size | plus: blog_published.size | plus: docs_done.size %}

{% comment %} Marketing section {% endcomment %}
{% assign marketing_assets   = site.data.marketing.assets %}
{% assign marketing_channels = site.data.marketing.channels %}
{% assign marketing_done_a   = marketing_assets | where: "status", "done" %}
{% assign marketing_done_c   = marketing_channels | where: "status", "done" %}
{% assign marketing_total    = marketing_assets.size | plus: marketing_channels.size %}
{% assign marketing_done     = marketing_done_a.size | plus: marketing_done_c.size %}

{% comment %} Admin section {% endcomment %}
{% assign admin_items       = site.data.admin %}
{% assign admin_done        = admin_items | where: "status", "done" %}

{% comment %} Overall: features + all tasks combined {% endcomment %}
{% assign total_items = launch_features.size | plus: all_tasks.size %}
{% assign done_items  = done_features.size   | plus: done_tasks.size %}
{% assign overall_pct = done_items | times: 100 | divided_by: total_items %}

{% comment %} Per-section percentages {% endcomment %}
{% assign feature_pct = done_features.size | times: 100 | divided_by: launch_features.size %}

{% assign product_pct = 0 %}
{% if product_tasks.size > 0 %}
  {% assign product_pct = product_done.size | times: 100 | divided_by: product_tasks.size %}
{% endif %}

{% assign website_pct = 0 %}
{% if website_total > 0 %}
  {% assign website_pct = website_done | times: 100 | divided_by: website_total %}
{% endif %}

{% assign marketing_pct = 0 %}
{% if marketing_total > 0 %}
  {% assign marketing_pct = marketing_done | times: 100 | divided_by: marketing_total %}
{% endif %}

{% assign admin_pct = 0 %}
{% if admin_items.size > 0 %}
  {% assign admin_pct = admin_done.size | times: 100 | divided_by: admin_items.size %}
{% endif %}

<!-- Launch hero strip -->
<div class="launch-hero">
  <div class="target">
    <div class="label">Target</div>
    <div class="value">{{ site.data.milestones.launch.target_date }}</div>
    <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">v{{ site.data.milestones.launch.version }}</div>
  </div>

  <div class="readiness">
    <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--text-muted); margin-bottom:10px;">Overall launch readiness</div>
    <div style="display:flex; align-items:center; gap:16px;">
      <canvas id="readinessChart" width="80" height="80" style="flex-shrink:0;"></canvas>
      <div style="flex:1;">
        {% include progress_bar.html done=done_features.size total=launch_features.size label="Features released" %}
        <div style="margin-top:10px;">
          {% include progress_bar.html done=done_tasks.size total=all_tasks.size label="Tasks complete" %}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Section stat cards -->
<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-value">{{ feature_pct }}%</div>
    <div class="stat-label">Features released</div>
    <div style="margin-top:10px;">
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ feature_pct }}%;"></div></div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-value">{{ product_pct }}%</div>
    <div class="stat-label">Product tasks done</div>
    <div style="margin-top:10px;">
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ product_pct }}%;"></div></div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-value">{{ website_pct }}%</div>
    <div class="stat-label">Website ready</div>
    <div style="margin-top:10px;">
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ website_pct }}%;"></div></div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-value">{{ marketing_pct }}%</div>
    <div class="stat-label">Marketing ready</div>
    <div style="margin-top:10px;">
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ marketing_pct }}%;"></div></div>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-value">{{ admin_pct }}%</div>
    <div class="stat-label">Admin & legal done</div>
    <div style="margin-top:10px;">
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ admin_pct }}%;"></div></div>
    </div>
  </div>
</div>

---

## Blockers

{% if blocked_tasks.size > 0 %}
<div class="blocker-list">
  <div class="blocker-title">{{ blocked_tasks.size }} blocker{{ blocked_tasks.size | minus: 1 | floor | times: 0 }}{% if blocked_tasks.size > 1 %}s{% endif %} need attention</div>
  <ul>
    {% for task in blocked_tasks %}
    <li>
      <strong>{{ task.name }}</strong>
      {% if task.notes and task.notes != "" %} — {{ task.notes }}{% endif %}
      {% if task.blocked_by and task.blocked_by != "" %}
        <span style="color:var(--text-muted); font-size:12px;">(waiting on: {{ task.blocked_by }})</span>
      {% endif %}
    </li>
    {% endfor %}
  </ul>
</div>
{% else %}
<div class="blocker-list empty">
  <div class="blocker-title">No blockers</div>
  <ul><li style="color:#1A7A57;">All tasks are unblocked.</li></ul>
</div>
{% endif %}

---

## Post-launch Roadmap

<table class="dash-table">
  <thead>
    <tr>
      <th>Feature</th>
      <th>Tier</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    {% for item in site.data.milestones.post_launch_roadmap %}
    <tr>
      <td class="col-name">{{ item.name }}</td>
      <td><span class="badge badge-roadmap">{{ item.tier | replace: '_', ' ' | capitalize }}</span></td>
      <td class="col-notes">{{ item.notes | default: "—" }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>

---

<p style="font-size:12px; color:var(--text-muted);">Dashboard built {{ site.time | date: "%B %d, %Y at %H:%M UTC" }}. Numbers update on every push.</p>

<script>
renderReadinessChart('readinessChart', {{ overall_pct }});
</script>

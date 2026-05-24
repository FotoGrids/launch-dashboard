---
layout: dashboard
title: Overview
---

<h1>Launch Overview</h1>
<p class="page-subtitle">FotoGrids v{{ site.data.milestones.launch.version }} · Target: {{ site.data.milestones.launch.target_date }}</p>

{% comment %} ── Calculate overall readiness ────────────────────────────────── {% endcomment %}

{% assign launch_features    = site.data.features | where: "roadmap", false %}
{% assign done_features      = launch_features | where: "dev_status.released", true %}

{% assign all_tasks          = site.data.tasks %}
{% assign done_tasks         = all_tasks | where: "status", "done" %}
{% assign blocked_tasks      = all_tasks | where: "status", "blocked" %}

{% assign product_tasks      = all_tasks | where: "section", "product" %}
{% assign product_done       = product_tasks | where: "status", "done" %}

{% assign website_pages      = site.data.website.pages %}
{% assign website_pages_done = website_pages | where: "status", "live" %}

{% comment %} Blog: walk blog_sections to count articles by status {% endcomment %}
{% assign blog_sections   = site.data.blog.blog_sections %}
{% assign blog_total      = 0 %}
{% assign blog_published  = 0 %}
{% for section in blog_sections %}
  {% assign sect_live    = section.articles | where: "status", "live" %}
  {% assign blog_total     = blog_total | plus: section.articles.size %}
  {% assign blog_published = blog_published | plus: sect_live.size %}
{% endfor %}

{% comment %} Docs: walk doc_sections to count articles by status {% endcomment %}
{% assign doc_sections    = site.data.documentation.doc_sections %}
{% assign docs_total      = 0 %}
{% assign docs_done       = 0 %}
{% for section in doc_sections %}
  {% assign sect_live    = section.articles | where: "status", "live" %}
  {% assign docs_total     = docs_total | plus: section.articles.size %}
  {% assign docs_done      = docs_done | plus: sect_live.size %}
{% endfor %}

{% assign website_total      = website_pages.size | plus: blog_total | plus: docs_total %}
{% assign website_done       = website_pages_done.size | plus: blog_published | plus: docs_done %}

{% assign marketing_assets   = site.data.marketing.assets %}
{% assign marketing_channels = site.data.marketing.channels %}
{% assign marketing_done_a   = marketing_assets | where: "status", "done" %}
{% assign marketing_done_c   = marketing_channels | where: "status", "done" %}
{% assign marketing_total    = marketing_assets.size | plus: marketing_channels.size %}
{% assign marketing_done     = marketing_done_a.size | plus: marketing_done_c.size %}

{% assign admin_items        = site.data.admin %}
{% assign legal_items        = admin_items | where: "category", "Legal" %}
{% assign legal_done         = legal_items | where: "status", "done" %}
{% assign admin_ops_total    = 0 %}
{% assign admin_ops_done     = 0 %}
{% for item in admin_items %}
  {% unless item.category == "Legal" %}
    {% assign admin_ops_total = admin_ops_total | plus: 1 %}
    {% if item.status == "done" %}
      {% assign admin_ops_done = admin_ops_done | plus: 1 %}
    {% endif %}
  {% endunless %}
{% endfor %}

{% assign total_items  = launch_features.size | plus: all_tasks.size %}
{% assign done_items   = done_features.size   | plus: done_tasks.size %}
{% assign overall_pct  = done_items | times: 100 | divided_by: total_items %}
{% assign feature_pct  = done_features.size | times: 100 | divided_by: launch_features.size %}

{% assign product_pct = 0 %}
{% if product_tasks.size > 0 %}{% assign product_pct = product_done.size | times: 100 | divided_by: product_tasks.size %}{% endif %}

{% assign website_pct = 0 %}
{% if website_total > 0 %}{% assign website_pct = website_done | times: 100 | divided_by: website_total %}{% endif %}

{% assign website_pages_pct = 0 %}
{% if website_pages.size > 0 %}{% assign website_pages_pct = website_pages_done.size | times: 100 | divided_by: website_pages.size %}{% endif %}
{% assign docs_pct = 0 %}
{% if docs_total > 0 %}{% assign docs_pct = docs_done | times: 100 | divided_by: docs_total %}{% endif %}
{% assign blog_pct = 0 %}
{% if blog_total > 0 %}{% assign blog_pct = blog_published | times: 100 | divided_by: blog_total %}{% endif %}

{% assign marketing_pct = 0 %}
{% if marketing_total > 0 %}{% assign marketing_pct = marketing_done | times: 100 | divided_by: marketing_total %}{% endif %}

{% assign admin_pct = 0 %}
{% if admin_ops_total > 0 %}{% assign admin_pct = admin_ops_done | times: 100 | divided_by: admin_ops_total %}{% endif %}

{% assign legal_pct = 0 %}
{% if legal_items.size > 0 %}{% assign legal_pct = legal_done.size | times: 100 | divided_by: legal_items.size %}{% endif %}

{% comment %} Per-section: split features into free vs pro for the chart {% endcomment %}
{% assign free_features      = launch_features | where: "tier", "free" %}
{% assign free_done          = free_features | where: "dev_status.released", true %}
{% assign pro_done_count = 0 %}
{% assign pro_total_count = 0 %}
{% for f in launch_features %}
  {% unless f.tier == 'free' %}
    {% assign pro_total_count = pro_total_count | plus: 1 %}
    {% if f.dev_status.released %}{% assign pro_done_count = pro_done_count | plus: 1 %}{% endif %}
  {% endunless %}
{% endfor %}

{% assign free_pct = 0 %}
{% if free_features.size > 0 %}{% assign free_pct = free_done.size | times: 100 | divided_by: free_features.size %}{% endif %}
{% assign pro_pct = 0 %}
{% if pro_total_count > 0 %}{% assign pro_pct = pro_done_count | times: 100 | divided_by: pro_total_count %}{% endif %}

<div class="overview-top-row">
  <div class="launch-hero">
    <div class="readiness">
      <canvas id="readinessChart"></canvas>
    </div>
  </div>

  <div class="stat-grid stat-grid--side">
    <div class="stat-card" data-accent="free">
      <div class="stat-value">{{ free_pct }}%</div>
      <div class="stat-label">Free Features released</div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ free_pct }}%;"></div></div>
    </div>
    <div class="stat-card" data-accent="pro">
      <div class="stat-value">{{ pro_pct }}%</div>
      <div class="stat-label">Pro Features released</div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ pro_pct }}%;"></div></div>
    </div>
    <div class="stat-card" data-accent="product">
      <div class="stat-value">{{ product_pct }}%</div>
      <div class="stat-label">Product tasks done</div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ product_pct }}%;"></div></div>
    </div>
    <div class="stat-card" data-accent="wpages">
      <div class="stat-value">{{ website_pages_pct }}%</div>
      <div class="stat-label">Website pages ready</div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ website_pages_pct }}%;"></div></div>
    </div>
    <div class="stat-card" data-accent="docs">
      <div class="stat-value">{{ docs_pct }}%</div>
      <div class="stat-label">Documentation</div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ docs_pct }}%;"></div></div>
    </div>
    <div class="stat-card" data-accent="blog">
      <div class="stat-value">{{ blog_pct }}%</div>
      <div class="stat-label">Blog articles written</div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ blog_pct }}%;"></div></div>
    </div>
    <div class="stat-card" data-accent="mktg">
      <div class="stat-value">{{ marketing_pct }}%</div>
      <div class="stat-label">Marketing ready</div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ marketing_pct }}%;"></div></div>
    </div>
    <div class="stat-card" data-accent="admin">
      <div class="stat-value">{{ admin_pct }}%</div>
      <div class="stat-label">Admin tasks done</div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ admin_pct }}%;"></div></div>
    </div>
    <div class="stat-card" data-accent="legal">
      <div class="stat-value">{{ legal_pct }}%</div>
      <div class="stat-label">Legal tasks done</div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:{{ legal_pct }}%;"></div></div>
    </div>
  </div>
</div>

---

## Launch Roadmap

<div class="roadmap-grid">
  <div class="roadmap-card">
    <div class="roadmap-number">1</div>
    <div class="roadmap-content">
      <div class="roadmap-stage-top">
        <div class="roadmap-stage">Stage 1</div>
        <div class="roadmap-date">July 2026</div>
      </div>
      <div class="roadmap-title">
        <span class="roadmap-tier-pill roadmap-tier-pill--free">Free</span>
        <span class="roadmap-tier-text">Version</span>
      </div>
      <p class="roadmap-requirements-title">Requirements</p>
      <ul class="roadmap-list">
        <li>Free-tier features released and stable.</li>
        <li>Plugin approved on WordPress.org.</li>
        <li>Home, Features, and Pricing pages live.</li>
        <li>ToS and Privacy Policy published.</li>
        <li>Core infrastructure live.</li>
        <li>Docs written for all Free features.</li>
        <li>10+ blog posts published.</li>
      </ul>
    </div>
  </div>

  <div class="roadmap-card">
    <div class="roadmap-number">2</div>
    <div class="roadmap-content">
      <div class="roadmap-stage-top">
        <div class="roadmap-stage">Stage 2</div>
        <div class="roadmap-date">August 2026</div>
      </div>
      <div class="roadmap-title">
        <span class="roadmap-tier-pill roadmap-tier-pill--starter">Pro</span>
        <span class="roadmap-tier-text">Starter Version</span>
      </div>
      <p class="roadmap-requirements-title">Requirements</p>
      <ul class="roadmap-list">
        <li>Pro Starter features released and stable.</li>
        <li>Freemius payments and licensing live.</li>
        <li>Refund policy, GDPR, cookie banner.</li>
        <li>Product Hunt launch kit ready.</li>
        <li>Launch email and social posts ready.</li>
        <li>Docs written for all Pro Starter features.</li>
        <li>Affiliate program live.</li>
        <li>20+ blog posts published.</li>
      </ul>
    </div>
  </div>

  <div class="roadmap-card">
    <div class="roadmap-number">3</div>
    <div class="roadmap-content">
      <div class="roadmap-stage-top">
        <div class="roadmap-stage">Stage 3</div>
        <div class="roadmap-date">October 2026</div>
      </div>
      <div class="roadmap-title">
        <span class="roadmap-tier-pill roadmap-tier-pill--plus">Pro</span>
        <span class="roadmap-tier-text">Plus Version</span>
      </div>
      <p class="roadmap-requirements-title">Requirements</p>
      <ul class="roadmap-list">
        <li>Pro Plus features released and stable.</li>
        <li>E-Commerce and external integrations ready.</li>
        <li>CDN setup ready, pricing is set.</li>
        <li>Docs written for all Pro Plus features.</li>
        <li>40+ blog posts published.</li>
      </ul>
    </div>
  </div>

  <div class="roadmap-card">
    <div class="roadmap-number">4</div>
    <div class="roadmap-content">
      <div class="roadmap-stage-top">
        <div class="roadmap-stage">Stage 4</div>
        <div class="roadmap-date">December 2026</div>
      </div>
      <div class="roadmap-title">
        <span class="roadmap-tier-pill roadmap-tier-pill--agency">Pro</span>
        <span class="roadmap-tier-text">Agency Version</span>
      </div>
      <p class="roadmap-requirements-title">Requirements</p>
      <ul class="roadmap-list">
        <li>Site management and white-label mode ready.</li>
        <li>WordPress Multisite fully tested at scale.</li>
        <li>Agency-specific onboarding and docs complete, support is ready.</li>
        <li>60+ blog posts published.</li>
      </ul>
    </div>
  </div>
</div>

---

## Blockers

{% if blocked_tasks.size > 0 %}
<div class="blocker-list">
  <div class="blocker-title">{{ blocked_tasks.size }} blocker{% if blocked_tasks.size > 1 %}s{% endif %} need attention</div>
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

<div class="table-scroll">
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
      <td>
        {% assign t = item.tier %}
        {% if t == 'pro_starter' %}<span class="tier-pill tier-starter"><span class="pro-tag">PRO</span><span class="tier-name">Starter</span></span>
        {% elsif t == 'pro_plus' %}<span class="tier-pill tier-plus"><span class="pro-tag">PRO</span><span class="tier-name">Plus</span></span>
        {% elsif t == 'agency' %}<span class="tier-pill tier-agency"><span class="pro-tag">PRO</span><span class="tier-name">Agency</span></span>
        {% elsif t == 'free' %}<span class="tier-pill tier-free">FREE</span>
        {% else %}<span class="tier-pill tier-addon">{{ t }}</span>{% endif %}
      </td>
      <td class="col-notes">{{ item.notes | default: "—" }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>
</div>

---

<p class="dash-timestamp">Last updated: <span class="il-time">{{ site.time | date: "%b %d, %Y" }}</span> — numbers update on every push.</p>

<script>
renderReadinessChart('readinessChart', [
  { label: 'Free Features',    pct: {{ free_pct }} },
  { label: 'PRO Features',     pct: {{ pro_pct }} },
  { label: 'Product Tasks',    pct: {{ product_pct }} },
  { label: 'Website Pages Ready',   pct: {{ website_pages_pct }} },
  { label: 'Documentation',         pct: {{ docs_pct }} },
  { label: 'Blog Articles Written', pct: {{ blog_pct }} },
  { label: 'Marketing',        pct: {{ marketing_pct }} },
  { label: 'Admin Tasks',      pct: {{ admin_pct }} },
  { label: 'Legal Tasks',      pct: {{ legal_pct }} },
]);
</script>

---
layout: dashboard
title: Metrics
---

<h1>Metrics</h1>
<p class="page-subtitle">Live numbers — updated manually in <code>_data/metrics.yaml</code> after each check-in.</p>

{% assign m = site.data.metrics %}

<div class="metric-group">
  <h2>Plugin</h2>
  <div class="stat-grid">
    {% assign free_installs = m.plugin.free_installs | default: 0 %}
    {% assign active_installs = m.plugin.active_installs | default: 0 %}
    {% assign wp_reviews = m.plugin.wp_org_reviews | default: 0 %}

    <div class="stat-card highlight">
      <div class="stat-value">{% if free_installs == 0 %}—{% else %}{{ free_installs }}{% endif %}</div>
      <div class="stat-label">Free installs</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{% if active_installs == 0 %}—{% else %}{{ active_installs }}{% endif %}</div>
      <div class="stat-label">Active installs</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">
        {% if m.plugin.wp_org_rating %}{{ m.plugin.wp_org_rating }}/5{% else %}—{% endif %}
      </div>
      <div class="stat-label">WP.org rating</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{% if wp_reviews == 0 %}—{% else %}{{ wp_reviews }}{% endif %}</div>
      <div class="stat-label">WP.org reviews</div>
    </div>
  </div>
</div>

<div class="metric-group">
  <h2>Revenue</h2>
  <div class="stat-grid">
    {% assign mrr = m.revenue.mrr | default: 0 %}
    {% assign pro_s = m.revenue.pro_starter_subscribers | default: 0 %}
    {% assign pro_p = m.revenue.pro_plus_subscribers | default: 0 %}
    {% assign agency = m.revenue.agency_subscribers | default: 0 %}
    {% assign addon  = m.revenue.addon_revenue | default: 0 %}

    <div class="stat-card highlight">
      <div class="stat-value">{% if mrr == 0 %}—{% else %}${{ mrr }}{% endif %}</div>
      <div class="stat-label">MRR</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{% if pro_s == 0 %}—{% else %}{{ pro_s }}{% endif %}</div>
      <div class="stat-label">Pro Starter subscribers</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{% if pro_p == 0 %}—{% else %}{{ pro_p }}{% endif %}</div>
      <div class="stat-label">Pro Plus subscribers</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{% if agency == 0 %}—{% else %}{{ agency }}{% endif %}</div>
      <div class="stat-label">Agency subscribers</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{% if addon == 0 %}—{% else %}${{ addon }}{% endif %}</div>
      <div class="stat-label">Add-on revenue</div>
    </div>
  </div>
</div>

<div class="metric-group">
  <h2>Website</h2>
  <div class="stat-grid">
    {% assign visitors = m.website.monthly_visitors | default: 0 %}
    {% assign organic  = m.website.blog_organic_sessions | default: 0 %}
    {% assign subs     = m.website.email_subscribers | default: 0 %}

    <div class="stat-card highlight">
      <div class="stat-value">{% if visitors == 0 %}—{% else %}{{ visitors }}{% endif %}</div>
      <div class="stat-label">Monthly visitors</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{% if organic == 0 %}—{% else %}{{ organic }}{% endif %}</div>
      <div class="stat-label">Blog organic sessions</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{% if subs == 0 %}—{% else %}{{ subs }}{% endif %}</div>
      <div class="stat-label">Email subscribers</div>
    </div>
  </div>
</div>

<p style="font-size:12px; color:var(--text-muted); margin-top:8px;">
  All metrics show <strong>—</strong> until launch. Update <code>_data/metrics.yaml</code> after each weekly check-in.
</p>

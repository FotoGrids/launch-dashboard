---
layout: dashboard
title: Admin & Legal
---

<h1>Admin & Legal</h1>
<p class="page-subtitle">Infrastructure, legal, and company setup tasks.</p>

{% assign admin_items = site.data.admin %}
{% assign admin_done  = admin_items | where: "status", "done" %}

<div class="stat-grid">
  {% include stat_card.html value=admin_done.size label="Items complete" highlight=true %}
  {% assign admin_wip = admin_items | where: "status", "in_progress" %}
  {% include stat_card.html value=admin_wip.size label="In progress" %}
  {% assign admin_plan = admin_items | where: "status", "planned" %}
  {% include stat_card.html value=admin_plan.size label="Not started" %}
  {% include stat_card.html value=admin_items.size label="Total items" %}
</div>

{% include progress_bar.html done=admin_done.size total=admin_items.size label="Admin & legal complete" %}

{% assign categories = admin_items | map: "category" | uniq %}

{% for cat in categories %}
<div class="section">
  <h2>{{ cat }}</h2>
  {% assign cat_items = admin_items | where: "category", cat %}
  <div class="checklist">
    {% for item in cat_items %}
    <div class="checklist-item {{ item.status }}">
      <div class="check-icon"></div>
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

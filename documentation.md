---
layout: dashboard
title: Documentation
---

<h1>Documentation</h1>
<p class="page-subtitle">Article coverage across all docs sections.</p>

{% assign doc_sections = site.data.documentation.doc_sections %}
{% assign docs_live  = 0 %}
{% assign docs_wip   = 0 %}
{% assign docs_plan  = 0 %}
{% assign docs_total = 0 %}
{% for section in doc_sections %}
  {% assign sect_live = section.articles | where: "status", "live" %}
  {% assign sect_wip  = section.articles | where: "status", "in_progress" %}
  {% assign sect_plan = section.articles | where: "status", "planned" %}
  {% assign docs_live  = docs_live  | plus: sect_live.size %}
  {% assign docs_wip   = docs_wip   | plus: sect_wip.size %}
  {% assign docs_plan  = docs_plan  | plus: sect_plan.size %}
  {% assign docs_total = docs_total | plus: section.articles.size %}
{% endfor %}

<div class="stat-grid">
  {% include stat_card.html value=docs_live label="Articles live" highlight=true %}
  {% include stat_card.html value=docs_wip  label="In progress" %}
  {% include stat_card.html value=docs_plan label="Planned" %}
  {% include stat_card.html value=docs_total label="Total articles" %}
</div>

{% include progress_bar.html done=docs_live total=docs_total label="Documentation complete" %}

{% for section in doc_sections %}
### {{ section.name }}

<div class="table-scroll">
<table class="dash-table">
  <thead>
    <tr>
      <th style="text-align:left;">Article</th>
      <th>Status</th>
      <th style="text-align:left;">URL</th>
      <th style="text-align:left;">Notes</th>
    </tr>
  </thead>
  <tbody>
    {% for article in section.articles %}
    <tr>
      <td class="col-name">{{ article.title }}</td>
      <td>{% include status_badge.html status=article.status %}</td>
      <td style="text-align:left;">
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

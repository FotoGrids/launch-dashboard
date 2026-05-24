---
layout: dashboard
title: Blog
---

<h1>Blog</h1>
<p class="page-subtitle">60 articles across 7 topical clusters at <a href="https://www.fotogrids.com/blog/" target="_blank">fotogrids.com/blog</a>.</p>

{% assign blog_sections = site.data.blog.blog_sections %}
{% assign blog_target   = site.data.blog.target %}
{% assign blog_live  = 0 %}
{% assign blog_review = 0 %}
{% assign blog_draft = 0 %}
{% assign blog_plan  = 0 %}
{% assign blog_total = 0 %}
{% for section in blog_sections %}
  {% assign sect_live   = section.articles | where: "status", "live" %}
  {% assign sect_review = section.articles | where: "status", "in_review" %}
  {% assign sect_draft  = section.articles | where: "status", "drafting" %}
  {% assign sect_plan   = section.articles | where: "status", "planned" %}
  {% assign blog_live   = blog_live   | plus: sect_live.size %}
  {% assign blog_review = blog_review | plus: sect_review.size %}
  {% assign blog_draft  = blog_draft  | plus: sect_draft.size %}
  {% assign blog_plan   = blog_plan   | plus: sect_plan.size %}
  {% assign blog_total  = blog_total  | plus: section.articles.size %}
{% endfor %}

<div class="stat-grid">
  {% include stat_card.html value=blog_live   label="Articles live" highlight=true %}
  {% include stat_card.html value=blog_review label="In review" %}
  {% include stat_card.html value=blog_draft  label="Drafting" %}
  {% include stat_card.html value=blog_plan   label="Planned" %}
  {% include stat_card.html value=blog_total  label="Total articles" %}
</div>

{% include progress_bar.html done=blog_live total=blog_target label="Blog articles live toward launch target" %}

{% for section in blog_sections %}
### Cluster {{ section.cluster }} — {{ section.name }}
<p style="margin:-4px 0 12px 0; color:var(--text-muted); font-size:13px;">Lead persona: {{ section.persona }} · {{ section.articles.size }} articles</p>

<div class="table-scroll">
<table class="dash-table">
  <thead>
    <tr>
      <th class="col-left">Article</th>
      <th>Type</th>
      <th>Status</th>
      <th class="col-left">URL</th>
    </tr>
  </thead>
  <tbody>
    {% for article in section.articles %}
    <tr>
      <td class="col-name">{{ article.title }}</td>
      <td style="font-size:12px; color:var(--text-muted);">{{ article.type }}</td>
      <td>{% include status_badge.html status=article.status %}</td>
      <td class="col-left">
        {% if article.url and article.url != "" %}
          <a href="{{ article.url }}" target="_blank" style="font-size:12px; color:var(--text-muted);">{{ article.url }}</a>
        {% else %}
          <span style="font-size:12px; color:var(--text-muted);">—</span>
        {% endif %}
      </td>
    </tr>
    {% endfor %}
  </tbody>
</table>
</div>
{% endfor %}

---
layout: dashboard
title: Website
---

<h1>Website</h1>
<p class="page-subtitle">Pages, blog content, and documentation coverage.</p>

{% assign pages        = site.data.website.pages %}
{% assign pages_live   = pages | where: "status", "live" %}
{% assign pages_wip    = pages | where: "status", "in_progress" %}
{% assign pages_planned = pages | where: "status", "planned" %}

<div class="stat-grid">
  {% include stat_card.html value=pages_live.size label="Pages live" highlight=true %}
  {% include stat_card.html value=pages_wip.size label="In progress" %}
  {% include stat_card.html value=pages_planned.size label="Planned" %}
</div>

{% include progress_bar.html done=pages_live.size total=pages.size label="Pages live" %}

## Pages

<div class="table-scroll">
<table class="dash-table">
  <thead>
    <tr>
      <th style="text-align:left;">Page</th>
      <th>Status</th>
      <th style="text-align:left;">URL</th>
      <th style="text-align:left;">Notes</th>
    </tr>
  </thead>
  <tbody>
    {% for page in site.data.website.pages %}
    <tr>
      <td class="col-name">{{ page.name }}</td>
      <td>{% include status_badge.html status=page.status %}</td>
      <td style="text-align:left;">
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

---

## Blog

{% assign posts        = site.data.website.blog.posts %}
{% assign blog_target  = site.data.website.blog.target %}
{% assign published    = posts | where: "status", "published" %}
{% assign drafted      = posts | where: "status", "drafted" %}
{% assign planned_posts = posts | where: "status", "planned" %}

<div class="stat-grid">
  {% include stat_card.html value=published.size label="Posts published" highlight=true %}
  {% include stat_card.html value=drafted.size label="Drafted" %}
  {% include stat_card.html value=planned_posts.size label="Planned" %}
  {% include stat_card.html value=blog_target label="Target at launch" %}
</div>

{% include progress_bar.html done=published.size total=blog_target label="Blog posts published toward launch target" %}

<div class="table-scroll">
<table class="dash-table">
  <thead>
    <tr>
      <th style="text-align:left;">Post title</th>
      <th>Status</th>
      <th style="text-align:left;">URL</th>
    </tr>
  </thead>
  <tbody>
    {% for post in posts %}
    <tr>
      <td class="col-name">{{ post.title }}</td>
      <td>{% include status_badge.html status=post.status %}</td>
      <td style="text-align:left;">
        {% if post.url and post.url != "" %}
          <a href="{{ post.url }}" style="font-size:12px; color:var(--text-muted);">{{ post.url }}</a>
        {% else %}
          <span style="font-size:12px; color:var(--text-muted);">—</span>
        {% endif %}
      </td>
    </tr>
    {% endfor %}
  </tbody>
</table>
</div>

---

## Documentation Coverage

{% assign doc_sections = site.data.website.doc_sections %}
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

---
layout: dashboard
title: Website
---

<h1>Website</h1>
<p class="page-subtitle">Marketing-site pages. Blog and Documentation now have dedicated pages.</p>

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
      <th class="col-left">Page</th>
      <th>Status</th>
      <th class="col-left">URL</th>
      <th class="col-left">Notes</th>
    </tr>
  </thead>
  <tbody>
    {% for page in site.data.website.pages %}
    <tr>
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

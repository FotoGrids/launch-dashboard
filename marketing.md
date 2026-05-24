---
layout: dashboard
title: Marketing
---

<h1>Marketing</h1>
<p class="page-subtitle">Launch assets and channel readiness.</p>

{% assign assets   = site.data.marketing.assets %}
{% assign channels = site.data.marketing.channels %}
{% assign a_done   = assets   | where: "status", "done" %}
{% assign c_done   = channels | where: "status", "done" %}

<div class="stat-grid">
  {% include stat_card.html value=a_done.size label="Assets ready" highlight=true %}
  {% include stat_card.html value=assets.size label="Total assets" %}
  {% include stat_card.html value=c_done.size label="Channels live" highlight=false %}
  {% include stat_card.html value=channels.size label="Total channels" %}
</div>

{% include progress_bar.html done=a_done.size total=assets.size label="Assets complete" %}
{% include progress_bar.html done=c_done.size total=channels.size label="Channels ready" %}

---

## Assets

<div class="table-scroll">
<table class="dash-table">
  <thead>
    <tr>
      <th class="col-left">Asset</th>
      <th>Status</th>
      <th class="col-left">Notes</th>
    </tr>
  </thead>
  <tbody>
    {% for asset in assets %}
    <tr>
      <td class="col-name">{{ asset.name }}</td>
      <td>{% include status_badge.html status=asset.status %}</td>
      <td class="col-notes">{{ asset.notes | default: "—" }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>
</div>

---

## Channels

<div class="checklist">
  {% for channel in channels %}
  <div class="checklist-item {{ channel.status }}">
    <div class="check-icon"></div>
    <div class="item-name">{{ channel.name }}</div>
    {% if channel.notes and channel.notes != "" %}
    <div class="item-notes">{{ channel.notes }}</div>
    {% endif %}
    {% include status_badge.html status=channel.status %}
  </div>
  {% endfor %}
</div>

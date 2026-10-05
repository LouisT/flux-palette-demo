---
title: "Feature Demo: Cloud Page"
date: 2026-01-01 12:00:06
tags: [feature, cloud, guide]
categories: [Features]
description: "Explore category cards and weighted tags with instant topic filtering and sorting"
---

The **Cloud** page gives you a quick visual map of your site taxonomy in one place.

It includes two sections:

1. **Category cards** with article counts and links to their archives
2. **Weighted tag chips** with readable count badges

Category cards use consistent typography, while popular tags appear larger. Use **Find a topic** to filter names instantly and **Sort topics** to browse by popularity or alphabetically. **Clear search** restores every topic. These controls work locally and make no search API requests; all archive links also work without JavaScript.

## Where to find it

Open the Cloud page here: [/cloud/](/cloud/)

You can still browse the full archive lists directly:

- Categories: [/categories/](/categories/)
- Tags: [/tags/](/tags/)

## Cloud settings

Configure it in your site's `_config.flux-palette.yml` under `cloud`:

```yml
cloud:
  enabled: true
  path: cloud/
  title: "Cloud"
  sort_by: count
  sort_order: desc
  min_size: 0.95
  max_size: 2.2
  controls:
    enabled: true
  categories:
    enabled: true
    title: "Categories"
  tags:
    enabled: true
    title: "Tags"
```

If you only want one section, disable the other with `enabled: false`.
Set `cloud.controls.enabled: false` to keep the new layout without filtering and sorting. The size settings apply to tags; filtering does not change their weights or article counts.

## Why use it

A cloud view helps readers discover topic clusters faster than scrolling long alphabetical lists, especially once a site has many categories and tags.

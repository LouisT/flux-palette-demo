---
title: "Publish your site safely"
date: 2026-10-01 12:00:03
tags: [demo, guide]
categories: [Guides]
description: "The theme uses local search by default, so a fresh site can build without a database account."
series: getting-started
series_order: 3
pinned: 1
---

The theme uses local search by default, so a fresh site can build without a database account.

<!-- more -->

## Configure remote search

If you select a remote provider, reference credentials with `env:VARIABLE` in `_config.flux-palette.yml`. Copy `.env.example` to `.env` for local development; Flux Palette loads the site's root `.env` when Hexo starts, while existing shell and CI variables take precedence. Only publishable or read-only credentials belong in browser configuration. Keep write credentials in your CI secret store.

## Check the output

Run the theme tests and generated-link checker before publishing. Keep site preferences in `_config.flux-palette.yml`. The staged update tool installs new theme defaults, keeps your site configuration outside the replaced directory, and stops when it detects customized theme files.

## Protect private content

Password-protected bodies and images are encrypted during generation. Titles and taxonomy remain public, so choose those fields accordingly.

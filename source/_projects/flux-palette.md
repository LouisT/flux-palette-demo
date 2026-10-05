---
title: Flux Palette
date: 2026-01-01 12:00:00
weight: 100
featured: true
project_role: Theme design and development
project_stack: [Hexo, Alpine.js, SWC, Sharp]
project_status: Active
project_outcomes:
  - Multiple palettes with browser-local preferences
  - Responsive media and explicit offline reading
  - Local and remote search with public-only indexing
project_screenshots:
  - src: /images/flux-sample.svg
    alt: Flux Palette local demonstration illustration
    caption: A local illustration shared by the theme's feature demos.
project_tags: [hexo, theme, design, javascript]
project_summary: "The very theme you are looking at. A privacy-focused, colorful, and high-performance Hexo theme."
buttons:
  - name: Live Demo
    url: https://flux-palette.louist.dev/
  - name: GitHub Repo
    url: https://github.com/LouisT/hexo-theme-flux-palette
---

Flux Palette is a modern Hexo theme designed for creators who want a personal blog that actually feels *personal*.

## The Concept

Most themes force you into a specific "Dark" or "Light" mode. Flux Palette embraces **choice**. With over 15 built-in color palettes and a dynamic "Flux" engine, users can customize the reading experience to match their mood.

## Technical Highlights

This project was built to solve several common issues with static site generators:

1.  **Privacy**: We implemented a client-side `AES-256-GCM` encryption system, allowing you to host password-protected content on public repositories safely.
2.  **Performance**: By using Alpine.js and pre-compiling assets with SWC, the theme remains incredibly lightweight despite its rich feature set.
3.  **Search**: It supports five search backends (Local, Redis, Supabase, Turso, Upstash Search) to scale from small personal blogs to large archives.

## Project System

This page itself is a demo of the **Projects System**. Unlike standard posts, projects have:

* **Weight-based sorting**: You can pin important projects (like this one) to the top.
* **Dedicated Front Matter**: Custom fields for `buttons`, `project_summary`, and `project_tags`.
* **Separate Index**: Keeps your portfolio distinct from your blog feed.

## Getting Started

You can install Flux Palette directly via npm or git. Check out the [documentation](https://github.com/LouisT/hexo-theme-flux-palette) for a full guide.

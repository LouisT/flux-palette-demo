---
title: "Feature Demo: Rich Content Elements"
date: 2026-01-01 12:00:01
tags: [demo, guide, markdown]
categories: [Features]
description: "A showcase of the interactive Markdown components available in Flux Palette: Alerts, Tabs, Accordions and more."
---

Flux Palette includes several custom tags to help you organize content and call attention to important information.

## Alerts (Admonitions)

Use alerts to highlight specific information. They support 5 types: `info`, `success`, `warning`, `danger`, and `tip`.

{% alert info "Did you know?" %}
Flux Palette calculates the read time for every post automatically. You can see it in the post metadata above!
{% endalert %}

{% alert tip "Pro Tip" %}
You can use **Markdown** inside these alerts, including links and `code` snippets.
{% endalert %}

{% alert warning %}
This is a warning without a custom title. It defaults to the type name.
{% endalert %}

{% alert danger "Critical Error" %}
Do not delete your `_config.yml` unless you know what you are doing.
{% endalert %}

## Tabbed Interfaces

Perfect for showing different versions of code or grouping related content without cluttering the page.

{% tabs %}
    {% tab "macOS" %}
    To install on macOS, use Homebrew:

    ```bash
    brew install hexo
    ```
    {% endtab %}

    {% tab "Windows" %}
    To install on Windows, use npm:

    ```powershell
    npm install -g hexo-cli
    ```
    {% endtab %}

    {% tab "Linux" %}
    On Linux, you can use your distribution's package manager or npm:

    ```bash
    sudo npm install -g hexo-cli
    ```
    {% endtab %}
{% endtabs %}

## Accordions

Collapsible sections are great for FAQs or spoilers.

{% accordions %}
    {% accordion "What is Flux Palette?" %}
    Flux Palette is a Hexo theme designed for performance, privacy, and multiple color schemes.
    {% endaccordion %}

    {% accordion "How do I change the color?" %}
    Check the sidebar! You can select from over 15 presets or define your own custom colors using the "Flux" option.
    {% endaccordion %}
{% endaccordions %}

## Spoiler/redact

You can hide content on a page with `spoiler`/`redact` tags. Such as: {% spoiler "This is a secret message!" %}

# Timelines

You can create project/history timelines with the `timeline` and `timeline_item` tags.

{% timeline %}
    {% timeline_item "Jan 2024" "Inception" %}
    The initial concept for the project was defined. We outlined the core goals and selected the technology stack.
    {% endtimeline_item %}

    {% timeline_item "Mar 2024" "Alpha Release" %}
    The first internal release was made available to the team.

    * Completed core engine
    * Added basic UI components
    {% endtimeline_item %}

    {% timeline_item "Present" "Public Beta" %}
    We are currently in public beta. Users can now sign up and test the application.
    {% endtimeline_item %}
{% endtimeline %}


## Step-by-step guides

{% steps id:setup track:true %}
{% step "Choose your palette" icon:info %}
Select a palette in the sidebar. Each step accepts **Markdown**.
{% endstep %}
{% step "Publish your article" icon:check %}
Preview your changes, then publish the generated site.
{% endstep %}
{% endsteps %}

## Content cards

{% cards %}
{% card "Explore the blog" url:/blog/ image:/images/flux-sample.svg alt:"Flux Palette sample" %}
Explore articles that use the theme's reading and content controls.
{% endcard %}
{% card "Reading list" url:/reading/ %}
Keep articles you want to revisit in one place.
{% endcard %}
{% endcards %}

## Comparison tables

{% comparison recommended:"Local" %}
| Feature | Local | Hosted |
| --- | --- | --- |
| Credentials | None | Required |
| Offline support | Available | Connection required |
{% endcomparison %}

## Before and after

These images live in the site's `source/images/` folder. Files for content belong outside the theme.

{% image_compare /images/rich-before.svg /images/rich-after.svg before_alt:"Original article layout" after_alt:"Improved article layout" %}

## Annotated code

{% annotated_code lang:js filename:hello.js highlight:2 %}
const name = 'Reader';
console.log('Hello, ' + name);
{% code_note "2" %}
This line prints the greeting. Copying the code excludes this explanation.
{% endcode_note %}
{% endannotated_code %}

## Mermaid diagrams

{% mermaid title:"Publishing workflow" %}
flowchart LR
    Write --> Preview --> Publish
{% endmermaid %}

## Math equations

Inline math: {% math inline %}a^2 + b^2 = c^2{% endmath %}.

{% math display %}
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
{% endmath %}

## Glossary popovers

A {% term "static site" "A website generated into files before visitors request its pages." %} can serve content quickly.

## Interactive checklists

{% checklist id:publish %}
- [ ] Review the article
- [ ] Check links and images
- [x] Choose a palette
{% endchecklist %}

## Figures and references

See {% figure_ref example %} for a local image example.

{% figure /images/flux-sample.svg "Flux Palette illustration" id:example credit:"Flux Palette" credit_url:https://github.com/LouisT/hexo-theme-flux-palette %}
A local figure with a **Markdown caption** and attribution.
{% endfigure %}

## Download cards

This attachment lives at `source/downloads/rich-content-guide.txt`. A post or project can also use a relative URL for a file in its own asset folder.

{% download /downloads/rich-content-guide.txt "Rich content authoring checklist" %}
A small text file you can keep next to your writing tools.
{% enddownload %}

## Pros and cons

{% proscons %}
{% pros %}
- Content stays in Markdown files.
- Components follow the selected palette.
{% endpros %}
{% cons %}
- Interactive controls require JavaScript.
- Publishing changes requires a build.
{% endcons %}
{% endproscons %}

---
title: "Feature Demo: Developer Embeds"
date: 2026-01-01 12:00:05
tags: [demo, embed, code]
categories: [Development]
description: "Examples for embedding GitHub Gist, JSFiddle, CodeSandbox, and TermBackTime recordings."
---

This post demonstrates the developer-focused embed providers:

* GitHub Gist
* JSFiddle
* CodeSandbox
* TermBackTime

Each example is shown with both the generic `{% embed %}` tag and the dedicated platform tag.

## GitHub Gist

Generic tag:

{% embed https://gist.github.com/LouisT/af9a8dd0399bfe5749953e576057f867 %}

Dedicated tag:

{% gist af9a8dd0399bfe5749953e576057f867 %}

## JSFiddle

Generic tag:

{% embed https://jsfiddle.net/mp9eb0s8/ %}

Dedicated tag:

{% jsfiddle mp9eb0s8 %}

## CodeSandbox

Generic tag:

{% embed https://codesandbox.io/p/sandbox/3q5z4v %}

Dedicated tag:

{% codesandbox 3q5z4v %}

## TermBackTime

Embed a terminal recording with its TermBackTime URL. The player loads when you click **Load TermBackTime** and starts paused.

Generic tag following the active palette:

{% embed https://termbackti.me/embed/LouisT/009c3960181c5c096db9115e881ceee5 start=1.5 %}

Dedicated tag with repository shorthand and a fixed light theme:

{% termbacktime LouisT/009c3960181c5c096db9115e881ceee5 start=1.5 theme=light %}

Pass player options as separate `key=value` arguments or in the URL query string. Separate arguments override URL options. Omit `theme` to follow the active palette's light/dark mode. A mode change reloads an automatic player at its configured start time; an explicit theme stays fixed.

Gist recordings also work: use their TermBackTime embed URL or pass the Gist ID to the dedicated tag. You can customize playback with the [documented query options](https://termbackti.me/docs/#embedding-on-third-party-websites). Only unencrypted recordings are supported, and embedding a secret Gist shares its contents with visitors.

---
title: "Feature Demo: Developer Embeds"
date: 2026-01-01 12:00:05
tags: [demo, embed, code]
categories: [Development]
description: "Examples for embedding GitHub Gist, JSFiddle, and CodeSandbox content."
---

This post demonstrates the three new developer-focused embed providers:

* GitHub Gist
* JSFiddle
* CodeSandbox

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

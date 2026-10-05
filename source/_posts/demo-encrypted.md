---
title: "Feature Demo: Password Protected Post (Password: flux)"
date: 2026-01-01 12:00:04
tags: [privacy, encryption]
categories: [Security]
password: "flux"
excerpt: "This post is protected by AES-256-GCM encryption. You need a password to decrypt it in the browser."
---

# Top Secret Content

If you are reading this, you have successfully decrypted the post!

Flux Palette uses **AES-256-GCM** to encrypt posts at build time. The server (or GitHub Pages) only ever hosts the encrypted blob. The decryption happens entirely in your browser using the Web Crypto API.

## Encrypted Images

Even images within the post are encrypted and loaded as blobs only after you unlock the post.

![Secret Plans](https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)

## How to use

Simply add a `password` field to your front matter:

```yml
---
title: My Secret Diary
date: 2025-10-30
password: "my-super-secret-password"
---
```
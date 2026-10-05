---
title: "Feature Demo: Media & Galleries"
date: 2026-01-01 12:00:02
tags: [media, photography, music]
categories: [Showcase]
---

Flux Palette makes it easy to embed rich media from around the web and display your own images beautifully.

## Image Gallery

The `gallery` tag creates a responsive grid. If enabled in the config, it auto-generates optimized thumbnails.

{% gallery %}
![Mountain View](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80 "Mountain View")
![City Lights](https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80 "City Lights")
![Forest Path](https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)
{% endgallery %}

*Click any image to open the Lightbox viewer.*

## Universal Embeds

You can embed content from YouTube, Spotify, Vimeo, Twitch, and TikTok using a single `{% embed %}` tag.

### YouTube
{% embed https://www.youtube.com/watch?v=dQw4w9WgXcQ %}

### Spotify
You can embed tracks, playlists, artists, or episodes.
{% embed 4cOdK2wGLETKBW3PvgPWqT spotify track %}

### Vimeo
{% embed https://vimeo.com/1084537 %}

### TikTok
{% embed https://www.tiktok.com/@scout2015/video/6718335390845095173 %}
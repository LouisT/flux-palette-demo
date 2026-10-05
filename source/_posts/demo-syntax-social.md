---
title: "Feature Demo: Syntax Highlighting & Socials"
date: 2026-01-01 12:00:00
tags: [code, dev, social]
categories: [Development]
---

Flux Palette includes a custom syntax highlighter designed to match your chosen color palette perfectly.

## Code Blocks

Hover over the code block to see the "Copy" button and the language label.

```javascript
// QuickSort Implementation
function quickSort(arr) {
    if (arr.length <= 1) return arr;

    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
}
```

And here is some CSS:

```css
:root {
    --accent: #ff6d00;
    --bg-color: #0a0a0a;
}

body {
    background-color: var(--bg-color);
    color: white;
}
```

## Social Buttons

You can insert your social links (configured in `_config.yml`) anywhere in your post using the tag.

{% social_buttons %}

Or customize them inline:

{% social_buttons size:2em %}
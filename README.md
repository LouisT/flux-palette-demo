# Flux Palette demo

A Hexo site showcasing [Flux Palette](https://github.com/LouisT/hexo-theme-flux-palette), with palettes, rich content, projects, search, and reading tools.

[Live demo](https://flux-palette.louist.dev/)

## Run locally

Requires Node.js 20.19 or newer.

```bash
npm ci
./update-theme.sh
```

For a preview without credentials, set `search.service: local` in `_config.flux-palette.yml`, then run:

```bash
npm run serve
```

Open the localhost URL printed by Hexo. `serve` cleans and builds the site before starting the server.

## Configure

- [_config.yml](_config.yml): site details, URLs, social links, and Hexo settings.
- [_config.flux-palette.yml](_config.flux-palette.yml): theme preferences, merged over the shipped defaults.
- [Theme guide](https://github.com/LouisT/hexo-theme-flux-palette): content tags, projects, series, and feature settings.

Keep site preferences in the dedicated theme config, without a `theme_config:` wrapper. Leave the theme's shipped defaults unchanged.

For [remote search](https://github.com/LouisT/hexo-theme-flux-palette#search), copy `.env.example` to `.env` and fill in only the selected provider's variables. The theme loads it automatically; shell/CI values take precedence. Restart Hexo after editing it. Keep secrets out of Git, and replace and revoke any previously committed Supabase write key.

## Update the theme

```bash
./update-theme.sh
```

The updater clones the latest upstream theme into `themes/flux-palette/` when the folder is missing, or runs `git pull --ff-only` in an existing theme checkout. Each invocation applies the update and installs dependencies from the theme lockfile, including optional packages. The site's `_config.flux-palette.yml` and `.env` stay at the site root.

For an initial installation from a fork, use `./update-theme.sh --repo <repository-url>`. Later updates pull from that checkout's configured upstream. An existing nonempty theme folder must be a Git checkout; rename a manually copied installation before running the updater.

## Validate

```bash
npm run format:check --prefix themes/flux-palette
npm run build
npm run check
```

Run `npm run gen-screenshots` to refresh the theme README gallery. It builds an isolated demo with local search and saves eight main-page examples with descriptive filenames under `themes/flux-palette/screenshots/`.

For screenshots, run `npx playwright install chromium` from `themes/flux-palette`, or set `FLUX_BROWSER_PATH` to a Chromium executable.

## Troubleshooting

- **Missing variable:** fill in `.env`, export the variable in the build environment, or select local search.
- **Invalid palette:** include both default palettes in `sidebar.palette_selector.include`.
- **Stale output:** run `npm run clean` and rebuild. `npx hexo flux-cache-clear` also forces a fresh cache and remote index upload.

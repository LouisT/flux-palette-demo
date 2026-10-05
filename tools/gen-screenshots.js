'use strict';
const fs = require('node:fs'),
    path = require('node:path'),
    os = require('node:os'),
    http = require('node:http'),
    { createRequire } = require('node:module'),
    yaml = require('js-yaml'),
    root = path.resolve(__dirname, '..'),
    theme = path.join(root, 'themes/flux-palette'),
    requireTheme = createRequire(path.join(theme, 'package.json')),
    { load } = requireTheme('cheerio'),
    output = path.join(theme, 'screenshots'),
    readme = path.join(theme, 'README.md'),
    startMarker = '<!-- screenshots:start -->',
    endMarker = '<!-- screenshots:end -->';

// Parse screenshot options and reject incomplete or unknown arguments
function parseArgs(args) {
    const options = { all: false, fullPage: false, public: null, help: false };

    for (let i = 0; i < args.length; i++) {
        const argument = args[i];
        if (argument === '--all') options.all = true;
        else if (argument === '--full-page') options.fullPage = true;
        else if (argument === '--help' || argument === '-h') options.help = true;
        else if (argument === '--public') {
            if (!args[i + 1] || args[i + 1].startsWith('--'))
                throw new Error('--public requires a generated-site directory.');
            options.public = path.resolve(args[++i]);
        } else throw new Error('Unknown argument: ' + argument);
    }

    return options;
}

// Build an isolated local-search demo without changing site settings or uploading indexes
async function buildDemo(themeDirectory = theme) {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'flux-screenshots-site-')),
        installedTheme = path.join(directory, 'themes/flux-palette'),
        Hexo = require('hexo');
    let hexo;

    try {
        fs.mkdirSync(installedTheme, { recursive: true });
        fs.cpSync(path.join(root, 'source'), path.join(directory, 'source'), {
            recursive: true,
        });
        fs.copyFileSync(path.join(root, 'package.json'), path.join(directory, 'package.json'));
        fs.symlinkSync(
            path.join(root, 'node_modules'),
            path.join(directory, 'node_modules'),
            'dir'
        );
        for (const name of ['layout', 'source', 'scripts', 'lib', 'package.json', '_config.yml'])
            fs.cpSync(path.join(themeDirectory, name), path.join(installedTheme, name), {
                recursive: true,
            });
        fs.symlinkSync(
            path.join(themeDirectory, 'node_modules'),
            path.join(installedTheme, 'node_modules'),
            'dir'
        );

        const config = yaml.load(fs.readFileSync(path.join(root, '_config.yml'), 'utf8')),
            preferences = yaml.load(
                fs.readFileSync(path.join(root, '_config.flux-palette.yml'), 'utf8')
            );
        config.url = 'http://localhost';
        config.root = '/';
        config.theme = 'flux-palette';
        config.theme_config = {
            ...config.theme_config,
            search: { enabled: true, service: 'local', debounce: 0 },
            comments: { enabled: false },
            offline: { enabled: false },
            playground: { enabled: true },
            swc: { enabled: false },
        };
        fs.writeFileSync(path.join(directory, '_config.yml'), yaml.dump(config));
        fs.writeFileSync(path.join(directory, '_config.flux-palette.yml'), yaml.dump(preferences));
        hexo = new Hexo(directory, { silent: true });
        const errors = [],
            report = hexo.log.error.bind(hexo.log);
        hexo.log.error = (...args) => {
            if (
                args.some(
                    (value) => typeof value === 'string' && value.includes('Script load failed')
                )
            )
                errors.push(
                    'A theme script could not load. Check the installed theme dependencies.'
                );
            report(...args);
        };
        hexo.env.cmd = 'generate';
        hexo.env.init = true;
        await hexo.init();
        if (errors.length) throw new Error(errors[0]);
        await hexo.call('generate');

        return {
            public: path.join(directory, 'public'),
            // Close Hexo before removing the isolated screenshot build directory
            async close() {
                await hexo.exit();
                fs.rmSync(directory, { recursive: true, force: true });
            },
        };
    } catch (error) {
        if (hexo) await hexo.exit().catch(() => {});
        fs.rmSync(directory, { recursive: true, force: true });
        throw error;
    }
}

// Find rendered pages while skipping redirect aliases
function discoverPages(directory) {
    const pages = [];

    // Collect page titles and article metadata from generated HTML
    function walk(current) {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const file = path.join(current, entry.name);
            if (entry.isDirectory()) walk(file);
            else if (entry.isFile() && entry.name.endsWith('.html')) {
                const $ = load(fs.readFileSync(file, 'utf8')),
                    redirect = $('meta[http-equiv]')
                        .toArray()
                        .some(
                            (element) => $(element).attr('http-equiv').toLowerCase() === 'refresh'
                        );
                if (redirect) continue;
                const relative = path.relative(directory, file).split(path.sep).join('/'),
                    manifest = $('#flux-manifest').text();
                pages.push({
                    url: '/' + relative.replace(/(^|\/)index\.html$/, '$1'),
                    title: $('h1').first().text().trim() || $('title').text().trim() || relative,
                    article: manifest ? JSON.parse(manifest).article : null,
                });
            }
        }
    }

    walk(path.resolve(directory));
    return pages.sort((a, b) =>
        a.url === '/' ? -1 : b.url === '/' ? 1 : a.url.localeCompare(b.url, 'en')
    );
}

// Choose the eight priority views with fallbacks for alternate demo content
function selectPages(pages, all = false) {
    if (all) return pages;
    const examples = [
            ['Homepage', (page) => page.url === '/'],
            ['Blog', (page) => page.url === '/blog/'],
            ['Projects', (page) => page.url === '/projects/'],
            [
                'Project details',
                (page) => page.url === '/projects/flux-palette/',
                (page) => page.article?.type === 'project',
            ],
            [
                'Blog post',
                (page) => /\/demo-rich-content\/$/.test(page.url),
                (page) => page.article?.type === 'post' && !page.article.encrypted,
            ],
            ['Topic cloud', (page) => page.url === '/cloud/'],
            ['Search', (page) => page.url === '/search/'],
            ['Reading list', (page) => page.url === '/reading/'],
        ],
        selected = [],
        used = new Set();

    for (const [title, preferred, fallback] of examples) {
        const page = pages.find(preferred) || (fallback && pages.find(fallback));
        if (!page || used.has(page.url)) continue;
        used.add(page.url);
        selected.push({ ...page, title, screenshotName: title });
    }

    return selected;
}

// Create descriptive filenames and suffix colliding route slugs
function screenshotFiles(pages) {
    const used = new Set();

    return pages.map((page) => {
        const name = page.screenshotName || (page.url === '/' ? 'homepage' : page.url),
            slug =
                name
                    .replace(/\.html$/, '')
                    .normalize('NFKD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '') || 'page';
        let file = slug + '.png',
            suffix = 2;
        while (used.has(file)) file = `${slug}-${suffix++}.png`;
        used.add(file);
        return file;
    });
}

// Replace completed captures and remove only obsolete managed screenshots
function saveScreenshots(staging, directory, manifest) {
    const manifestPath = path.join(directory, 'manifest.json'),
        previous = fs.existsSync(manifestPath)
            ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')).screenshots
            : [],
        managed = new Set(
            previous
                .map((item) => item.file)
                .filter((file) => /^[a-z0-9][a-z0-9-]*\.png$/.test(file))
        ),
        retained = new Set(manifest.screenshots.map((item) => item.file));
    fs.mkdirSync(directory, { recursive: true });
    for (const item of manifest.screenshots)
        fs.copyFileSync(path.join(staging, item.file), path.join(directory, item.file));
    for (const name of fs.readdirSync(directory))
        if ((managed.has(name) || /^screenshot-\d+\.png$/.test(name)) && !retained.has(name))
            fs.unlinkSync(path.join(directory, name));
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4) + '\n');
}

// Build a compact Markdown gallery using the capture filenames
function screenshotSection(screenshots) {
    const escape = (value) => value.replace(/[\[\]\\|]/g, '\\$&').replace(/\s+/g, ' '),
        cell = (item) =>
            item
                ? `**${escape(item.title)}**<br>![${escape(item.title)}](screenshots/${item.file})`
                : '',
        lines = [
            startMarker,
            '## Screenshots',
            '',
            'Main demo pages. Regenerate from the demo repository root:',
            '',
            '```bash',
            'npm run gen-screenshots',
            '```',
            '',
            'Add `-- --full-page` for full-height captures.',
            '',
            '| | |',
            '| --- | --- |',
        ];

    for (let i = 0; i < screenshots.length; i += 2)
        lines.push(`| ${cell(screenshots[i])} | ${cell(screenshots[i + 1])} |`);
    lines.push('', endMarker);
    return lines.join('\n');
}

// Replace the marked gallery while preserving surrounding README content
function updateReadmeText(source, section) {
    const start = source.indexOf(startMarker),
        end = source.indexOf(endMarker);
    if ((start === -1) !== (end === -1) || (start !== -1 && end < start))
        throw new Error('The README screenshot markers are incomplete or out of order.');
    if (start !== -1)
        return source.slice(0, start) + section + source.slice(end + endMarker.length);
    const insertion = source.indexOf('## Installation');
    if (insertion !== -1)
        return source.slice(0, insertion) + section + '\n\n' + source.slice(insertion);
    return source.trimEnd() + '\n\n' + section + '\n';
}

// Serve the generated demo locally and reject paths outside its directory
async function serve(directory) {
    directory = path.resolve(directory);
    const types = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp',
            '.ico': 'image/x-icon',
            '.woff2': 'font/woff2',
        },
        server = http.createServer((request, response) => {
            let pathname;
            try {
                pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
            } catch {
                response.writeHead(400).end();
                return;
            }
            if (pathname.endsWith('/')) pathname += 'index.html';
            const file = path.resolve(directory, '.' + pathname);
            if (
                !file.startsWith(directory + path.sep) ||
                !fs.existsSync(file) ||
                !fs.statSync(file).isFile()
            ) {
                response.writeHead(404).end('Not found');
                return;
            }
            response.setHeader(
                'Content-Type',
                types[path.extname(file)] || 'application/octet-stream'
            );
            fs.createReadStream(file)
                .on('error', () => response.destroy())
                .pipe(response);
        });
    await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', resolve);
    });

    return {
        url: `http://127.0.0.1:${server.address().port}`,
        close: () => new Promise((resolve) => server.close(resolve)),
    };
}

// Stage all browser captures before publishing images and the README gallery
async function generate(options) {
    const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'flux-screenshots-images-')),
        viewport = { width: 1440, height: 1000 };
    let build, server, browser;

    try {
        if (!options.public) {
            console.log('Building an isolated demo with local search.');
            build = await buildDemo();
        }
        const directory = options.public || build.public,
            pages = selectPages(discoverPages(directory), options.all),
            files = screenshotFiles(pages),
            catalogPath = path.join(directory, 'reading/catalog.json'),
            catalog = fs.existsSync(catalogPath)
                ? JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
                : [],
            bookmarks = [
                catalog.find((item) => !item.encrypted && /\/demo-rich-content\/$/.test(item.url)),
                catalog.find((item) => !item.encrypted && item.type === 'project'),
            ].filter(Boolean);
        if (!pages.length) throw new Error('No screenshot pages found in ' + directory);
        server = await serve(directory);
        const { chromium } = requireTheme('playwright');
        browser = await chromium.launch({
            executablePath: process.env.FLUX_BROWSER_PATH || undefined,
        });
        const context = await browser.newContext({
            viewport,
            deviceScaleFactor: 1,
            colorScheme: 'dark',
            reducedMotion: 'reduce',
            serviceWorkers: 'block',
        });
        await context.addInitScript((saved) => {
            try {
                localStorage.setItem('flux:/:bookmarks', JSON.stringify(saved));
            } catch {}
        }, bookmarks);
        const screenshots = [];

        for (const [index, example] of pages.entries()) {
            const page = await context.newPage(),
                errors = [],
                file = files[index];
            page.on('pageerror', (error) => errors.push(error.message));
            page.setDefaultTimeout(20000);
            const response = await page.goto(server.url + example.url, {
                waitUntil: 'domcontentloaded',
            });
            if (!response?.ok()) throw new Error('Could not load ' + example.url);
            await page.waitForFunction(() => window.Alpine && window.FluxNavigation);
            // Populate the search example and wait for its results before capturing
            if (example.url === '/search/') {
                await page.getByLabel('Keywords', { exact: true }).fill('theme');
                await page.waitForFunction(() => {
                    const element = document.querySelector('[x-data^="search("]');
                    return element && !window.Alpine.$data(element).isBusy;
                });
            }
            await page.evaluate(() => document.fonts.ready);
            await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
            if (errors.length) throw new Error(example.url + ': ' + errors.join('; '));
            await page.screenshot({
                path: path.join(staging, file),
                fullPage: options.fullPage,
                animations: 'disabled',
                caret: 'hide',
            });
            screenshots.push({ title: example.title, url: example.url, file });
            console.log(`[${index + 1}/${pages.length}] ${example.title} -> ${file}`);
            await page.close();
        }

        // Validate README markers before replacing existing screenshots
        const updatedReadme = updateReadmeText(
            fs.readFileSync(readme, 'utf8'),
            screenshotSection(screenshots)
        );
        saveScreenshots(staging, output, {
            viewport,
            fullPage: options.fullPage,
            screenshots,
        });
        fs.writeFileSync(readme, updatedReadme);
        console.log(
            `Saved ${screenshots.length} screenshots to ${path.relative(root, output)} and updated the theme README.`
        );
        return screenshots;
    } finally {
        if (browser) await browser.close();
        if (server) await server.close();
        if (build) await build.close();
        fs.rmSync(staging, { recursive: true, force: true });
    }
}

module.exports = {
    buildDemo,
    parseArgs,
    discoverPages,
    selectPages,
    screenshotFiles,
    saveScreenshots,
    screenshotSection,
    updateReadmeText,
    generate,
};
if (require.main === module) {
    const options = parseArgs(process.argv.slice(2));
    if (options.help)
        console.log(
            'Usage: tools/gen-screenshots.js [--all] [--full-page] [--public DIR]\n\nCaptures eight main demo pages with descriptive filenames and refreshes the theme README gallery.\n--all        Capture every rendered HTML page, excluding redirects.\n--full-page  Capture the full page instead of a 1440 x 1000 viewport.\n--public DIR Use an existing build instead of generating an isolated demo.\n\nSet FLUX_BROWSER_PATH to use an existing Chromium executable.'
        );
    else
        generate(options).catch((error) => {
            console.error(error.message);
            process.exitCode = 1;
        });
}

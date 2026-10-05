'use strict';
const fs = require('node:fs'),
    path = require('node:path'),
    { execFileSync } = require('node:child_process');
const repository = 'https://github.com/LouisT/hexo-theme-flux-palette.git';

// Run Git in the selected directory and surface failures through the updater
function git(directory, ...args) {
    return execFileSync('git', args, {
        cwd: directory,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'inherit'],
    }).trim();
}

// Clone a missing theme or pull its upstream branch, then install locked dependencies
async function update(options = {}) {
    const root = path.resolve(options.root || path.join(__dirname, '..')),
        parent = path.join(root, 'themes'),
        theme = path.join(parent, 'flux-palette');
    fs.mkdirSync(parent, { recursive: true });
    if (fs.existsSync(theme) && fs.lstatSync(theme).isSymbolicLink())
        throw new Error('Expected a theme directory instead of a symbolic link.');

    // Require the theme's own Git metadata so a missing checkout cannot pull the site repository
    const installed = fs.existsSync(path.join(theme, '.git'));
    if (installed) git(theme, 'pull', '--ff-only');
    else git(parent, 'clone', '--depth=1', '--', options.repo || repository, theme);

    // Install from the updated lockfile, including optional JavaScript compilation support
    execFileSync('npm', ['ci', '--include=optional', '--prefix', theme], {
        stdio: 'inherit',
    });
    return { theme, installed: !installed, revision: git(theme, 'rev-parse', 'HEAD') };
}

module.exports = { update };

// Parse the clone source and report the installed upstream revision
if (require.main === module) {
    const args = process.argv.slice(2),
        usage = 'Usage: update-theme.sh [--repo URL]',
        options = {};
    if (args.length === 1 && ['--help', '-h'].includes(args[0])) console.log(usage);
    else {
        try {
            if (args.length) {
                if (
                    args.length !== 2 ||
                    args[0] !== '--repo' ||
                    !args[1] ||
                    args[1].startsWith('-')
                )
                    throw new Error(usage);
                options.repo = args[1];
            }
            update(options)
                .then((result) =>
                    console.log(
                        `${result.installed ? 'Installed' : 'Updated'} Flux Palette to ${result.revision}.`
                    )
                )
                .catch((error) => {
                    console.error(error.message);
                    process.exitCode = 1;
                });
        } catch (error) {
            console.error(error.message);
            process.exitCode = 1;
        }
    }
}

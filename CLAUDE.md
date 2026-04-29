# Claude Code Context

## Tooling Directive

**Serena MCP** (`mcp__serena__*`) is the preferred tool for code exploration and editing. Use Serena's semantic tools over raw file reads when working with source code:

- **Explore:** `find_symbol`, `get_symbols_overview`, `find_referencing_symbols`, `search_for_pattern`
- **Edit:** `replace_symbol_body`, `insert_before_symbol`, `insert_after_symbol`
- **Navigate:** `list_dir`, `find_file`
- **Persist context:** `write_memory`, `read_memory`, `list_memories`

Run `mcp__serena__check_onboarding_performed` at session start. If onboarding hasn't been done, run `mcp__serena__onboarding`.

Subagents spawned via the `Task` tool also have access to Serena MCP and should prefer the same semantic tools.

**Playwright MCP** (`mcp__playwright__*`) and **Chrome DevTools MCP** (`mcp__chrome-devtools__*`) are the preferred ways to debug and visually verify sites. Save screenshots to `scratch/`.

## Project Overview

Monorepo with three Gatsby v5 sites by Michal Švácha. Managed with pnpm workspaces (hoisted node_modules via `.npmrc`) + Turborepo. Deployed on Netlify with security headers and immutable asset caching.

## Structure

```
svachmic-cz/
├── .serena/              # Serena MCP config (TypeScript LSP)
├── packages/shared/      # @svachmic/shared — shared components, config helpers, CSS
├── blog-dev/             # /dev/svachmic — technical blog (dev.svachmic.cz)
├── blog-personal/        # blog.svachmic.cz — personal blog
├── homepage/             # svachmic.cz — personal homepage
└── scratch/              # Temporary screenshots and test files (gitignored)
```

## Sites

### `/dev/svachmic` (Technical Blog)

- **Directory:** `blog-dev/`
- **URL:** https://dev.svachmic.cz/
- **Description:** Technical blog about software development. Written in Czech.
- **Design:** Dark theme, purple accent (#bb05fe). Syntax highlighting: custom Darcula theme (`src/prism-darcula.css`).

### `blog.svachmic.cz` (Personal Blog)

- **Directory:** `blog-personal/`
- **URL:** https://blog.svachmic.cz/
- **Description:** Personal blog covering career, gaming, education, and life reflections. Written in Czech.
- **Design:** Light theme, purple accent (#6B46C1). Classic blog layout focused on readability.

### `svachmic.cz` (Homepage)

- **Directory:** `homepage/`
- **URL:** https://svachmic.cz/
- **Description:** Personal homepage with bio, GitHub stats, blog links, and social links. Written in Czech.
- **Design:** Minimal single-page layout, purple accent (#6B46C1).

## Shared Package (`packages/shared/`)

Workspace package `@svachmic/shared` contains code shared across all three sites:

- **Components:** `seo.js`, `reading-progress-bar.js`, `tag-filter.js`, `youtube.js`, `linkedin.js`
- **Config helpers:** `config/gatsby-plugins.js` (plugin generators), `config/gatsby-node-helpers.js` (createPages, onCreateNode, schema types)
- **CSS:** `css/tokens.css` (shared spacing, fonts, typography), `css/normalize.css`

**Note:** Components using Gatsby's `useStaticQuery` (like Seo) must be kept as local copies in each site — Gatsby cannot extract static queries from `node_modules`. The shared Seo component exists for reference but each blog maintains its own copy.

## Content

- **Blog posts:** Markdown with frontmatter in `{site}/content/blog/{YYYY}/{MM}/{DD-slug}/index.md`
- **Drafts:** `{site}/content/blog/draft/` — gitignored, excluded from analytics and robots.txt
- **Assets:** `{site}/content/assets/` — favicons, profile pics
- **Static files:** `{site}/static/` — `ai.txt`, `llms.txt`, `robots.txt` (copied verbatim to build output)
- **Homepage data:** GitHub API stats fetched at build time via `sourceNodes` in `homepage/gatsby-node.js`

Frontmatter fields: `title`, `description`, `date`, `modified`, `categories`, `tags` (array), `author`.

## Technology Stack

- **Framework:** Gatsby.js (v5)
- **Language:** JavaScript (React 19)
- **Package Manager:** pnpm 10 (workspaces, hoisted via `.npmrc`)
- **Build Orchestration:** Turborepo
- **Styling:** CSS with Custom Properties (shared tokens in `packages/shared/css/tokens.css`)
- **Typography:** Montserrat (headings), Merriweather (body), JetBrains Mono (code)
- **Deployment:** Netlify (Node 24). Each site is a separate Netlify project with its base directory set to the site folder. Netlify runs `gatsby build` from there (not a root turbo command). The blog sites use an `ignore` field in `netlify.toml` to skip builds when only unrelated files changed; the homepage always builds.
- **Remark plugins (shared):** images, responsive-iframe, autolink-headers, katex, prismjs, copy-linked-files
- **Site plugins:** sitemap, RSS feed, robots.txt, Google Analytics (all sites)

## Development Commands

From the repo root:

- `pnpm install` — Install all dependencies (single lockfile)
- `pnpm run build` — Build all sites via Turborepo
- `pnpm run dev:blog-dev` — Start blog-dev dev server
- `pnpm run dev:blog-personal` — Start blog-personal dev server
- `pnpm run dev:homepage` — Start homepage dev server
- `pnpm run clean` — Clean all caches
- `pnpm run format` — Format all code with Prettier

From individual site directories:

- `pnpm run develop` — Start dev server (http://localhost:8000)
- `pnpm run build` — Build for production
- `pnpm run serve` — Serve production build
- `pnpm run clean` — Clean cache

## Versioning

DateVer format `YYYY.M.D` in each site's `package.json` — pure DateVer with no zero-padding (npm/pnpm enforces strict SemVer 2.0.0, which rejects leading zeros like `2026.04.29`). For multiple builds on the same day, append a pre-release tag (e.g. `2026.4.29-2`) since the third segment is the day.

Bump version:

```bash
V=$(date +"%Y.%-m.%-d")
cd blog-dev      && pnpm version $V --no-git-tag-version && cd ..
cd blog-personal && pnpm version $V --no-git-tag-version && cd ..
cd homepage      && pnpm version $V --no-git-tag-version && cd ..
```

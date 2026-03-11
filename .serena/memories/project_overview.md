# Project Overview

Monorepo with three Gatsby v5 sites by Michal Švácha. Managed with pnpm workspaces + Turborepo. Deployed on Netlify.

## Sites

- `blog-dev/` — dev.svachmic.cz (technical blog, Czech, dark theme)
- `blog-personal/` — blog.svachmic.cz (personal blog, Czech, light theme)
- `homepage/` — svachmic.cz (personal homepage, minimal layout)

## Tech Stack

- Gatsby.js v5, React 19, JavaScript (no TypeScript in source)
- pnpm 10 workspaces, Turborepo
- CSS with Custom Properties
- Netlify deployment, Node 24

## Structure

- `packages/shared/` — @svachmic/shared (components, config helpers, CSS tokens)
- Content in `{site}/content/blog/{YYYY}/{MM}/{DD-slug}/index.md`
- Versioning: DateVer `YYYYMMDD.0`

# svachmic.cz

[![Netlify Status — Homepage](https://api.netlify.com/api/v1/badges/edb48a1b-7d19-447f-acf2-eb940df5a1d0/deploy-status)](https://app.netlify.com/projects/svachmic-homepage/deploys)
[![Netlify Status — /dev/svachmic](https://api.netlify.com/api/v1/badges/96654798-b9c1-4099-b411-53e7ac742690/deploy-status)](https://app.netlify.com/sites/svachmic-dev/deploys)
[![Netlify Status — blog.svachmic.cz](https://api.netlify.com/api/v1/badges/ec173f01-737b-4663-b144-5e1df65792cf/deploy-status)](https://app.netlify.com/sites/svachmic/deploys)

Monorepo with three personal websites by [Michal Švácha](https://svachmic.cz), built with Gatsby v5.

## Sites

### [svachmic.cz](https://svachmic.cz) — Homepage

- **Directory:** [`homepage/`](./homepage)
- **Description:** Personal homepage with bio, GitHub & GitLab contribution graph, featured project, blog links, and social links. Written in Czech.
- **Design:** Minimal single-page layout, purple accent.

### [dev.svachmic.cz](https://dev.svachmic.cz) — Technical Blog

- **Directory:** [`blog-dev/`](./blog-dev)
- **Description:** Technical blog about software development. Written in Czech.
- **Design:** Dark theme with purple accent. Custom Darcula syntax highlighting.

### [blog.svachmic.cz](https://blog.svachmic.cz) — Personal Blog

- **Directory:** [`blog-personal/`](./blog-personal)
- **Description:** Personal blog covering career, gaming, education, and life reflections. Written in Czech.
- **Design:** Light theme with purple accent.

## Shared Package

[`packages/shared/`](./packages/shared) (`@svachmic/shared`) contains components, Gatsby config helpers, and CSS tokens shared across all three sites.

## Technology Stack

- **Framework:** Gatsby.js v5, React 19
- **Package Manager:** pnpm 10 (workspaces)
- **Build Orchestration:** Turborepo
- **Styling:** CSS with Custom Properties
- **Content:** Markdown with frontmatter (blogs), GitHub/GitLab API data (homepage)
- **Deployment:** Netlify (Node 24)

## Local Development

```sh
pnpm install              # install all dependencies
pnpm run dev:homepage     # start homepage dev server
pnpm run dev:blog-dev     # start technical blog dev server
pnpm run dev:blog-personal # start personal blog dev server
```

Each dev server runs at `http://localhost:8000`.

## License

- **Code** (source files, configs, build scripts): [MIT](LICENSE)
- **Content** (blog posts, images, profile photos): [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)

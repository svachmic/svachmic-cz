# Technology Stack

Both blogs are built with the following technologies:

- **Framework:** Gatsby.js (v5)
- **Language:** JavaScript (React 18)
- **Styling:** CSS with Custom Properties
- **Content:** Markdown files with frontmatter
- **Plugins:**
  - `gatsby-remark-prismjs` - Syntax highlighting for code blocks
  - `gatsby-remark-katex` - Math formula rendering (personal blog only)
  - `gatsby-remark-autolink-headers` - Anchor links for headings (personal blog only)
  - `gatsby-plugin-google-gtag` - Google Analytics
  - `gatsby-plugin-sitemap` - XML sitemap generation
  - `gatsby-plugin-feed` - RSS feed generation
  - `gatsby-plugin-robots-txt` - robots.txt generation
- **Deployment:** Netlify
- **Typography:**
  - Headings: Montserrat
  - Body: Merriweather
  - Code: JetBrains Mono

## Development Commands

Navigate to the blog directory first:

```bash
cd blog-personal  # or cd blog-dev
```

- **Install dependencies:** `npm install`
- **Start development server:** `npm run develop` or `npm start`
  - Server runs at http://localhost:8000
  - GraphQL playground at http://localhost:8000/___graphql
- **Build for production:** `npm run build`
- **Serve production build:** `npm run serve`
- **Clean cache:** `npm run clean`
- **Build and serve:** `npm run cb`
- **Format code:** `npm run format`

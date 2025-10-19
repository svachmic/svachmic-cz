# Project Description: svachmic.cz

This project contains two personal blogs, both built with Gatsby.js.

## 1. `/dev/svachmic` (Technical Blog)

- **Folder:** `blog-dev`
- **URL:** https://dev.svachmic.cz/
- **Description:** This is a technical blog where the author, Michal Švácha, writes about software development, programming, and related topics.
- **Design:** It features a dark theme with a purple accent color, and uses a monospaced font for code blocks with syntax highlighting.

## 2. `svachmic.cz` (Personal Blog)

- **Folder:** `blog-personal`
- **URL:** https://blog.svachmic.cz/
- **Description:** This is a personal blog for Michal Švácha's thoughts and writings on various topics.
- **Design:** It uses a light theme with a purple accent color, focusing on readability with a classic blog layout.

## Development Files

### Scratch Directory (`context/scratch/`)

This directory is for temporary files created during development and testing, such as:
- Screenshots taken by MCP servers (playwright, chrome-devtools)
- Test files
- Temporary debugging output

**This directory is gitignored** - files here will not be committed to the repository.

#### Usage for Screenshots

When taking screenshots with MCP tools, always save them to `context/scratch/`:

```
/Users/michalsvacha/GitHub/personal/svachmic-cz/context/scratch/filename.png
```

Files in this directory can be safely deleted at any time and should not be relied upon between sessions.

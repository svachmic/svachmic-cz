# Screenshot and Temporary File Guidelines

## Directory Structure

All temporary files created during development, testing, or verification should be stored in:

```
context/scratch/
```

This directory is gitignored and will not be committed to the repository.

## MCP Server Screenshots

When using MCP servers (playwright, chrome-devtools) to take screenshots, ALWAYS save them to the scratch directory:

### ✅ Correct Usage:
```javascript
// Playwright
mcp__playwright__browser_take_screenshot({
  filename: "/Users/michalsvacha/GitHub/personal/svachmic-cz/context/scratch/screenshot-name.png"
})

// Chrome DevTools
mcp__chrome-devtools__take_screenshot({
  filePath: "/Users/michalsvacha/GitHub/personal/svachmic-cz/context/scratch/screenshot-name.png"
})
```

### ❌ Incorrect Usage:
```javascript
// Don't save to root directory
filePath: "/Users/michalsvacha/GitHub/personal/svachmic-cz/screenshot.png"

// Don't save to arbitrary locations
filePath: "/Users/michalsvacha/GitHub/personal/svachmic-cz/blog-dev/screenshot.png"
```

## File Naming Convention

Use descriptive names with context:
- `blog-dev-progress-bar-top.png`
- `blog-personal-homepage-test.png`
- `verification-screenshot-2024-01-15.png`

## Cleanup

Files in `context/scratch/` can be safely deleted at any time. Claude Code should not rely on these files persisting between sessions.

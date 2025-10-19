# Versioning

Both blogs are versioned using a `DateVer` format `YYYY.MM.DD` defined in their respective `package.json` files.

To bump the version, use the following shell script:

```bash
# For the dev blog
cd blog-dev
npm version $(date +"%Y.%m.%d") --no-git-tag-version
npm install
cd ..

# For the personal blog
cd blog-personal
npm version $(date +"%Y.%m.%d") --no-git-tag-version
npm install
cd ..
```

This will update the version in `package.json` and `package-lock.json`.

## Notes

- The date format `%Y.%m.%d` produces zero-padded output: `YYYY.MM.DD` (e.g., `2025.09.28`)
- The quotes around the date format string ensure proper shell expansion
- Use `--no-git-tag-version` to update package files without creating a git tag
- Run `npm install` after to update `package-lock.json`

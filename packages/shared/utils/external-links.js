export function isExternalHref(href) {
  if (!href || typeof href !== "string") return false;
  return /^(https?:)?\/\//i.test(href.trim());
}

export function markExternalLinksInHtml(html) {
  if (!html) return html;
  return html.replace(/<a\b([^>]*?)>/gi, (full, attrs) => {
    if (/\btarget\s*=/i.test(attrs)) return full;
    const hrefMatch = /\bhref\s*=\s*(["'])(.*?)\1/i.exec(attrs);
    if (!hrefMatch || !isExternalHref(hrefMatch[2])) return full;
    const trimmed = attrs.replace(/\s*$/, "");
    return `<a${trimmed} target="_blank" rel="noopener noreferrer">`;
  });
}

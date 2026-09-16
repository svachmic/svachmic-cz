/**
 * Local gatsby-transformer-remark plugin: open absolute http(s) links in a new tab.
 * Relative / same-site path links stay in the current tab.
 *
 * Handles inline links, reference-style links ([text][id]), and raw HTML <a> tags.
 */
function walk(node, visit) {
  if (!node || typeof node !== "object") return
  visit(node)
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      walk(child, visit)
    }
  }
}

function isExternalUrl(url) {
  if (!url || typeof url !== "string") return false
  return /^(https?:)?\/\//i.test(url)
}

function applyExternalAttrs(node, target, rel) {
  node.data = node.data || {}
  node.data.hProperties = {
    ...node.data.hProperties,
    target,
    rel,
  }
}

function addAttrsToHtml(value, target, rel) {
  return value.replace(/<a\b([^>]*?)>/gi, (full, attrs) => {
    if (/\btarget\s*=/i.test(attrs)) return full
    const hrefMatch = /\bhref\s*=\s*(["'])(.*?)\1/i.exec(attrs)
    if (!hrefMatch || !isExternalUrl(hrefMatch[2])) return full
    const trimmed = attrs.replace(/\s*$/, "")
    return `<a${trimmed} target="${target}" rel="${rel}">`
  })
}

module.exports = ({ markdownAST }, pluginOptions = {}) => {
  const target = pluginOptions.target || "_blank"
  const rel = pluginOptions.rel || "noopener noreferrer"

  const definitions = Object.create(null)
  walk(markdownAST, node => {
    if (node.type === "definition" && node.identifier) {
      definitions[String(node.identifier).toLowerCase()] = node.url
    }
  })

  walk(markdownAST, node => {
    if (node.type === "link" && isExternalUrl(node.url)) {
      applyExternalAttrs(node, target, rel)
      return
    }

    if (node.type === "linkReference") {
      const url = definitions[String(node.identifier || "").toLowerCase()]
      if (isExternalUrl(url)) applyExternalAttrs(node, target, rel)
      return
    }

    if (node.type === "html" && typeof node.value === "string") {
      node.value = addAttrsToHtml(node.value, target, rel)
    }
  })

  return markdownAST
}

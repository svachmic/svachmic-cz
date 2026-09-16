/**
 * Local gatsby-transformer-remark plugin: open absolute http(s) links in a new tab.
 * Relative / same-site path links stay in the current tab.
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

module.exports = ({ markdownAST }, pluginOptions = {}) => {
  const target = pluginOptions.target || "_blank"
  const rel = pluginOptions.rel || "noopener noreferrer"

  walk(markdownAST, node => {
    if (node.type !== "link" || !isExternalUrl(node.url)) return

    node.data = node.data || {}
    node.data.hProperties = {
      ...node.data.hProperties,
      target,
      rel,
    }
  })

  return markdownAST
}

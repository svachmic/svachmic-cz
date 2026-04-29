const path = require(`path`)
const {
  createBlogPages,
  onCreateNode,
  getCommonSchemaTypes,
  createLatestJson,
  createMarkdownSidecars,
} = require(`@svachmic/shared/config/gatsby-node-helpers`)

const blogPost = path.resolve(`./src/templates/blog-post.js`)

exports.createPages = createBlogPages(blogPost)

exports.onCreateNode = onCreateNode

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(getCommonSchemaTypes())

  // Site-specific Hyperlinks type
  createTypes(`
    type Hyperlinks {
      devBlog: String
      manaOutpost: String
      email: String
    }
  `)
}

exports.onPostBuild = async (args) => {
  await createLatestJson()(args)
  await createMarkdownSidecars()(args)
}

exports.onCreateWebpackConfig = ({ actions, loaders }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.js$/,
          include: /node_modules\/@svachmic\/shared/,
          use: [loaders.js()],
        },
      ],
    },
  })
}

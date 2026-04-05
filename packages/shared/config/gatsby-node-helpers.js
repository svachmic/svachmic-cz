const path = require(`path`);
const fs = require(`fs`);
const { createFilePath } = require(`gatsby-source-filesystem`);

/**
 * Creates the createPages function for blog posts.
 * @param {string} templatePath - Absolute path to the blog-post template.
 */
function createBlogPages(templatePath) {
  return async ({ graphql, actions, reporter }) => {
    const { createPage } = actions;

    const result = await graphql(`
      {
        allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
          nodes {
            id
            fields {
              slug
              readTimeEstimate {
                duration
                humanizedDuration
                imageTime
                otherLanguageTime
                otherLanguageTimeCharacters
                totalImages
                totalWords
                wordTime
              }
            }
          }
        }
      }
    `);

    if (result.errors) {
      reporter.panicOnBuild(
        `There was an error loading your blog posts`,
        result.errors,
      );
      return;
    }

    const posts = result.data.allMarkdownRemark.nodes;

    if (posts.length > 0) {
      posts.forEach((post, index) => {
        const previousPostId = index === 0 ? null : posts[index - 1].id;
        const nextPostId =
          index === posts.length - 1 ? null : posts[index + 1].id;

        createPage({
          path: post.fields.slug,
          component: templatePath,
          context: {
            id: post.id,
            previousPostId,
            nextPostId,
          },
        });
      });
    }
  };
}

/**
 * Shared onCreateNode — creates slug field for MarkdownRemark nodes.
 */
function onCreateNode({ node, actions, getNode }) {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });

    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
}

/**
 * Returns the common GraphQL type definitions string.
 * Hyperlinks type is site-specific and must be added separately.
 */
function getCommonSchemaTypes() {
  return `
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      hyperlinks: Hyperlinks
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      modified: Date @dateformat
      tags: [String]
    }

    type Fields {
      slug: String
      readTimeEstimate: ReadTimeEstimate
    }

    type ReadTimeEstimate  {
      duration: Float
      humanizedDuration: String
      imageTime: Float
      otherLanguageTime: Float
      otherLanguageTimeCharacters: Float
      totalImages: Float
      totalWords: Float
      wordTime: Float
    }
  `;
}

/**
 * Creates the onPostBuild function that writes latest.json to public/.
 * Reads site title and URL from siteMetadata via GraphQL.
 */
function createLatestJson() {
  return async ({ graphql, reporter }) => {
    const result = await graphql(`
      {
        site {
          siteMetadata {
            title
            siteUrl
          }
        }
        allMarkdownRemark(
          sort: { frontmatter: { date: DESC } }
          limit: 3
          filter: { fields: { slug: { regex: "/^(?!/draft/)/" } } }
        ) {
          nodes {
            excerpt(pruneLength: 160)
            wordCount {
              words
            }
            fields {
              slug
            }
            frontmatter {
              title
              description
              date
              tags
            }
          }
        }
      }
    `);

    if (result.errors) {
      reporter.panicOnBuild(`Error generating latest.json`, result.errors);
      return;
    }

    const { title, siteUrl } = result.data.site.siteMetadata;
    const baseUrl = siteUrl.replace(/\/$/, ``);

    const posts = result.data.allMarkdownRemark.nodes.map((node) => ({
      title: node.frontmatter.title,
      slug: node.fields.slug,
      url: `${baseUrl}${node.fields.slug}`,
      date: node.frontmatter.date,
      description: node.frontmatter.description || node.excerpt,
      tags: node.frontmatter.tags || [],
      readingTime: Math.ceil((node.wordCount?.words || 0) / 200),
    }));

    const data = {
      site: { title, url: siteUrl },
      generatedAt: new Date().toISOString(),
      posts,
    };

    fs.writeFileSync(
      path.join(`public`, `latest.json`),
      JSON.stringify(data, null, 2),
    );

    reporter.info(`Wrote latest.json with ${posts.length} post(s)`);
  };
}

module.exports = {
  createBlogPages,
  onCreateNode,
  getCommonSchemaTypes,
  createLatestJson,
};

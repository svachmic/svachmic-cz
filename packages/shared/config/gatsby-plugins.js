/**
 * Shared Gatsby plugin configuration generators.
 * Each function returns a plugin config object for use in gatsby-config.js.
 */

function createSitemapPlugin(siteUrl) {
  const cleanUrl = siteUrl.replace(/\/$/, "");
  return {
    resolve: "gatsby-plugin-sitemap",
    options: {
      query: `
        {
          allSitePage {
            nodes {
              path
            }
          }
          allMarkdownRemark {
            nodes {
              fields {
                slug
              }
              frontmatter {
                date
                modified
              }
            }
          }
        }
      `,
      resolveSiteUrl: () => cleanUrl,
      resolvePages: ({
        allSitePage: { nodes: allPages },
        allMarkdownRemark: { nodes: allPosts },
      }) => {
        const postDateMap = {};
        allPosts.forEach((post) => {
          postDateMap[post.fields.slug] = {
            lastmod: post.frontmatter.modified || post.frontmatter.date,
          };
        });
        return allPages.map((page) => {
          return { ...page, ...postDateMap[page.path] };
        });
      },
      serialize: ({ path, lastmod }) => {
        const isIndex = path === "/";
        return {
          url: path,
          lastmod: lastmod || undefined,
          changefreq: isIndex ? "weekly" : "monthly",
          priority: isIndex ? 1.0 : 0.7,
        };
      },
    },
  };
}

function createFeedPlugin(feedTitle) {
  return {
    resolve: `gatsby-plugin-feed`,
    options: {
      query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
      feeds: [
        {
          serialize: ({ query: { site, allMarkdownRemark } }) => {
            return allMarkdownRemark.nodes.map((node) => {
              return Object.assign({}, node.frontmatter, {
                description: node.excerpt,
                date: node.frontmatter.date,
                author: node.frontmatter.author || "Michal Švácha",
                url: site.siteMetadata.siteUrl + node.fields.slug,
                guid: site.siteMetadata.siteUrl + node.fields.slug,
                custom_elements: [{ "content:encoded": node.html }],
              });
            });
          },
          setup: ({ query: { site } }) => {
            const siteUrl = site.siteMetadata.siteUrl.replace(/\/$/, "");
            return {
              title: site.siteMetadata.title,
              description: site.siteMetadata.description,
              site_url: siteUrl,
              feed_url: `${siteUrl}/rss.xml`,
              custom_namespaces: {
                atom: "http://www.w3.org/2005/Atom",
              },
              custom_elements: [
                {
                  "atom:link": {
                    _attr: {
                      href: `${siteUrl}/rss.xml`,
                      rel: "self",
                      type: "application/rss+xml",
                    },
                  },
                },
              ],
            };
          },
          query: `{
            allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
              nodes {
                excerpt
                html
                fields {
                  slug
                }
                frontmatter {
                  title
                  date
                  author
                }
              }
            }
          }`,
          output: "/rss.xml",
          title: feedTitle,
        },
      ],
    },
  };
}

function createRobotsTxtPlugin(siteUrl) {
  return {
    resolve: `gatsby-plugin-robots-txt`,
    options: {
      host: siteUrl.replace(/\/$/, ""),
      sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap-index.xml`,
      policy: [{ userAgent: "*", allow: "/", disallow: ["/draft/"] }],
    },
  };
}

function createGtagPlugin(trackingId) {
  return {
    resolve: `gatsby-plugin-google-gtag`,
    options: {
      trackingIds: [trackingId],
      gtagConfig: {
        optimize_id: "OPT_CONTAINER_ID",
        anonymize_ip: true,
        cookie_expires: 0,
      },
      pluginConfig: {
        head: false,
        respectDNT: true,
        exclude: ["/draft/**"],
      },
    },
  };
}

function createRemarkPlugins() {
  return [
    {
      resolve: `gatsby-remark-images`,
      options: {
        maxWidth: 630,
      },
    },
    {
      resolve: `gatsby-remark-responsive-iframe`,
      options: {
        wrapperStyle: `margin-bottom: 1.0725rem`,
      },
    },
    {
      resolve: `gatsby-remark-autolink-headers`,
      options: {
        className: `anchor-header`,
        elements: [`h2`, `h3`, `h4`],
      },
    },
    {
      resolve: `gatsby-remark-katex`,
      options: {
        strict: `ignore`,
      },
    },
    `gatsby-remark-prismjs`,
    `gatsby-remark-copy-linked-files`,
  ];
}

module.exports = {
  createSitemapPlugin,
  createFeedPlugin,
  createRobotsTxtPlugin,
  createGtagPlugin,
  createRemarkPlugins,
};

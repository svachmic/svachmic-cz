const {
  createSitemapPlugin,
  createFeedPlugin,
  createGtagPlugin,
  createRemarkPlugins,
} = require(`@svachmic/shared/config/gatsby-plugins`)

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `svachmic.cz`,
    author: {
      name: `Michal Švácha`,
      summary: `Přemýšlím, tvořím a píšu o tom.`,
    },
    hyperlinks: {
      devBlog: `https://dev.svachmic.cz?utm_source=blog_svachmic&utm_medium=web`,
      manaOutpost: `https://manaoutpost.substack.com?utm_source=blog_svachmic&utm_medium=web`,
      email: `mailto:kontakt@svachmic.cz`,
    },
    description: `Osobní blog Michala Šváchy`,
    siteUrl: `https://blog.svachmic.cz/`,
    social: {
      twitter: `svachmic`,
    },
  },
  plugins: [
    createSitemapPlugin(`https://blog.svachmic.cz`),
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: createRemarkPlugins(),
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    createFeedPlugin(`svachmic.cz`),
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Osobní blog Michala Šváchy`,
        short_name: `svachmic.cz`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#8a02bc`,
        display: `minimal-ui`,
        icon: `content/assets/favicon.png`,
      },
    },
    createGtagPlugin(`G-KLMPJJ6PSP`),
  ],
}

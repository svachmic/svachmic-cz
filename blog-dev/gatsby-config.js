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
    title: `/dev/svachmic`,
    author: {
      name: `Michal Švácha`,
      summary: `Přemýšlím, programuji a píšu o tom.`,
    },
    hyperlinks: {
      personal: `https://blog.svachmic.cz`,
      github: `https://github.com/svachmic`,
      stackoverflow: `https://stackoverflow.com/users/1196908/michal`,
      email: `mailto:kontakt@svachmic.cz`,
    },
    description: `Tech blog Michala Šváchy.`,
    siteUrl: `https://dev.svachmic.cz/`,
    social: {
      twitter: `svachmic`,
    },
  },
  plugins: [
    createSitemapPlugin(`https://dev.svachmic.cz`),
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
    createFeedPlugin(`/dev/svachmic`),
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Tech blog Michala Šváchy.`,
        short_name: `/dev/svachmic`,
        start_url: `/`,
        background_color: `#1e2128`,
        theme_color: `#bb05fe`,
        display: `minimal-ui`,
        icon: `content/assets/favicon.png`,
      },
    },
    createGtagPlugin(`G-JHX3P2B5BR`),
  ],
}

const {
  createRobotsTxtPlugin,
  createGtagPlugin,
} = require(`@svachmic/shared/config/gatsby-plugins`)

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Michal Švácha`,
    author: {
      name: `Michal Švácha`,
      summary: `Programátor, bývalý CTO, sběratel karet a retro gaming nadšenec.`,
    },
    description: `Celý život u počítačů, ve firmách malých i velkých - dnes programuje s AI v SonarSource, po večerech pracuje na frameworku pro hry na Game Boy, hraje Magicy nebo tráví čas s rodinou.`,
    siteUrl: `https://svachmic.cz/`,
    social: {
      twitter: `svachmic`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        resolveSiteUrl: () => `https://svachmic.cz`,
      },
    },
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Michal Švácha`,
        short_name: `svachmic.cz`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#6B46C1`,
        display: `minimal-ui`,
        icon: `content/assets/favicon.png`,
      },
    },
    createRobotsTxtPlugin(`https://svachmic.cz`),
    createGtagPlugin(`G-W0S5VPDPNS`),
  ],
}

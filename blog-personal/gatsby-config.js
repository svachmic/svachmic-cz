module.exports = {
  siteMetadata: {
    title: `svachmic.cz`,
    author: {
      name: `Michal Švácha`,
      summary: `Přemýšlím, tvořím a píšu o tom.`,
    },
    hyperlinks: {
        pixeesoft: `https://pixeesoft.blog`,
        github: `https://github.com/svachmic`,
        stackoverflow: `https://stackoverflow.com/users/1196908/michal`,
        email: `mailto:kontakt@svachmic.cz`
    },
    description: `Osobní blog Michala Šváchy.`,
    siteUrl: `https://www.svachmic.cz/`,
    social: {
      twitter: `miguelitinho`,
    },
  },
  plugins: [
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
        plugins: [
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
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          `gatsby-remark-reading-time`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-61928196-1`,
        anonymize: true,
        respectDNT: true,
      },
    },
    `gatsby-plugin-feed`,
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
    `gatsby-plugin-react-helmet`,
    'gatsby-plugin-dark-mode',
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}

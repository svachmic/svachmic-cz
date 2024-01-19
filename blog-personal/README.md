<p align="center">
  <a href="https://blog.svachmic.cz">
    <img alt="Blog icon" src="./content/assets/favicon.png" width="60" />
  </a>
</p>
<h1 align="center">
  blog.svachmic.cz
</h1>

[![Netlify Status](https://api.netlify.com/api/v1/badges/ec173f01-737b-4663-b144-5e1df65792cf/deploy-status)](https://app.netlify.com/sites/svachmic/deploys)

This repository contains the code behind Michal's personal blog at [blog.svachmic.cz](https://blog.svachmic.cz).

## 🚀 Deployment

The website is automatically deployed to Netlify when code is pushed to the master branch.

## 💻 Local development

For writing a post, Gatsby has a feature of hot reloading so simply start Gatsby up:

```sh
npm run develop
```

And the site will run at `http://localhost:8000`.

_*Note*: You'll also see a second link: _`http://localhost:8000/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.com/tutorial/part-five/#introducing-graphiql)._

### Pre-production verification

In order to check all necessities, such as image dimensions, 404 page and sitemap, a production build has to be run. To do that, run:

```sh
npm run cb
```

Which creates a production build and runs it on port 9000.

## ⚖️ License

MIT License

See [LICENSE](LICENSE) for details.
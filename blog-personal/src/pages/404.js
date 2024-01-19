import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Youtube from "../components/youtube"
import { graphql } from "gatsby"

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const hyperlinks = data.site.siteMetadata.hyperlinks

  return (
    <Layout location={location} title={siteTitle} hyperlinks={hyperlinks}>
      <h1>404: Stránka nenalezena</h1>
      <p>Něco by tu možná mělo být. Ale není...</p>
      <Youtube
        videoId="X_-q9xeOgG4"
        title="Always look on the bright side of life."
      />
    </Layout>
  )
}

export const Head = () => <Seo title="404: Stránka nenalezena" />

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        hyperlinks {
          devBlog
          manaOutpost
          email
        }
      }
    }
  }
`

import * as React from "react"

import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const readTimeEstimate = require("read-time-estimate")

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
  const hyperlinks = data.site.siteMetadata.hyperlinks

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle} hyperlinks={hyperlinks}>
        <Bio />
        <p>Zatím zde není žádný příspěvek.</p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle} hyperlinks={hyperlinks}>
      <Bio />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const date = new Date(post.frontmatter.date)
          const localizedDate = date.toLocaleDateString("cs-CZ")
          const {
            // humanizedDuration, // 'less than a minute'
            duration, // 0.23272727272727273
            // totalWords, // 9
            // wordTime, // 0.03272727272727273
            // totalImages, // 1
            // imageTime, //  0.2
            // otherLanguageTimeCharacters, // 6
            // otherLanguageTime, // 0.012
          } = readTimeEstimate(post.html)
          // const readingTime = Math.ceil(post.fields.readTimeEstimate?.duration)
          const readingTime = Math.ceil(duration)

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>
                    {localizedDate} &bull;{" "}
                    <span role="img" aria-label="coffee emoji reading time">
                      ☕️
                    </span>{" "}
                    {readingTime} min čtení
                  </small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = ({ data }) => {
  const name = data.site.siteMetadata?.author?.name || `Blog`
  return <Seo title={name} />
}

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
        hyperlinks {
          devBlog
          manaOutpost
          email
        }
        author {
          name
        }
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        html
        excerpt
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
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`

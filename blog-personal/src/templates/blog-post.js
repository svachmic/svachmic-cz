import * as React from "react"

import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const readTimeEstimate = require("read-time-estimate")

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const hyperlinks = site.siteMetadata.hyperlinks
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
    <Layout location={location} title={siteTitle} hyperlinks={hyperlinks}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>
            {localizedDate} &bull;{" "}
            <span role="img" aria-label="coffee emoji reading time">
              ☕️
            </span>{" "}
            {readingTime} min čtení
          </p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark: post, site }, location }) => {
  const siteUrl = site.siteMetadata?.siteUrl || "https://blog.svachmic.cz"
  const slug = post.fields?.slug || ""
  
  // Look for header image in the post content (common pattern in your blog)
  const headerImageMatch = post.html.match(/<img[^>]+src="([^">]+)"[^>]*alt="[Zz]áhlaví"/)
  const headerImage = headerImageMatch ? headerImageMatch[1] : null
  
  // Get tags from frontmatter
  const tags = post.frontmatter.tags || []
  
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
      image={headerImage}
      article={true}
      publishedDate={post.frontmatter.date}
      tags={tags}
      author={post.frontmatter.author}
    >
      {/* Additional structured data for articles */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.frontmatter.title,
          "description": post.frontmatter.description || post.excerpt,
          "image": headerImage ? `${siteUrl}${headerImage}` : `${siteUrl}/content/assets/profile-pic.jpg`,
          "author": {
            "@type": "Person",
            "name": post.frontmatter.author || "Michal Švácha"
          },
          "publisher": {
            "@type": "Organization",
            "name": "svachmic.cz",
            "logo": {
              "@type": "ImageObject",
              "url": `${siteUrl}/content/assets/favicon.png`
            }
          },
          "datePublished": post.frontmatter.date,
          "dateModified": post.frontmatter.date,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${siteUrl}${slug}`
          }
        })}
      </script>
    </Seo>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        siteUrl
        hyperlinks {
          devBlog
          manaOutpost
          email
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        author
        tags
      }
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
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`

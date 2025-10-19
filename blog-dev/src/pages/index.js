import * as React from "react"
import { useState, useMemo } from "react"

import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import TagFilter from "../components/tag-filter"

const readTimeEstimate = require("read-time-estimate")

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
  const hyperlinks = data.site.siteMetadata.hyperlinks

  // State for selected tags
  const [selectedTags, setSelectedTags] = useState([])

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set()
    posts.forEach(post => {
      if (post.frontmatter.tags) {
        post.frontmatter.tags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  }, [posts])

  // Filter posts based on selected tags
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return posts

    return posts.filter(post => {
      if (!post.frontmatter.tags) return false
      return selectedTags.some(tag => post.frontmatter.tags.includes(tag))
    })
  }, [posts, selectedTags])

  // Handle tag toggle
  const handleTagToggle = (tag) => {
    if (tag === null) {
      // Clear all filters
      setSelectedTags([])
    } else {
      setSelectedTags(prev =>
        prev.includes(tag)
          ? prev.filter(t => t !== tag)
          : [...prev, tag]
      )
    }
  }

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
      {allTags.length > 0 && (
        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
      )}
      {filteredPosts.length === 0 && selectedTags.length > 0 && (
        <p>Žádné příspěvky neodpovídají vybraným filtrům.</p>
      )}
      <ol style={{ listStyle: `none` }}>
        {filteredPosts.map(post => {
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
                  {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                    <div className="post-tags">
                      {post.frontmatter.tags.map(tag => (
                        <span key={tag} className="post-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
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
          personal
          github
          stackoverflow
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
          tags
        }
      }
    }
  }
`

/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"

import { graphql, useStaticQuery } from "gatsby"

const Seo = ({ 
  description, 
  title, 
  image, 
  article = false,
  publishedDate,
  modifiedDate,
  tags = [],
  author,
  children 
}) => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          siteUrl
          author {
            name
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const siteUrl = site.siteMetadata?.siteUrl
  const twitterUsername = site.siteMetadata?.social?.twitter
  const authorName = author || site.siteMetadata?.author?.name

  // Create full image URL if image is provided
  const fullImageUrl = image 
    ? (image.startsWith('http') ? image : `${siteUrl}${image}`)
    : `${siteUrl}/content/assets/profile-pic.jpg` // fallback to profile pic

  // Determine Twitter card type based on whether we have an image
  const twitterCardType = image ? "summary_large_image" : "summary"

  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="description" content={metaDescription} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={`${title} - ${defaultTitle}`} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:locale" content="cs_CZ" />
      
      {/* Article-specific Open Graph tags */}
      {article && (
        <>
          {publishedDate && <meta property="article:published_time" content={publishedDate} />}
          {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
          {authorName && <meta property="article:author" content={authorName} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:creator" content={twitterUsername ? `@${twitterUsername}` : ``} />
      <meta name="twitter:site" content={twitterUsername ? `@${twitterUsername}` : ``} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={`${title} - ${defaultTitle}`} />
      
      {/* Additional meta tags for better SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={authorName} />
      <link rel="canonical" href={siteUrl} />
      
      {children}
    </>
  )
}

export default Seo

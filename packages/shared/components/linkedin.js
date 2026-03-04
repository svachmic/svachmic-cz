import React from "react"

const LinkedIn = ({ postUrl, title = "LinkedIn Post" }) => {
  const createLinkedInEmbed = () => {
    return {
      __html: `
        <iframe
          src="https://www.linkedin.com/embed/feed/update/${encodeURIComponent(postUrl)}"
          height="500"
          width="100%"
          allowfullscreen=""
          title="${title}"
          style="border: none; max-width: 100%;">
        </iframe>
      `
    }
  }

  return (
    <div className="linkedin-embed-container">
      <div
        dangerouslySetInnerHTML={createLinkedInEmbed()}
      />
      <p className="linkedin-embed-fallback">
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="linkedin-embed-link"
        >
          View on LinkedIn →
        </a>
      </p>
    </div>
  )
}

export default LinkedIn

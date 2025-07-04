import React from "react"

const LinkedIn = ({ postUrl, title = "LinkedIn Post" }) => {
  // Create a more reliable embed approach using LinkedIn's oEmbed-like functionality
  const createLinkedInEmbed = () => {
    return {
      __html: `
        <iframe 
          src="https://www.linkedin.com/embed/feed/update/${encodeURIComponent(postUrl)}" 
          height="500" 
          width="100%" 
          frameborder="0" 
          allowfullscreen="" 
          title="${title}"
          style="border: none; max-width: 100%;">
        </iframe>
      `
    }
  }

  return (
    <div className="linkedin-embed-container" style={{ margin: '20px 0' }}>
      <div 
        dangerouslySetInnerHTML={createLinkedInEmbed()}
      />
      <p style={{ 
        fontSize: '14px', 
        color: '#666', 
        textAlign: 'center', 
        marginTop: '10px' 
      }}>
        <a 
          href={postUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#0077b5', textDecoration: 'none' }}
        >
          View on LinkedIn →
        </a>
      </p>
    </div>
  )
}

export default LinkedIn 
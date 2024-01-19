import React from "react"

const Youtube = ({ videoId, title }) => {
  const videoUrl = `https://www.youtube.com/embed/${videoId}`

  return (
    <div className="iframe-container">
      <iframe
        className="iframe-responsive"
        title={title}
        src={videoUrl}
        referrerpolicy="no-referrer-when-downgrade"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullscreen
      />
    </div>
  )
}

export default Youtube

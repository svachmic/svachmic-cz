import React from "react"

const Youtube = ({ videoId, title }) => {
  const videoUrl = `https://www.youtube.com/embed/${videoId}`

  return (
    <div class="iframe-container">
      <iframe
        class="iframe-responsive"
        title={title}
        src={videoUrl}
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullscreen
      />
    </div>
  )
}

export default Youtube

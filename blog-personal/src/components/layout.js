import { Link } from "gatsby"
import React from "react"

const Layout = ({ location, title, children, hyperlinks }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
      <div style={{ float: 'right' }}>
          <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
            rss
          </a>
        </div>
        <a
          href={hyperlinks.pixeesoft}
          target="_blank"
          rel="noopener noreferrer"
        >
          pixeesoft
        </a>{' '}
        &bull;{' '}
        <a
          href={hyperlinks.email}
        >
          kontakt
        </a>
      </footer>
    </div>
  )
}

export default Layout

import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import ContributionGraph from "../components/contribution-graph";

function formatNumber(n) {
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const IndexPage = ({ data }) => {
  const calendar = data.contributionCalendar;
  const now = data.nowStatus;
  const repo = data.featuredRepo;
  const profilePic = getImage(data.profilePic);

  return (
    <div className="container">
      {/* Hero */}
      <header className="hero">
        {profilePic && (
          <GatsbyImage
            image={profilePic}
            alt="Michal Švácha"
            className="hero__photo"
            imgStyle={{ borderRadius: "50%" }}
          />
        )}
        <div className="hero__text">
          <h1 className="hero__name">Michal Švácha</h1>
          <p className="hero__tagline">
            Staff Engineer @{" "}
            <a
              href="https://www.sonarsource.com/?utm_term=michalsvacha"
              className="hero__employer"
              target="_blank"
              rel="noopener noreferrer"
            >
              SonarSource
            </a>{" "}
            🐳
          </p>
          <p className="hero__location">
            <svg
              className="hero__location-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Ženeva, Švýcarsko 🇨🇭
          </p>
        </div>
      </header>

      {/* Now */}
      {now?.text && (
        <section className="now">
          <span className="now__label">Teď</span>
          <p className="now__text">
            {now.segments.map((seg, i) =>
              seg.type === "text" ? (
                <React.Fragment key={i}>{seg.value}</React.Fragment>
              ) : (
                <a
                  key={i}
                  href={seg.url}
                  className="now__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="now__link-title">{seg.value}</span>
                  <span className="now__link-domain">{seg.domain}</span>
                </a>
              ),
            )}
          </p>
          {now.date && (
            <time className="now__date" dateTime={now.date}>
              {formatDate(now.date)}
            </time>
          )}
        </section>
      )}

      {/* Spotify */}
      <section className="spotify">
        <span className="spotify__label">Poslouchám</span>
        <div className="spotify__embed">
          <iframe
            src="https://open.spotify.com/embed/playlist/2azYX0WFHEeXVwn7VtAe62?utm_source=generator&theme=0"
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify playlist"
          />
        </div>
      </section>

      {/* Contribution Graph */}
      {calendar && (
        <ContributionGraph
          weeks={calendar.weeks}
          months={calendar.months}
          totalContributions={calendar.totalContributions}
        />
      )}

      {/* Featured Project */}
      <section className="featured">
        <a
          href="https://github.com/svachmic/gbkt"
          className="featured__card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/gbkt-logo.png"
            alt="gbkt logo"
            className="featured__logo"
            width="72"
            height="83"
          />
          <div className="featured__info">
            <h2 className="featured__name">gbkt</h2>
            <p className="featured__desc">
              Kotlin DSL framework pro vývoj retro her na Game Boy
            </p>
            {repo && (
              <div className="featured__stats">
                <span className="featured__stat">
                  <svg
                    className="featured__stat-icon"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M1 1h14L8 8l7 7H1z" />
                  </svg>
                  Kotlin
                </span>
                <span className="featured__stat">
                  <svg
                    className="featured__stat-icon"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M4 1.75C4 .784 4.784 0 5.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0 1 14.25 15h-9a.75.75 0 0 1 0-1.5h9a.25.25 0 0 0 .25-.25V5h-2.75A1.75 1.75 0 0 1 10 3.25V.5H5.75a.25.25 0 0 0-.25.25v7.5a.75.75 0 0 1-1.5 0Zm7.5-.188V3.25c0 .138.112.25.25.25h1.688L11.5 1.562ZM.753 11.5H5.25a.75.75 0 0 1 0 1.5H.753a.75.75 0 0 1 0-1.5ZM2.5 14h2.25a.75.75 0 0 1 0 1.5H2.5a.75.75 0 0 1 0-1.5Z" />
                  </svg>
                  {formatNumber(repo.loc)} LOC
                </span>
                <span className="featured__stat">
                  <svg
                    className="featured__stat-icon"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.25a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
                  </svg>
                  {repo.commits} commits
                </span>
                <span className="featured__stat">
                  <svg
                    className="featured__stat-icon"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8.75.75V2h.985c.304 0 .603.08.867.231l1.29.736c.038.022.08.033.124.033h2.234a.75.75 0 0 1 0 1.5h-2.234a2.007 2.007 0 0 1-.867-.231l-1.29-.736A.251.251 0 0 0 9.735 3.5H8.75V13h1.396c.862 0 1.689.3 2.351.849l.04.034a.75.75 0 0 1-.484 1.367H3.947a.75.75 0 0 1-.484-1.367l.04-.034A3.755 3.755 0 0 1 5.854 13H7.25V3.5H6.265a.25.25 0 0 0-.124.033l-1.29.736a2.008 2.008 0 0 1-.867.231H1.75a.75.75 0 0 1 0-1.5h2.234c.043 0 .086-.011.124-.033l1.29-.736c.264-.151.563-.231.867-.231H7.25V.75a.75.75 0 0 1 1.5 0Z" />
                  </svg>
                  {repo.license}
                </span>
              </div>
            )}
          </div>
          <svg
            className="featured__github"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </section>

      {/* Blog Cards */}
      <section className="blogs">
        <div className="blog-card blog-card--dark">
          <a
            href="https://dev.svachmic.cz?utm_source=svachmic.cz&utm_medium=homepage&utm_campaign=site_card"
            className="blog-card__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="blog-card__title">/dev/svachmic</h2>
            <p className="blog-card__desc">Technický blog o vývoji softwaru</p>
          </a>
          <a
            href="https://dev.svachmic.cz/rss.xml"
            className="blog-card__rss"
            aria-label="RSS feed pro /dev/svachmic"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="6.18" cy="17.82" r="2.18" />
              <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
            </svg>
          </a>
        </div>

        <div className="blog-card blog-card--light">
          <a
            href="https://blog.svachmic.cz?utm_source=svachmic.cz&utm_medium=homepage&utm_campaign=site_card"
            className="blog-card__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="blog-card__title">blog</h2>
            <p className="blog-card__desc">
              Osobní blog o kariéře, hrách a životě
            </p>
          </a>
          <a
            href="https://blog.svachmic.cz/rss.xml"
            className="blog-card__rss"
            aria-label="RSS feed pro blog.svachmic.cz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="6.18" cy="17.82" r="2.18" />
              <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
            </svg>
          </a>
        </div>

        <div className="blog-card blog-card--warm">
          <a
            href="https://magicgeneve.ch/en?utm_source=svachmic.cz&utm_medium=homepage&utm_campaign=site_card"
            className="blog-card__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="blog-card__title">Magic Genève</h2>
            <p className="blog-card__desc">MtG playgroup in Geneva</p>
          </a>
          <a
            href="https://magicgeneve.ch/en?utm_source=svachmic.cz&utm_medium=homepage&utm_campaign=site_card"
            className="blog-card__rss"
            aria-label="Otevřít Magic Genève"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
              <path d="M5 5v14h14v-7h-2v5H7V7h5V5H5z" />
            </svg>
          </a>
        </div>
      </section>

      {/* About */}
      <section className="about">
        <p>
          Softwarový inženýr s více než dekádou v oboru. Prošel cestu od
          vývojáře přes CTO startupu až zpátky k samotnému řemeslu — tentokrát
          ruku v ruce s AI. Věří, že umělá inteligence změní svět vývoje
          softwaru, a proto je v SonarSource, kde se stará o to, aby v SonarQube
          Cloudu fungovala nová rozšíření a funkce. Po večerech staví gbkt —
          Kotlin DSL pro tvorbu her na Game Boy. Dělá taky web a sociální sítě
          pro Magic Genève, švýcarský spolek pro Magic: The Gathering. A když
          zrovna neprogramuje, najdete ho u retro konzolí.
        </p>
      </section>

      {/* Social Links */}
      <section className="links">
        <a
          href="https://github.com/svachmic"
          className="links__item"
          aria-label="GitHub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a
          href="https://stackoverflow.com/users/1196908/michal"
          className="links__item"
          aria-label="StackOverflow"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M15 21h-10v-2h10v2zm6-11.665l-1.621-9.335-1.993.346 1.621 9.335 1.993-.346zm-5.964 6.937l-9.746-.975-.186 2.016 9.746.975.186-2.016zm.538-2.587l-9.276-2.608-.526 1.954 9.276 2.608.526-1.954zm1.204-2.413l-8.297-4.864-1.029 1.743 8.298 4.865 1.028-1.744zm1.866-1.467l-5.339-7.829-1.672 1.14 5.339 7.829 1.672-1.14zm-2.644 4.195v8h-12v-8h-2v10h16v-10h-2z" />
          </svg>
        </a>
        <a
          href="https://x.com/svachmic"
          className="links__item"
          aria-label="X / Twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a
          href="mailto:kontakt@svachmic.cz"
          className="links__item"
          aria-label="Email"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
          </svg>
        </a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 Michal Švácha</p>
      </footer>
    </div>
  );
};

export default IndexPage;

export const Head = ({ data }) => {
  const siteUrl = data.site.siteMetadata.siteUrl.replace(/\/$/, "");
  const title = data.site.siteMetadata.title;
  const description = data.site.siteMetadata.description;
  const twitterUsername = data.site.siteMetadata.social?.twitter;

  return (
    <>
      <html lang="cs" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${siteUrl}/`} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${siteUrl}/`} />
      <meta property="og:image" content={`${siteUrl}/profile-pic.jpg`} />
      <meta property="og:image:alt" content="Michal Švácha" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="cs_CZ" />
      <meta property="og:site_name" content={title} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterUsername && (
        <meta name="twitter:site" content={`@${twitterUsername}`} />
      )}
      {twitterUsername && (
        <meta name="twitter:creator" content={`@${twitterUsername}`} />
      )}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}/profile-pic.jpg`} />

      <meta name="robots" content="index, follow" />
      <meta name="author" content={title} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": `${siteUrl}/#person`,
              name: title,
              url: siteUrl,
              email: "kontakt@svachmic.cz",
              image: `${siteUrl}/profile-pic.jpg`,
              sameAs: [
                "https://github.com/svachmic",
                "https://stackoverflow.com/users/1196908/michal",
                "https://x.com/svachmic",
              ],
            },
            {
              "@type": "WebSite",
              url: siteUrl,
              name: title,
              description,
              inLanguage: "cs",
              author: {
                "@id": `${siteUrl}/#person`,
              },
            },
          ],
        })}
      </script>
    </>
  );
};

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
        description
        siteUrl
        social {
          twitter
        }
      }
    }
    nowStatus {
      text
      date
      segments {
        type
        value
        url
        domain
      }
    }
    featuredRepo {
      loc
      commits
      license
    }
    contributionCalendar {
      totalContributions
      weeks {
        contributionDays {
          date
          githubCount
          gitlabCount
          totalCount
          level
          source
        }
      }
      months {
        name
        number
        firstWeekIndex
        totalWeeks
      }
    }
    profilePic: file(relativePath: { eq: "profile-pic.jpg" }) {
      childImageSharp {
        gatsbyImageData(
          width: 160
          height: 160
          layout: CONSTRAINED
          placeholder: BLURRED
          quality: 90
        )
      }
    }
  }
`;

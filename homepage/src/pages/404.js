import * as React from "react";

const NotFoundPage = () => (
  <div className="container">
    <h1>404: Stránka nenalezena</h1>
    <p>
      Tato stránka neexistuje. <a href="/">Zpět na úvod</a>
    </p>
  </div>
);

export default NotFoundPage;

export const Head = () => (
  <>
    <html lang="cs" />
    <title>404: Stránka nenalezena | Michal Švácha</title>
    <meta
      name="description"
      content="Stránka nebyla nalezena. Vraťte se na úvodní stránku svachmic.cz."
    />
    <meta name="robots" content="noindex, nofollow" />
    <meta property="og:title" content="404: Stránka nenalezena" />
    <meta
      property="og:description"
      content="Stránka nebyla nalezena. Vraťte se na úvodní stránku svachmic.cz."
    />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Michal Švácha" />
    <meta property="og:locale" content="cs_CZ" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="404: Stránka nenalezena" />
    <meta
      name="twitter:description"
      content="Stránka nebyla nalezena. Vraťte se na úvodní stránku svachmic.cz."
    />
  </>
);

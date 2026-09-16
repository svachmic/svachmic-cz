import * as React from "react";

function isExternalHref(href) {
  if (!href) return false;
  try {
    const url = new URL(href, window.location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

const ExternalLinkTargets = () => {
  React.useEffect(() => {
    const onClick = event => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const el =
        event.target.nodeType === 1 ? event.target : event.target.parentElement;
      const a = el?.closest?.("a[href]");
      if (!a) return;

      const href = a.getAttribute("href");
      if (!isExternalHref(href)) return;

      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");

      // iOS Chrome ignores target=_blank on in-document links; open explicitly.
      event.preventDefault();
      window.open(a.href, "_blank", "noopener,noreferrer");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
};

export default ExternalLinkTargets;

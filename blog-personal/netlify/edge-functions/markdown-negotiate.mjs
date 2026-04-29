// Content negotiation for `Accept: text/markdown`.
// On the root path, returns /llms.txt (which is markdown-formatted) as the
// homepage's markdown representation. On post URLs, returns the build-time
// sidecar at public/{slug}/index.md. Otherwise passes through to HTML. Both
// branches set `Vary: Accept` so the CDN keys responses correctly.

const POST_PATH = /^\/\d{4}\/\d{2}\/[^/]+\/?$/;
const ROOT_PATH = /^\/$/;

let manifestCache = null;
async function getManifest(origin) {
  if (manifestCache) return manifestCache;
  try {
    const r = await fetch(new URL("/markdown-manifest.json", origin));
    if (r.ok) manifestCache = await r.json();
  } catch {
    // ignore — fall back to length-based estimate
  }
  return manifestCache || {};
}

function prefersMarkdown(accept) {
  if (!accept) return false;
  let best = { type: null, q: -1 };
  for (const part of accept.split(",")) {
    const [media, ...params] = part.trim().split(";").map((s) => s.trim());
    let q = 1;
    for (const p of params) {
      const m = p.match(/^q=([\d.]+)$/);
      if (m) q = parseFloat(m[1]);
    }
    if (q > best.q) best = { type: media.toLowerCase(), q };
  }
  return best.type === "text/markdown" || best.type === "text/x-markdown";
}

function appendVary(existing, value) {
  if (!existing) return value;
  return new RegExp(`\\b${value}\\b`, "i").test(existing)
    ? existing
    : `${existing}, ${value}`;
}

export default async (request, context) => {
  const url = new URL(request.url);
  const isRoot = ROOT_PATH.test(url.pathname);
  const isPost = POST_PATH.test(url.pathname);
  if (!isRoot && !isPost) return context.next();

  if (!prefersMarkdown(request.headers.get("accept"))) {
    const r = await context.next();
    r.headers.set("Vary", appendVary(r.headers.get("Vary"), "Accept"));
    return r;
  }

  const sourceUrl = isRoot
    ? new URL("/llms.txt", url.origin)
    : new URL(
        (url.pathname.endsWith("/") ? url.pathname : url.pathname + "/") +
          "index.md",
        url.origin,
      );
  const md = await fetch(sourceUrl);
  if (!md.ok) return context.next();

  const body = await md.text();
  let tokens;
  if (isPost) {
    const slug = url.pathname.endsWith("/") ? url.pathname : url.pathname + "/";
    const manifest = await getManifest(url.origin);
    tokens = manifest[slug]?.tokens ?? Math.ceil(body.length / 4);
  } else {
    tokens = Math.ceil(body.length / 4);
  }

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Markdown-Tokens": String(tokens),
      "Cache-Control": "public, max-age=0, must-revalidate",
      Vary: "Accept",
    },
  });
};

export const config = { path: "/*" };

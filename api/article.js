const fs = require("fs/promises");
const path = require("path");

const SITE_URL = "https://aurio.work";
const SITE_NAME = "aurio.work";
const DEFAULT_AUTHOR = "Aurio Rajaa";
const FULL_NAME = "Aurio Hendrianoko Rajaa";
const DEFAULT_IMAGE = "/profilepic.png";
const DEFAULT_DESCRIPTION =
  "Aurio Rajaa is a Jakarta-based software engineer focused on backend systems, cloud workflows, and full-stack product interfaces.";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const stripHtml = (value = "") =>
  String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncate = (value = "", maxLength = 160) => {
  const clean = stripHtml(value);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}...`;
};

const absoluteUrl = (value = "/") => {
  if (!value) return SITE_URL;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
};

const getDatabaseUrl = () => {
  const raw = process.env.FIREBASE_DATABASE_URL || process.env.REACT_APP_FIREBASE_DATABASE_URL;
  return raw ? raw.replace(/\/$/, "") : "";
};

const readIndexHtml = async (req) => {
  const candidates = [
    path.join(process.cwd(), "build", "index.html"),
    path.join(process.cwd(), "public", "index.html"),
    path.join(process.cwd(), "index.html"),
  ];

  for (const filePath of candidates) {
    try {
      return await fs.readFile(filePath, "utf8");
    } catch (_) {
      // Try the next known location.
    }
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host || "aurio.work";
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const response = await fetch(`${protocol}://${host}/index.html`);
  return response.text();
};

const fetchArticle = async (slug) => {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl || !slug) return null;

  const response = await fetch(`${databaseUrl}/articles.json`);
  if (!response.ok) return null;

  const data = await response.json();
  const articles = data && typeof data === "object" ? Object.values(data) : [];
  return articles.find((article) => article && article.slug === slug) || null;
};

const removeExistingMeta = (html) =>
  html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/\s*<meta\s+(?:name|property)=["'](?:title|description|author|keywords|robots|og:[^"']+|article:[^"']+|twitter:[^"']+)["'][^>]*>\s*/gi, "")
    .replace(/\s*<link\s+rel=["']canonical["'][^>]*>\s*/gi, "");

const articleMeta = (article, slug) => {
  const url = absoluteUrl(`/article/${article.slug || slug}`);
  const title = `${article.title || "Article"} | ${DEFAULT_AUTHOR}`;
  const description = truncate(article.excerpt || article.description || DEFAULT_DESCRIPTION, 155);
  const image = absoluteUrl(article.image || DEFAULT_IMAGE);
  const author = article.author || DEFAULT_AUTHOR;
  const keywords = [
    ...(Array.isArray(article.tags) ? article.tags : []),
    "Aurio Rajaa",
    "Aurio Hendrianoko Rajaa",
    "auriorajaa",
    "Java Developer",
    "Software Engineer",
  ].filter(Boolean).join(", ");
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    image: [image],
    datePublished: article.date,
    dateModified: article.updatedAt || article.date,
    author: {
      "@type": "Person",
      name: author,
      alternateName: FULL_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: DEFAULT_AUTHOR,
      alternateName: FULL_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return `
  <title>${escapeHtml(title)}</title>
  <link rel="canonical" href="${escapeHtml(url)}" />
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="author" content="${escapeHtml(author)}" />
  <meta name="keywords" content="${escapeHtml(keywords)}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
  <meta property="og:image:alt" content="${escapeHtml(article.title || "Article cover")}" />
  <meta property="og:locale" content="en_US" />
  <meta property="article:author" content="${escapeHtml(author)}" />
  ${article.date ? `<meta property="article:published_time" content="${escapeHtml(article.date)}" />` : ""}
  ${article.updatedAt ? `<meta property="article:modified_time" content="${escapeHtml(article.updatedAt)}" />` : ""}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@auriorajaa" />
  <meta name="twitter:creator" content="@auriorajaa" />
  <meta name="twitter:url" content="${escapeHtml(url)}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
  <meta name="twitter:image:alt" content="${escapeHtml(article.title || "Article cover")}" />
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;
};

module.exports = async (req, res) => {
  const slug = String(req.query.slug || "").split("/")[0];
  const indexHtml = await readIndexHtml(req);
  const article = await fetchArticle(slug);

  if (!article || (article.visibility && article.visibility !== "public")) {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(indexHtml);
    return;
  }

  const html = removeExistingMeta(indexHtml).replace("</head>", `${articleMeta(article, slug)}\n</head>`);

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=3600");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
};
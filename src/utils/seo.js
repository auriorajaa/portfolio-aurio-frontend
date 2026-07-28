export const SITE_URL = "https://aurio.work";
export const SITE_NAME = "aurio.work";
export const DEFAULT_AUTHOR = "Aurio Rajaa";
export const DEFAULT_TITLE = "Aurio Rajaa | Software Engineer Portfolio";
export const DEFAULT_DESCRIPTION =
  "Aurio Rajaa is a software engineer from Jakarta focused on backend systems, cloud workflows, and full-stack product interfaces.";
export const DEFAULT_IMAGE = "/profilepic.png";

export const absoluteUrl = (path = "/") => {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const truncate = (value = "", maxLength = 160) => {
  const clean = stripHtml(value);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}...`;
};

export const createPersonSchema = (personalInfo = {}) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: personalInfo.name || DEFAULT_AUTHOR,
  alternateName: ["Aurio Hendrianoko Rajaa", "auriorajaa"],
  url: SITE_URL,
  image: absoluteUrl(DEFAULT_IMAGE),
  jobTitle: personalInfo.title || "Software Engineer",
  description: personalInfo.seoDescription || personalInfo.bio || DEFAULT_DESCRIPTION,
  sameAs: [personalInfo.github, personalInfo.linkedin, personalInfo.twitter].filter(Boolean),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jakarta",
    addressRegion: "DKI Jakarta",
    addressCountry: "ID",
  },
  knowsAbout: [
    "Software Engineering",
    "Backend Engineering",
    "Spring Boot",
    "Django REST Framework",
    "React",
    "Next.js",
    "Java",
    "TypeScript",
    "Google Cloud Platform",
    "REST APIs",
  ],
});

export const createWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: DEFAULT_AUTHOR,
  description: DEFAULT_DESCRIPTION,
  inLanguage: "en-US",
  publisher: {
    "@type": "Person",
    name: DEFAULT_AUTHOR,
    url: SITE_URL,
  },
});

export const createBreadcrumbSchema = (items = []) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.item),
  })),
});

export const createArticleSchema = (article = {}, url = SITE_URL) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: truncate(article.excerpt || article.description, 180),
  image: article.image ? [absoluteUrl(article.image)] : [absoluteUrl(DEFAULT_IMAGE)],
  datePublished: article.date,
  dateModified: article.updatedAt || article.date,
  author: {
    "@type": "Person",
    name: article.author || DEFAULT_AUTHOR,
    url: SITE_URL,
  },
  publisher: {
    "@type": "Person",
    name: DEFAULT_AUTHOR,
    url: SITE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": url,
  },
});

export const createProjectSchema = (project = {}, url = SITE_URL) => {
  const schemaType = project.website ? "SoftwareApplication" : "CreativeWork";
  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: project.title,
    description: truncate(project.description, 220),
    url,
    image: project.image ? absoluteUrl(project.image) : absoluteUrl(DEFAULT_IMAGE),
    author: {
      "@type": "Person",
      name: DEFAULT_AUTHOR,
      url: SITE_URL,
    },
    creator: {
      "@type": "Person",
      name: DEFAULT_AUTHOR,
      url: SITE_URL,
    },
    keywords: (project.tags || []).join(", "),
    sameAs: [project.github, project.website].filter(Boolean),
  };

  if (schemaType === "SoftwareApplication") {
    schema.applicationCategory = "DeveloperApplication";
    schema.operatingSystem = "Web";
  }

  return schema;
};
import { generateSlug } from "./slugify";

export const isGithubTemporaryAssetUrl = (value = "") => {
  try {
    const { hostname } = new URL(value);
    return hostname.startsWith("github-production-user-asset-") && hostname.endsWith(".s3.amazonaws.com");
  } catch {
    return false;
  }
};

export const getStableProjectImageUrl = (value = "") => {
  if (!value || !isGithubTemporaryAssetUrl(value)) return value;

  try {
    const { pathname } = new URL(value);
    const filename = pathname.split("/").filter(Boolean).pop() || "";
    const match = filename.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
    return match ? "https://github.com/user-attachments/assets/" + match[1] : value;
  } catch {
    return value;
  }
};

export const normalizeProject = (project = {}) => {
  const fallbackGallery = project.image
    ? [
        {
          id: `${project.id || project.title || "project"}-cover`,
          type: "image",
          url: getStableProjectImageUrl(project.image),
          title: "Cover",
          caption: project.description || "",
          alt: project.title || "Project preview",
          thumbnail: getStableProjectImageUrl(project.image),
          order: 0,
        },
      ]
    : [];

  const gallery = Array.isArray(project.gallery) && project.gallery.length > 0
    ? project.gallery
        .filter((item) => item?.url)
        .map((item, index) => ({
          id: item.id || `${project.id || project.title || "project"}-${index}`,
          type: "image",
          url: getStableProjectImageUrl(item.url),
          title: item.title || `Screen ${index + 1}`,
          caption: item.caption || "",
          alt: item.alt || `${project.title || "Project"} showcase ${index + 1}`,
          thumbnail: getStableProjectImageUrl(item.thumbnail || item.url),
          order: Number.isFinite(Number(item.order)) ? Number(item.order) : index,
        }))
        .sort((a, b) => a.order - b.order)
    : fallbackGallery;

  return {
    ...project,
    slug: project.slug || generateSlug(project.title || `project-${project.id || "untitled"}`),
    role: project.role || "Full-stack Developer",
    period: project.period || "",
    status: project.status || "Published",
    highlights: Array.isArray(project.highlights) ? project.highlights : [],
    gallery,
    image: getStableProjectImageUrl(project.image || gallery.find((item) => item.type === "image")?.url || ""),
    tags: Array.isArray(project.tags) ? project.tags : [],
  };
};

export const normalizeProjects = (projects = []) =>
  projects
    .map((project, index) =>
      normalizeProject({
        ...project,
        order: Number.isFinite(Number(project?.order)) ? Number(project.order) : index,
      }),
    )
    .sort((a, b) => a.order - b.order);

export const isPdfUrl = () => false;

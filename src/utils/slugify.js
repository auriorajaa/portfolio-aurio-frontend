// src/utils/slugify.js

/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to slugify
 * @returns {string} - The slugified text
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Generate a unique slug by appending a counter if needed
 * @param {string} baseSlug - The base slug
 * @param {Array} existingSlugs - Array of existing slugs
 * @returns {string} - A unique slug
 */
export const generateUniqueSlug = (baseSlug, existingSlugs) => {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

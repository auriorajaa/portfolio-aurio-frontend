// src/services/articleService.js
import {
  ref,
  set,
  get,
  update,
  remove,
  push,
} from "firebase/database";
import { database } from "../config/firebase";
import { generateSlug, generateUniqueSlug } from "../utils/slugify";

const ARTICLES_PATH = "articles";

// Calculate read time based on content length
export const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ""); // Strip HTML tags
  const wordCount = textContent.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};

// Create a new article
export const createArticle = async (articleData) => {
  try {
    const articlesRef = ref(database, ARTICLES_PATH);
    const newArticleRef = push(articlesRef);

    // Get all existing articles to ensure slug uniqueness
    const allArticles = await getAllArticles();
    const existingSlugs = allArticles.map((a) => a.slug).filter(Boolean);

    // Generate unique slug from title
    const baseSlug = generateSlug(articleData.title);
    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);

    const article = {
      id: newArticleRef.key,
      ...articleData,
      slug: uniqueSlug,
      readTime: calculateReadTime(articleData.description),
      author: "Aurio Rajaa",
      date: new Date().toISOString(),
    };

    await set(newArticleRef, article);
    return article;
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
};

// Get all articles
export const getAllArticles = async () => {
  try {
    const articlesRef = ref(database, ARTICLES_PATH);
    const snapshot = await get(articlesRef);

    if (snapshot.exists()) {
      const articlesObj = snapshot.val();
      return Object.values(articlesObj);
    }
    return [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

// Get featured articles
export const getFeaturedArticles = async () => {
  try {
    const articles = await getAllArticles();
    return articles.filter((article) => article.featured === true);
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    throw error;
  }
};

// Get article by ID
export const getArticleById = async (articleId) => {
  try {
    const articleRef = ref(database, `${ARTICLES_PATH}/${articleId}`);
    const snapshot = await get(articleRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
};

// Get article by slug
export const getArticleBySlug = async (slug) => {
  try {
    const articles = await getAllArticles();
    return articles.find((article) => article.slug === slug) || null;
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    throw error;
  }
};

// Update an existing article
export const updateArticle = async (articleId, updates) => {
  try {
    const articleRef = ref(database, `${ARTICLES_PATH}/${articleId}`);

    // Recalculate read time if description was updated
    if (updates.description) {
      updates.readTime = calculateReadTime(updates.description);
    }

    // Regenerate slug if title was updated
    if (updates.title) {
      const allArticles = await getAllArticles();
      const existingSlugs = allArticles
        .filter((a) => a.id !== articleId)
        .map((a) => a.slug)
        .filter(Boolean);

      const baseSlug = generateSlug(updates.title);
      updates.slug = generateUniqueSlug(baseSlug, existingSlugs);
    }

    await update(articleRef, updates);
    return { id: articleId, ...updates };
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};

// Delete an article
export const deleteArticle = async (articleId) => {
  try {
    const articleRef = ref(database, `${ARTICLES_PATH}/${articleId}`);
    await remove(articleRef);
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

// Get articles by category
export const getArticlesByCategory = async (category) => {
  try {
    const articles = await getAllArticles();
    return articles.filter((article) => article.category === category);
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    throw error;
  }
};

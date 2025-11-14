// src/data/articlesData.js

export const categories = [
  { id: "all", name: "All Articles", slug: "all" },
  { id: "news", name: "Tech News", slug: "news" },
  { id: "tutorials", name: "Tutorials", slug: "tutorials" },
  { id: "tips", name: "Tips & Tricks", slug: "tips" },
  { id: "reviews", name: "Reviews", slug: "reviews" },
  { id: "career", name: "Career", slug: "career" },
];

export const articlesData = [
  {
    id: 1,
    title: "Building Scalable Microservices with Spring Boot",
    excerpt:
      "Learn how to design and implement microservices architecture using Spring Boot, Docker, and Kubernetes for production-ready applications.",
    description:
      "A comprehensive guide to building scalable microservices with Spring Boot. We'll cover service discovery, API gateway patterns, distributed tracing, and deployment strategies.",
    category: "tutorials",
    categoryLabel: "Tutorial",
    date: "2024-11-10",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    author: "Aurio Rajaa",
    featured: true,
    tags: ["Spring Boot", "Microservices", "Docker", "Kubernetes"],
  },
  {
    id: 2,
    title: "React 19: What's New and Exciting",
    excerpt:
      "Exploring the latest features in React 19 including Server Components, improved hooks, and performance optimizations.",
    description:
      "React 19 brings revolutionary changes to the way we build web applications. Let's dive into the new features and how they improve developer experience.",
    category: "news",
    categoryLabel: "Tech News",
    date: "2024-11-08",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    author: "Aurio Rajaa",
    featured: true,
    tags: ["React", "JavaScript", "Web Development"],
  },
  {
    id: 3,
    title: "10 Essential Git Commands Every Developer Should Know",
    excerpt:
      "Master these fundamental Git commands to streamline your development workflow and collaborate more effectively.",
    description:
      "Git is an essential tool for modern software development. Here are the most important commands you need to know to work efficiently.",
    category: "tips",
    categoryLabel: "Tips & Tricks",
    date: "2024-11-05",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80",
    author: "Aurio Rajaa",
    featured: true,
    tags: ["Git", "Version Control", "Productivity"],
  },
  {
    id: 4,
    title: "PostgreSQL vs MySQL: Which Database to Choose?",
    excerpt:
      "A detailed comparison of PostgreSQL and MySQL to help you make an informed decision for your next project.",
    description:
      "Choosing the right database is crucial for your application's success. Let's compare PostgreSQL and MySQL across various aspects.",
    category: "reviews",
    categoryLabel: "Review",
    date: "2024-11-03",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
    author: "Aurio Rajaa",
    featured: false,
    tags: ["Database", "PostgreSQL", "MySQL"],
  },
  {
    id: 5,
    title: "How to Land Your First Tech Job as a Fresh Graduate",
    excerpt:
      "Practical advice and strategies for new graduates looking to break into the tech industry.",
    description:
      "Starting your career in tech can be challenging. Here's a comprehensive guide to help you land your first job.",
    category: "career",
    categoryLabel: "Career",
    date: "2024-10-30",
    readTime: "10 min read",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    author: "Aurio Rajaa",
    featured: false,
    tags: ["Career", "Interview", "Job Search"],
  },
  {
    id: 6,
    title: "Advanced TypeScript Patterns for Large Applications",
    excerpt:
      "Explore advanced TypeScript patterns and techniques to build maintainable large-scale applications.",
    description:
      "TypeScript offers powerful features for building robust applications. Let's explore advanced patterns used in production.",
    category: "tutorials",
    categoryLabel: "Tutorial",
    date: "2024-10-28",
    readTime: "12 min read",
    image:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
    author: "Aurio Rajaa",
    featured: false,
    tags: ["TypeScript", "JavaScript", "Design Patterns"],
  },
  {
    id: 7,
    title: "Optimizing Next.js Performance: Best Practices",
    excerpt:
      "Learn how to optimize your Next.js applications for better performance and user experience.",
    description:
      "Performance optimization is crucial for modern web applications. Here are the best practices for Next.js.",
    category: "tips",
    categoryLabel: "Tips & Tricks",
    date: "2024-10-25",
    readTime: "9 min read",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    author: "Aurio Rajaa",
    featured: false,
    tags: ["Next.js", "Performance", "Optimization"],
  },
  {
    id: 8,
    title: "Docker Best Practices for Production Deployments",
    excerpt:
      "Essential Docker best practices to ensure your containers are secure, efficient, and production-ready.",
    description:
      "Deploying with Docker requires careful consideration. Learn the best practices for production environments.",
    category: "tutorials",
    categoryLabel: "Tutorial",
    date: "2024-10-22",
    readTime: "11 min read",
    image:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
    author: "Aurio Rajaa",
    featured: false,
    tags: ["Docker", "DevOps", "Deployment"],
  },
  {
    id: 9,
    title: "AI and Machine Learning Trends in 2024",
    excerpt:
      "Discover the latest trends in AI and machine learning that are shaping the future of technology.",
    description:
      "AI is evolving rapidly. Let's explore the most significant trends and innovations in 2024.",
    category: "news",
    categoryLabel: "Tech News",
    date: "2024-10-20",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    author: "Aurio Rajaa",
    featured: false,
    tags: ["AI", "Machine Learning", "Technology"],
  },
  {
    id: 10,
    title: "Building RESTful APIs: A Complete Guide",
    excerpt:
      "A comprehensive guide to designing and implementing RESTful APIs following industry best practices.",
    description:
      "RESTful APIs are the backbone of modern web applications. Learn how to build them the right way.",
    category: "tutorials",
    categoryLabel: "Tutorial",
    date: "2024-10-18",
    readTime: "15 min read",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    author: "Aurio Rajaa",
    featured: false,
    tags: ["REST API", "Backend", "Web Development"],
  },
];

// Mock API response format
export const getArticles = (page = 1, limit = 5, category = "all") => {
  let filtered = articlesData;

  if (category !== "all") {
    filtered = articlesData.filter((article) => article.category === category);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedArticles = filtered.slice(startIndex, endIndex);

  return {
    data: paginatedArticles,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      hasMore: endIndex < filtered.length,
    },
  };
};

export const getFeaturedArticles = () => {
  return articlesData.filter((article) => article.featured);
};

export const getArticlesByCategory = (category, limit = 10) => {
  return articlesData
    .filter((article) => article.category === category)
    .slice(0, limit);
};

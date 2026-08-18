import { fetchJson, PublicApiError } from "./publicApi";

const TRIVIA_URL = "https://opentdb.com/api.php";

export const TRIVIA_CATEGORIES = [
  { id: 0, label: "Any category" },
  { id: 9, label: "General knowledge" },
  { id: 11, label: "Film" },
  { id: 17, label: "Science" },
  { id: 18, label: "Computers" },
  { id: 21, label: "Sports" },
  { id: 23, label: "History" },
];

export const FALLBACK_TRIVIA = [
  {
    id: "fallback-1",
    question: "Which language runs in a web browser?",
    category: "Computers",
    difficulty: "easy",
    answers: ["JavaScript", "Python", "Java", "C++"],
    answer: "JavaScript",
  },
  {
    id: "fallback-2",
    question: "Which planet is known as the Red Planet?",
    category: "Science",
    difficulty: "easy",
    answers: ["Mars", "Venus", "Jupiter", "Mercury"],
    answer: "Mars",
  },
];

const decodeHtml = (value) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
};

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const normalizeQuestion = (item, index) => {
  const question = decodeHtml(item.question || "");
  const answer = decodeHtml(item.correct_answer || "");
  const incorrect = (item.incorrect_answers || []).map(decodeHtml);
  if (!question || !answer || incorrect.length < 1) return null;
  return {
    id: `trivia-${index}-${answer}`,
    question,
    category: decodeHtml(item.category || "General knowledge"),
    difficulty: item.difficulty || "mixed",
    answers: shuffle([answer, ...incorrect]),
    answer,
  };
};

export const getTriviaQuestions = async ({ category = 0, difficulty = "any", amount = 5, signal } = {}) => {
  const params = new URLSearchParams({ amount: String(amount), type: "multiple" });
  if (Number(category)) params.set("category", String(category));
  if (difficulty !== "any") params.set("difficulty", difficulty);

  const data = await fetchJson(`${TRIVIA_URL}?${params.toString()}`, { signal });
  if (data?.response_code === 1) {
    throw new PublicApiError("EMPTY", "No questions were returned.");
  }
  if (data?.response_code && data.response_code !== 0) {
    throw new PublicApiError("TRIVIA_ERROR", "Questions are not available right now.");
  }

  const questions = (data?.results || []).map(normalizeQuestion).filter(Boolean);
  if (!questions.length) throw new PublicApiError("EMPTY", "No questions were returned.");
  return questions;
};

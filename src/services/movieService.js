import { fetchJson, PublicApiError } from "./publicApi";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const apiKey = process.env.REACT_APP_TMDB_API_KEY;
let imageConfigCache;
let genresCache;

const FALLBACK_GENRES = [
  [28, "Action"], [12, "Adventure"], [16, "Animation"], [35, "Comedy"],
  [80, "Crime"], [99, "Documentary"], [18, "Drama"], [10751, "Family"],
  [14, "Fantasy"], [36, "History"], [27, "Horror"], [10402, "Music"],
  [9648, "Mystery"], [10749, "Romance"], [878, "Science Fiction"],
  [53, "Thriller"], [10752, "War"], [37, "Western"],
].map(([id, name]) => ({ id, name }));

const requireApiKey = () => {
  if (!apiKey) throw new PublicApiError("MISSING_KEY", "The movie service is not configured.");
  return apiKey;
};

const tmdbRequest = (path, params = {}, options = {}) => {
  const query = new URLSearchParams({ api_key: requireApiKey(), language: "en-US", ...params });
  return fetchJson(`${TMDB_BASE_URL}${path}?${query.toString()}`, options);
};

const normalizeMovie = (movie) => ({
  id: movie.id,
  title: movie.title || movie.original_title || "Untitled movie",
  overview: movie.overview || "No overview available.",
  releaseDate: movie.release_date || "",
  year: movie.release_date ? movie.release_date.slice(0, 4) : "-",
  rating: Number.isFinite(Number(movie.vote_average)) ? Number(movie.vote_average).toFixed(1) : "-",
  popularity: Number(movie.popularity) || 0,
  posterPath: movie.poster_path || "",
  backdropPath: movie.backdrop_path || "",
  genreIds: Array.isArray(movie.genre_ids) ? movie.genre_ids : [],
  genres: movie.genres || [],
  runtime: movie.runtime || null,
});

export const getMovieGenres = async ({ signal } = {}) => {
  if (genresCache?.length) return genresCache;
  try {
    const data = await tmdbRequest("/genre/movie/list", {}, { signal });
    const genres = Array.isArray(data?.genres) ? data.genres.filter((item) => item?.id && item?.name) : [];
    if (genres.length) genresCache = genres;
    return genres.length ? genres : FALLBACK_GENRES;
  } catch (error) {
    if (error.code === "ABORTED") throw error;
    return FALLBACK_GENRES;
  }
};

const getImageConfig = async ({ signal } = {}) => {
  if (imageConfigCache) return imageConfigCache;
  const data = await tmdbRequest("/configuration", {}, { signal });
  imageConfigCache = data.images;
  return imageConfigCache;
};

export const getMovieImageUrl = async (path, { size = "w500", signal } = {}) => {
  if (!path) return "";
  const config = await getImageConfig({ signal });
  const posterSizes = config?.poster_sizes || [];
  const imageSize = posterSizes.includes(size) ? size : posterSizes[posterSizes.length - 1];
  return config?.secure_base_url && imageSize ? `${config.secure_base_url}${imageSize}${path}` : "";
};

const sortMovies = (movies, sort) => [...movies].sort((a, b) => {
  if (sort === "primary_release_date.desc") return (b.releaseDate || "").localeCompare(a.releaseDate || "");
  if (sort === "vote_average.desc") return Number(b.rating) - Number(a.rating);
  return b.popularity - a.popularity;
});

export const searchMovies = async ({ query = "", genre = "", sort = "popularity.desc", signal } = {}) => {
  const cleanQuery = query.trim();
  const path = cleanQuery ? "/search/movie" : "/discover/movie";
  const params = cleanQuery
    ? { query: cleanQuery, include_adult: "false" }
    : { include_adult: "false", sort_by: sort, ...(genre ? { with_genres: genre } : {}) };
  const data = await tmdbRequest(path, params, { signal });
  let movies = (Array.isArray(data?.results) ? data.results : []).map(normalizeMovie);
  if (cleanQuery && genre) movies = movies.filter((movie) => movie.genreIds.includes(Number(genre)));
  return sortMovies(movies, sort);
};

export const getMovieDetails = async (id, { signal } = {}) => {
  if (!id) throw new PublicApiError("NOT_FOUND", "Could not load movie details.");
  const data = await tmdbRequest(`/movie/${id}`, {}, { signal });
  return normalizeMovie(data);
};
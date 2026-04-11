
const API_KEY  = 'a4ec840e4be393709badb4bf164b488f'; // 🔑 Replace with your TMDB key
const BASE_URL = 'https://api.themoviedb.org/3';

export const IMAGE_BASE    = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w780';

export const FILTERS = [
  { key: 'popular',   label: 'Popular'   },
  { key: 'top_rated', label: 'Top Rated' },
  { key: 'upcoming',  label: 'Upcoming'  },
  { key: 'animation', label: 'Animation' },
];

export const fetchMovies = async (filter = 'popular', page = 1) => {
  const map = {
    popular:   `${BASE_URL}/movie/popular`,
    top_rated: `${BASE_URL}/movie/top_rated`,
    upcoming:  `${BASE_URL}/movie/upcoming`,
    animation: `${BASE_URL}/discover/movie?with_genres=16`,
  };
  const base = map[filter] || map.popular;
  const sep  = base.includes('?') ? '&' : '?';
  const res  = await fetch(`${base}${sep}api_key=${API_KEY}&language=en-US&page=${page}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} — check your API key`);
  return res.json();
};

export const searchMovies = async (query) => {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const fetchMovieDetails = async (id) => {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};
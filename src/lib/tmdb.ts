import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getPopularMovies = async (page = 1) => {
  const response = await tmdbApi.get('/movie/popular', {
    params: { page },
  });
  
  // Fetch additional details for each movie
  const moviesWithDetails = await Promise.all(
    response.data.results.map(async (movie: any) => {
      const details = await getMovieDetails(movie.id);
      return {
        ...movie,
        credits: details.credits,
        director: details.credits.crew.find((person: any) => person.job === 'Director')
      };
    })
  );

  return { ...response.data, results: moviesWithDetails };
};

export const searchMovies = async (query: string, page = 1) => {
  const response = await tmdbApi.get('/search/movie', {
    params: { query, page },
  });

  // Fetch additional details for each movie
  const moviesWithDetails = await Promise.all(
    response.data.results.map(async (movie: any) => {
      const details = await getMovieDetails(movie.id);
      return {
        ...movie,
        credits: details.credits,
        director: details.credits.crew.find((person: any) => person.job === 'Director')
      };
    })
  );

  return { ...response.data, results: moviesWithDetails };
};

export const getMovieDetails = async (movieId: number) => {
  const response = await tmdbApi.get(`/movie/${movieId}`, {
    params: {
      append_to_response: 'credits'
    }
  });
  return response.data;
};

export const searchPerson = async (query: string) => {
  const response = await tmdbApi.get('/search/person', {
    params: { query }
  });
  return response.data;
};
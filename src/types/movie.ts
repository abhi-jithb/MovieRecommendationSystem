export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
}

export interface TMDBMovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface FilterOptions {
  with_genres?: string;
  with_original_language?: string;
  primary_release_year?: string;
  with_cast?: string;
  with_crew?: string;
  'vote_average.gte'?: string;
  'vote_average.lte'?: string;
  sort_by?: string;
  page?: string;
}
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  director?: string;
  main_cast?: {
    id: number;
    name: string;
    character: string;
    profile_path?: string;
  }[];
  streaming_services?: {
    provider_id: number;
    provider_name: string;
    logo_path: string;
  }[];
}

export interface TMDBMovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface FilterOptions {
  language: string;
  year_range: {
    start: number;
    end: number;
  } | null;
  director: string;
  actor: string;
  genre: string;
  with_crew?: string;
  with_cast?: string;
  with_genres?: string;
  with_original_language?: string;
  sort_by?: string;
  'vote_average.gte'?: string;
}
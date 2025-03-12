export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface FilterOptions {
  genre?: string;
  language?: string;
  year?: string;
  cast?: string;
  director?: string;
  rating?: string;
}
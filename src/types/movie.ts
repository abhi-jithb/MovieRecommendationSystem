export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
<<<<<<< HEAD
=======
  backdrop_path?: string;
  original_language?: string;
  popularity?: number;
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
  director?: Crew;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
>>>>>>> 6e836e1 (admin dashboard ui added)
}

export interface FilterOptions {
  genre?: string;
  language?: string;
  year?: string;
<<<<<<< HEAD
  cast?: string;
  director?: string;
  rating?: string;
=======
  query?: string;
  actor?: string;
  director?: string;
>>>>>>> 6e836e1 (admin dashboard ui added)
}
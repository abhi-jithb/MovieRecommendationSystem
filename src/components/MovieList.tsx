import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Movie, FilterOptions } from '../types/movie';
import MovieCard from './MovieCard';
import LoadingCard from './LoadingCard';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface MovieListProps {
  filters: FilterOptions;
}

export default function MovieList({ filters }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver>();
  const lastMovieRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, isLoadingMore]);

  const fetchMovies = useCallback(async (pageNum: number) => {
    try {
      setIsLoadingMore(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page: pageNum.toString(),
        sort_by: 'popularity.desc',
        include_adult: 'false'
      });

      // Add year range filter if selected
      if (filters.year_range) {
        queryParams.append('primary_release_date.gte', `${filters.year_range.start}-01-01`);
        queryParams.append('primary_release_date.lte', `${filters.year_range.end}-12-31`);
      }

      // Add other filters
      if (filters.with_crew) {
        queryParams.append('with_crew', filters.with_crew);
      }
      if (filters.with_cast) {
        queryParams.append('with_cast', filters.with_cast);
      }
      if (filters.with_genres) {
        queryParams.append('with_genres', filters.with_genres);
      }
      if (filters.with_original_language) {
        queryParams.append('with_original_language', filters.with_original_language);
      }
      if (filters.sort_by) {
        queryParams.append('sort_by', filters.sort_by);
      }
      if (filters['vote_average.gte']) {
        queryParams.append('vote_average.gte', filters['vote_average.gte']);
      }

      const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      
      // Fetch additional details for each movie
      const moviesWithDetails = await Promise.all(
        data.results.map(async (movie: any) => {
          const details = await fetchMovieDetails(movie.id);
          return details ? { ...movie, ...details } : null;
        })
      );

      if (pageNum === 1) {
        setMovies(moviesWithDetails.filter(Boolean) as Movie[]);
      } else {
        setMovies(prev => [...prev, ...moviesWithDetails.filter(Boolean) as Movie[]]);
      }

      setHasMore(pageNum < data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching movies');
      setMovies([]);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [filters]);

  const fetchMovieDetails = async (movieId: number) => {
    try {
      // Fetch credits
      const creditsResponse = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const creditsData = await creditsResponse.json();

      // Get director and main cast
      const director = creditsData.crew.find((member: any) => member.job === 'Director')?.name || null;
      const mainCast = creditsData.cast.slice(0, 3).map((actor: any) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profile_path: actor.profile_path
      }));

      // Fetch streaming availability for India
      const streamingResponse = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
      );
      const streamingData = await streamingResponse.json();
      
      // Get streaming services available in India
      const streamingServices = streamingData.results.IN?.flatrate?.map((provider: any) => ({
        provider_id: provider.provider_id,
        provider_name: provider.provider_name,
        logo_path: provider.logo_path
      })) || [];

      return {
        director,
        main_cast: mainCast,
        streaming_services: streamingServices
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return {
        director: null,
        main_cast: [],
        streaming_services: []
      };
    }
  };

  useEffect(() => {
    setPage(1);
    setMovies([]);
    fetchMovies(1);
  }, [filters, fetchMovies]);

  useEffect(() => {
    if (page > 1) {
      fetchMovies(page);
    }
  }, [page, fetchMovies]);

  if (error) {
    return (
      <div className="text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          ref={index === movies.length - 1 ? lastMovieRef : undefined}
        >
          <MovieCard movie={movie} />
        </div>
      ))}
      {isLoadingMore && (
        <>
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </>
      )}
    </div>
  );
} 
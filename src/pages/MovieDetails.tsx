import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Calendar, Globe, User, Users, Film } from 'lucide-react';
import Button from '../components/ui/Button';
import { Movie } from '../types/movie';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMG_BASE_URL = 'https://image.tmdb.org/t/p';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch movie details
        const movieResponse = await fetch(
          `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        if (!movieResponse.ok) throw new Error('Failed to fetch movie details');
        const movieData = await movieResponse.json();

        // Fetch credits
        const creditsResponse = await fetch(
          `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`
        );
        if (!creditsResponse.ok) throw new Error('Failed to fetch credits');
        const creditsData = await creditsResponse.json();

        // Get director and main cast
        const director = creditsData.crew.find(
          (member: any) => member.job === 'Director'
        )?.name || 'Unknown';
        const mainCast = creditsData.cast
          .slice(0, 3)
          .map((actor: any) => actor.name)
          .join(', ');

        // Fetch streaming availability
        const streamingResponse = await fetch(
          `${TMDB_BASE_URL}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`
        );
        if (!streamingResponse.ok) throw new Error('Failed to fetch streaming data');
        const streamingData = await streamingResponse.json();

        const streamingServices = streamingData.results.US?.flatrate?.map(
          (provider: any) => ({
            provider_id: provider.provider_id,
            provider_name: provider.provider_name,
            logo_path: provider.logo_path,
          })
        ) || [];

        setMovie({
          ...movieData,
          director,
          main_cast: mainCast,
          streaming_services: streamingServices,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Movie not found'}</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Backdrop Image */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
        <img
          src={`${TMDB_IMG_BASE_URL}/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:text-purple-400">
              <ArrowLeft className="h-5 w-5" />
              Back to Movies
            </Link>
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {movie.runtime} minutes
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {new Date(movie.release_date).getFullYear()}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {movie.original_language.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Poster */}
          <div className="md:col-span-1">
            <img
              src={`${TMDB_IMG_BASE_URL}/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-600 mb-6">{movie.overview}</p>

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 mt-1 text-purple-600" />
                  <div>
                    <h3 className="font-semibold">Director</h3>
                    <p className="text-gray-600">{movie.director}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 mt-1 text-purple-600" />
                  <div>
                    <h3 className="font-semibold">Main Cast</h3>
                    <p className="text-gray-600">{movie.main_cast}</p>
                  </div>
                </div>

                {movie.streaming_services && movie.streaming_services.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Film className="h-5 w-5 mt-1 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Available On</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {movie.streaming_services.map((service) => (
                          <img
                            key={service.provider_id}
                            src={`${TMDB_IMG_BASE_URL}/w92${service.logo_path}`}
                            alt={service.provider_name}
                            className="h-8 w-8 rounded"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
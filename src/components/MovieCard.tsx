import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Play, Clock, Users, Film, Tv, Video } from 'lucide-react';
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-purple-600">
          {movie.title}
        </h3>
        <div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{movie.release_date.split('-')[0]}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>

        {/* Director and Cast */}
        {movie.director && (
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
            <Film className="h-4 w-4" />
            <span>{movie.director}</span>
          </div>
        )}
        {movie.main_cast && movie.main_cast.length > 0 && (
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{movie.main_cast.map(actor => actor.name).join(', ')}</span>
          </div>
        )}

        {/* Streaming Platforms */}
        {movie.streaming_services && movie.streaming_services.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {movie.streaming_services.map((service) => (
              <div
                key={service.provider_id}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
              >
                <img
                  src={`https://image.tmdb.org/t/p/original${service.logo_path}`}
                  alt={service.provider_name}
                  className="h-4 w-4 rounded-full"
                />
                <span>{service.provider_name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 transition-opacity duration-300">
            <div className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-white">
              <Play className="h-5 w-5" />
              <span>View Details</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
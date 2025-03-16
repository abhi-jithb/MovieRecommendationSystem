import { Movie } from '@/types/movie';
<<<<<<< HEAD
import { Star } from 'lucide-react';
=======
import { Star, User } from 'lucide-react';
import { format } from 'date-fns';
>>>>>>> 6e836e1 (admin dashboard ui added)

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
<<<<<<< HEAD
=======
  const releaseYear = movie.release_date ? format(new Date(movie.release_date), 'yyyy') : 'N/A';
  const director = movie.director?.name || 'Unknown Director';
  const cast = movie.credits?.cast.slice(0, 3) || [];

>>>>>>> 6e836e1 (admin dashboard ui added)
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:scale-[1.02]">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="aspect-[2/3] h-full w-full object-cover"
      />
<<<<<<< HEAD
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute bottom-0 p-4 text-white">
          <h3 className="text-lg font-bold sm:text-xl">{movie.title}</h3>
          <p className="mt-2 text-sm line-clamp-3 sm:text-base">{movie.overview}</p>
          <div className="mt-3 flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">{movie.vote_average.toFixed(1)}</span>
          </div>
=======
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute bottom-0 p-4 text-white">
          <h3 className="text-lg font-bold sm:text-xl">{movie.title} ({releaseYear})</h3>
          
          <div className="mt-2 flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>

          <div className="mt-2">
            <p className="text-sm font-semibold text-gray-300">Director:</p>
            <p className="text-sm">{director}</p>
          </div>

          {cast.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-semibold text-gray-300">Cast:</p>
              <div className="flex flex-wrap gap-1">
                {cast.map((actor, index) => (
                  <span key={actor.id} className="text-sm">
                    {actor.name}{index < cast.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="mt-2 text-sm line-clamp-2">{movie.overview}</p>
>>>>>>> 6e836e1 (admin dashboard ui added)
        </div>
      </div>
    </div>
  );
}
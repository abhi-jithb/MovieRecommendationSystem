import React, { useState, useEffect } from 'react';
import { Film, User, Menu } from 'lucide-react';
import MovieCard from './components/MovieCard';
import LoadingCard from './components/LoadingCard';
import FilterBar from './components/FilterBar';
import Button from './components/ui/Button';
import AuthModal from './components/AuthModal';
import LoadingScreen from './components/LoadingScreen';
import { FilterOptions, Movie } from './types/movie';

// Mock data for UI demonstration
const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    release_date: "2010-07-16",
    vote_average: 8.8,
    genre_ids: [28, 878, 12]
  },
  {
    id: 2,
    title: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    release_date: "2008-07-18",
    vote_average: 9.0,
    genre_ids: [28, 80, 18]
  },
];

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate API loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setMovies(mockMovies);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [filters]);

  if (isInitialLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Film className="h-6 w-6 text-purple-600 sm:h-8 sm:w-8" />
            <h1 className="text-xl font-bold sm:text-2xl">MovieMaster</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden items-center gap-2 sm:flex"
            >
              <User className="h-5 w-5" />
              Sign In
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 hover:bg-gray-100 sm:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t bg-white p-4 sm:hidden">
            <Button
              variant="outline"
              onClick={() => {
                setIsAuthModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2"
            >
              <User className="h-5 w-5" />
              Sign In
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Hero Section */}
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Discover Your Next Favorite Movie
            </h2>
            <p className="text-lg text-gray-600 sm:text-xl">
              Filter through thousands of movies to find the perfect watch for tonight
            </p>
          </div>

          {/* Filters */}
          <FilterBar filters={filters} onFilterChange={setFilters} />

          {/* Movie Grid */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <LoadingCard key={index} />
                ))
              : movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default App;
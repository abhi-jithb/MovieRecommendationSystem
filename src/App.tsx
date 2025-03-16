import React, { useState, useEffect } from 'react';
import { Film, User, Menu, LogOut } from 'lucide-react';
import MovieCard from './components/MovieCard';
import LoadingCard from './components/LoadingCard';
import FilterBar from './components/FilterBar';
import Button from './components/ui/Button';
import AuthModal from './components/AuthModal';
import LoadingScreen from './components/LoadingScreen';
import AdminDashboard from './components/AdminDashboard';
import { FilterOptions, Movie } from './types/movie';
import { useAuth } from './contexts/AuthContext';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function App() {
  const { user, isLoading: isAuthLoading, isAdmin, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const queryParams = new URLSearchParams({
          api_key: TMDB_API_KEY,
          language: 'en-US',
          page: '1',
          ...filters
        });

        const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        setMovies(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching movies');
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [filters, user]);

  if (isInitialLoading || isAuthLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Movres</h1>
          <p className="text-gray-600 mb-8">Please sign in to continue</p>
          <Button onClick={() => setIsAuthModalOpen(true)}>
            Sign In
          </Button>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  if (isAdmin) {
    return <AdminDashboard onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Film className="h-6 w-6 text-purple-600 sm:h-8 sm:w-8" />
            <h1 className="text-xl font-bold sm:text-2xl">Movres</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-gray-600">
              Welcome, {user.displayName || user.email}
            </span>
            <Button
              variant="outline"
              onClick={logout}
              className="hidden items-center gap-2 sm:flex"
            >
              <LogOut className="h-5 w-5" />
              Logout
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
            <div className="mb-4 text-gray-600">
              Welcome, {user.displayName || user.email}
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="flex w-full items-center justify-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Logout
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
          <div className="mt-8">
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {isLoading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <LoadingCard key={index} />
                  ))
                : movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

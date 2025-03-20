import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Menu, X, User, Film } from 'lucide-react';
import Button from '../components/ui/Button';
import FilterBar from '../components/FilterBar';
import MovieList from '../components/MovieList';
import { FilterOptions, Movie } from '../types/movie';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    language: '',
    year_range: null,
    director: '',
    actor: '',
    genre: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Film className="h-6 w-6 text-purple-600 sm:h-8 sm:w-8" />
            <h1 className="text-xl font-bold sm:text-2xl">Movres</h1>
          </div>
          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200"
              >
                Admin Dashboard
              </Link>
            )}
            <Link
              to="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
            >
              {user?.displayName?.[0] || user?.email?.[0].toUpperCase()}
            </Link>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t bg-white p-4 sm:hidden">
            <Link
              to="/profile"
              className="mb-4 flex items-center gap-2 text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        <MovieList filters={filters} />
      </main>
    </div>
  );
} 
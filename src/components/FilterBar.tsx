import { FilterOptions } from '@/types/movie';
import Button from './ui/Button';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

interface Genre {
  id: number;
  name: string;
}

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
        );
        if (!response.ok) throw new Error('Failed to fetch genres');
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters };
    
    // Remove empty values
    if (!value) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    onFilterChange(newFilters);
  };

  return (
    <div className="sticky top-[65px] z-10 bg-white p-4 shadow-md sm:top-[73px]">
      <div className="mx-auto max-w-7xl">
        {/* Mobile Filter Toggle */}
        <div className="mb-4 sm:hidden">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        <div className={`${isExpanded ? 'block' : 'hidden'} space-y-3 sm:block sm:space-y-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 sm:gap-4`}>
          <select
            className="w-full rounded-lg border p-2"
            value={filters.with_genres || ''}
            onChange={(e) => handleFilterChange('with_genres', e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-lg border p-2"
            value={filters.with_original_language || ''}
            onChange={(e) => handleFilterChange('with_original_language', e.target.value)}
          >
            <option value="">All Languages</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="zh">Chinese</option>
            <option value="hi">Hindi</option>
          </select>

          <select
            className="w-full rounded-lg border p-2"
            value={filters.primary_release_year || ''}
            onChange={(e) => handleFilterChange('primary_release_year', e.target.value)}
          >
            <option value="">All Years</option>
            {Array.from({ length: 24 }, (_, i) => 2024 - i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-lg border p-2"
            value={filters.sort_by || ''}
            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="popularity.desc">Most Popular</option>
            <option value="popularity.asc">Least Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="vote_average.asc">Lowest Rated</option>
            <option value="release_date.desc">Newest First</option>
            <option value="release_date.asc">Oldest First</option>
            <option value="title.asc">Title (A-Z)</option>
            <option value="title.desc">Title (Z-A)</option>
          </select>

          <select
            className="w-full rounded-lg border p-2"
            value={filters['vote_average.gte'] || ''}
            onChange={(e) => handleFilterChange('vote_average.gte', e.target.value)}
          >
            <option value="">Minimum Rating</option>
            <option value="0">Any Rating</option>
            <option value="5">5+ Stars</option>
            <option value="6">6+ Stars</option>
            <option value="7">7+ Stars</option>
            <option value="8">8+ Stars</option>
            <option value="9">9+ Stars</option>
          </select>

          <Button 
            className="flex w-full items-center justify-center gap-2"
            onClick={() => onFilterChange({})}
          >
            <Search className="h-5 w-5" />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
import { FilterOptions } from '@/types/movie';
import Button from './ui/Button';
import { Search, ChevronDown, X } from 'lucide-react';
import { useState, useEffect, ChangeEvent, useRef } from 'react';
import Input from './ui/Input';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

interface Genre {
  id: number;
  name: string;
}

interface Director {
  id: number;
  name: string;
  profile_path: string | null;
}

interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
}

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [director, setDirector] = useState('');
  const [directorSuggestions, setDirectorSuggestions] = useState<Director[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [actor, setActor] = useState('');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const directorInputRef = useRef<HTMLDivElement>(null);
  const actorInputRef = useRef<HTMLDivElement>(null);
  const [actorSuggestions, setActorSuggestions] = useState<Actor[]>([]);
  const [showActorSuggestions, setShowActorSuggestions] = useState(false);
  const currentYear = new Date().getFullYear();
  const yearRanges = [
    { label: '2020-2025', start: 2020, end: 2025 },
    { label: '2015-2019', start: 2015, end: 2019 },
    { label: '2010-2014', start: 2010, end: 2014 },
    { label: '2005-2009', start: 2005, end: 2009 },
    { label: '2000-2004', start: 2000, end: 2004 },
    { label: '1995-1999', start: 1995, end: 1999 },
    { label: '1990-1994', start: 1990, end: 1994 },
    { label: '1985-1989', start: 1985, end: 1989 },
    { label: '1980-1984', start: 1980, end: 1984 },
    { label: '1975-1979', start: 1975, end: 1979 },
    { label: '1970-1974', start: 1970, end: 1974 },
    { label: '1965-1969', start: 1965, end: 1969 },
    { label: '1960-1964', start: 1960, end: 1964 },
    { label: '1955-1959', start: 1955, end: 1959 },
    { label: '1950-1954', start: 1950, end: 1954 }
  ];

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (directorInputRef.current && !directorInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (actorInputRef.current && !actorInputRef.current.contains(event.target as Node)) {
        setShowActorSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchDirectorSuggestions = async () => {
      if (director.length < 2) {
        setDirectorSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${director}&language=en-US`
        );
        if (!response.ok) throw new Error('Failed to fetch director suggestions');
        const data = await response.json();
        setDirectorSuggestions(data.results.filter((person: any) => person.known_for_department === 'Directing'));
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching director suggestions:', error);
      }
    };

    const debounceTimer = setTimeout(fetchDirectorSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [director]);

  useEffect(() => {
    if (filters.year_range) {
      setSelectedYears([filters.year_range.start, filters.year_range.end]);
    }
  }, [filters.year_range]);

  useEffect(() => {
    const fetchActorSuggestions = async () => {
      if (actor.length < 2) {
        setActorSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${actor}&language=en-US`
        );
        if (!response.ok) throw new Error('Failed to fetch actor suggestions');
        const data = await response.json();
        setActorSuggestions(data.results.filter((person: any) => person.known_for_department === 'Acting'));
        setShowActorSuggestions(true);
      } catch (error) {
        console.error('Error fetching actor suggestions:', error);
      }
    };

    const debounceTimer = setTimeout(fetchActorSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [actor]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters };
    
    if (!value) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    onFilterChange(newFilters);
  };

  const handleYearRangeSelect = (start: number, end: number) => {
    setSelectedYears([start, end]);
    onFilterChange({
      ...filters,
      year_range: { start, end }
    });
    setIsYearDropdownOpen(false);
  };

  const handleYearRangeClear = () => {
    setSelectedYears([]);
    const newFilters = { ...filters };
    delete newFilters.year_range;
    onFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    setDirector('');
    setActor('');
    setSelectedYears([]);
    onFilterChange({
      language: '',
      year_range: null,
      director: '',
      actor: '',
      genre: ''
    });
  };

  const handleDirectorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDirector(value);
    if (!value) {
      handleFilterChange('with_crew', '');
    }
  };

  const handleDirectorSelect = (selectedDirector: Director) => {
    setDirector(selectedDirector.name);
    setShowSuggestions(false);
    handleFilterChange('with_crew', selectedDirector.id.toString());
  };

  const handleActorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setActor(value);
    if (!value) {
      handleFilterChange('with_cast', '');
    }
  };

  const handleActorSelect = (selectedActor: Actor) => {
    setActor(selectedActor.name);
    setShowActorSuggestions(false);
    handleFilterChange('with_cast', selectedActor.id.toString());
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

        <div className={`${isExpanded ? 'block' : 'hidden'} space-y-3 sm:block sm:space-y-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 sm:gap-4`}>
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
            <option value="hi">Hindi</option>
            <option value="ml">Malayalam</option>
            <option value="ta">Tamil</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="zh">Chinese</option>
           
          </select>

          <div className="relative">
            <select
              value={filters.year_range ? `${filters.year_range.start}-${filters.year_range.end}` : ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  const [start, end] = value.split('-').map(Number);
                  onFilterChange({
                    ...filters,
                    year_range: { start, end }
                  });
                } else {
                  onFilterChange({
                    ...filters,
                    year_range: null
                  });
                }
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">All Years</option>
              {yearRanges.map((range) => (
                <option key={range.label} value={`${range.start}-${range.end}`}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative" ref={directorInputRef}>
            <Input
              type="text"
              placeholder="Director Name"
              value={director}
              onChange={handleDirectorChange}
              className="w-full"
            />
            {showSuggestions && directorSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {directorSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    className="flex w-full items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => handleDirectorSelect(suggestion)}
                  >
                    {suggestion.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${suggestion.profile_path}`}
                        alt={suggestion.name}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                    )}
                    <span className="text-sm text-gray-700">{suggestion.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={actorInputRef}>
            <Input
              type="text"
              placeholder="Actor Name"
              value={actor}
              onChange={handleActorChange}
              className="w-full"
            />
            {showActorSuggestions && actorSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {actorSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    className="flex w-full items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => handleActorSelect(suggestion)}
                  >
                    {suggestion.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${suggestion.profile_path}`}
                        alt={suggestion.name}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                    )}
                    <span className="text-sm text-gray-700">{suggestion.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
            onClick={handleResetFilters}
          >
            <Search className="h-5 w-5" />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
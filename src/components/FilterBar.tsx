import { FilterOptions } from '@/types/movie';
import Button from './ui/Button';
<<<<<<< HEAD
import { Search } from 'lucide-react';
import { useState } from 'react';
=======
import { Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { searchPerson } from '@/lib/tmdb';
import { format } from 'date-fns';
>>>>>>> 6e836e1 (admin dashboard ui added)

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
<<<<<<< HEAD
=======
  const [searchQuery, setSearchQuery] = useState('');
  const [actorQuery, setActorQuery] = useState('');
  const [directorQuery, setDirectorQuery] = useState('');
  const [actorResults, setActorResults] = useState<Array<{ id: number; name: string }>>([]);
  const [directorResults, setDirectorResults] = useState<Array<{ id: number; name: string }>>([]);
  const [showActorDropdown, setShowActorDropdown] = useState(false);
  const [showDirectorDropdown, setShowDirectorDropdown] = useState(false);

  // Generate years from 1900 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  useEffect(() => {
    const searchActors = async () => {
      if (actorQuery.length > 2) {
        const result = await searchPerson(actorQuery);
        setActorResults(result.results.slice(0, 5));
        setShowActorDropdown(true);
      } else {
        setActorResults([]);
        setShowActorDropdown(false);
      }
    };

    const timeoutId = setTimeout(searchActors, 300);
    return () => clearTimeout(timeoutId);
  }, [actorQuery]);

  useEffect(() => {
    const searchDirectors = async () => {
      if (directorQuery.length > 2) {
        const result = await searchPerson(directorQuery);
        setDirectorResults(result.results.slice(0, 5));
        setShowDirectorDropdown(true);
      } else {
        setDirectorResults([]);
        setShowDirectorDropdown(false);
      }
    };

    const timeoutId = setTimeout(searchDirectors, 300);
    return () => clearTimeout(timeoutId);
  }, [directorQuery]);

  const handleSearch = () => {
    onFilterChange({ ...filters, query: searchQuery });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
>>>>>>> 6e836e1 (admin dashboard ui added)

  return (
    <div className="sticky top-[65px] z-10 bg-white p-4 shadow-md sm:top-[73px]">
      <div className="mx-auto max-w-7xl">
        {/* Mobile Filter Toggle */}
        <div className="mb-4 sm:hidden">
          <Button
            variant="outline"
<<<<<<< HEAD
            className="w-full"
            onClick={() => setIsExpanded(!isExpanded)}
          >
=======
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="h-4 w-4" />
>>>>>>> 6e836e1 (admin dashboard ui added)
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

<<<<<<< HEAD
        <div className={`${isExpanded ? 'block' : 'hidden'} space-y-3 sm:block sm:space-y-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 sm:gap-4`}>
          <select
            className="w-full rounded-lg border p-2"
            value={filters.genre}
            onChange={(e) => onFilterChange({ ...filters, genre: e.target.value })}
          >
            <option value="">Select Genre</option>
            <option value="action">Action</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="horror">Horror</option>
          </select>

          <select
            className="w-full rounded-lg border p-2"
            value={filters.language}
            onChange={(e) => onFilterChange({ ...filters, language: e.target.value })}
          >
            <option value="">Select Language</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>

          <select
            className="w-full rounded-lg border p-2"
            value={filters.year}
            onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
          >
            <option value="">Select Year</option>
            {Array.from({ length: 24 }, (_, i) => 2024 - i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by Cast"
            className="w-full rounded-lg border p-2"
            value={filters.cast}
            onChange={(e) => onFilterChange({ ...filters, cast: e.target.value })}
          />

          <input
            type="text"
            placeholder="Search by Director"
            className="w-full rounded-lg border p-2"
            value={filters.director}
            onChange={(e) => onFilterChange({ ...filters, director: e.target.value })}
          />

          <Button className="flex w-full items-center justify-center gap-2">
            <Search className="h-5 w-5" />
            Search
          </Button>
=======
        <div className={`${isExpanded ? 'block' : 'hidden'} space-y-3 sm:block sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4`}>
          <div className="space-y-3 sm:space-y-4">
            <select
              className="w-full rounded-lg border p-2"
              value={filters.genre}
              onChange={(e) => onFilterChange({ ...filters, genre: e.target.value })}
            >
              <option value="">All Genres</option>
              <option value="28">Action</option>
              <option value="35">Comedy</option>
              <option value="18">Drama</option>
              <option value="27">Horror</option>
              <option value="10749">Romance</option>
              <option value="878">Science Fiction</option>
            </select>

            <select
              className="w-full rounded-lg border p-2"
              value={filters.year}
              onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Actor..."
                value={actorQuery}
                onChange={(e) => setActorQuery(e.target.value)}
                className="w-full rounded-lg border p-2"
              />
              {showActorDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
                  {actorResults.map(actor => (
                    <button
                      key={actor.id}
                      className="w-full p-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        onFilterChange({ ...filters, actor: actor.name });
                        setActorQuery(actor.name);
                        setShowActorDropdown(false);
                      }}
                    >
                      {actor.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search Director..."
                value={directorQuery}
                onChange={(e) => setDirectorQuery(e.target.value)}
                className="w-full rounded-lg border p-2"
              />
              {showDirectorDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
                  {directorResults.map(director => (
                    <button
                      key={director.id}
                      className="w-full p-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        onFilterChange({ ...filters, director: director.name });
                        setDirectorQuery(director.name);
                        setShowDirectorDropdown(false);
                      }}
                    >
                      {director.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <select
              className="w-full rounded-lg border p-2"
              value={filters.language}
              onChange={(e) => onFilterChange({ ...filters, language: e.target.value })}
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full rounded-lg border p-2 pr-12"
              />
              <Button
                onClick={handleSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
>>>>>>> 6e836e1 (admin dashboard ui added)
        </div>
      </div>
    </div>
  );
}
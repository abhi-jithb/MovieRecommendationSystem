import { FilterOptions } from '@/types/movie';
import Button from './ui/Button';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
        </div>
      </div>
    </div>
  );
}
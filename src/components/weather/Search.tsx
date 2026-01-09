'use client';

import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface SearchComponentProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  isCelsius: boolean;
}

export const SearchComponent = ({ onSearch, isLoading, isCelsius }: SearchComponentProps) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setSearchInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-8">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            disabled={isLoading}
          />
          <SearchIcon className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>
        <button
          type="submit"
          disabled={isLoading || !searchInput.trim()}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

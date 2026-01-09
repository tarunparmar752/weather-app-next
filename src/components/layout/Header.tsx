'use client';

// src/components/layout/Header.tsx
import { Sun, Moon, CloudSun } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  isCelsius: boolean;
  onThemeToggle: () => void;
  onUnitToggle: () => void;
}

export const Header = ({
  theme,
  isCelsius,
  onThemeToggle,
  onUnitToggle
}: HeaderProps) => {
  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
              <CloudSun className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Weather Forecast
              </h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                Real-time weather updates
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            
            {/* Temperature Unit Toggle */}
            <button
              onClick={onUnitToggle}
              className="
                px-4 py-2 rounded-lg font-semibold
                bg-gray-100 dark:bg-gray-700
                hover:bg-gray-200 dark:hover:bg-gray-600
                text-gray-900 dark:text-white
                transition-all duration-200
                flex items-center gap-2
              "
              aria-label="Toggle temperature unit"
            >
              <span className="text-lg">°{isCelsius ? 'C' : 'F'}</span>
            </button>

            {/* Dark Mode Toggle */}
            {/* <button
              onClick={onThemeToggle}
              className="
                p-2 rounded-lg
                bg-gray-100 dark:bg-gray-700
                hover:bg-gray-200 dark:hover:bg-gray-600
                transition-all duration-200
              "
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-gray-700" />
              )}
            </button> */}
          </div>
        </div>
      </div>
    </header>
  );
};
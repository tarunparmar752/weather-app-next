"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { SearchComponent } from "@/components/weather/Search";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { ForecastComponent } from "@/components/weather/Forecast";
import { CitiesTable } from "@/components/weather/CitiesTable";
import { SkeletonWeatherCard, SkeletonForecast } from "@/components/SkeletonLoading";
import { WeatherData, Forecast, ApiError } from "@/types/weather";
import { fetchWeatherByCity, fetchWeatherByCoords, fetchForecast } from "@/utils/weatherApi";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isCelsius, setIsCelsius] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [currentForecast, setCurrentForecast] = useState<Forecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const { location, loading: geoLoading } = useGeolocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch weather for current location on mount
  useEffect(() => {
    if (mounted && location && !geoLoading && !currentWeather) {
      handleGeolocationWeather();
    }
  }, [mounted, location, geoLoading]);

  const handleGeolocationWeather = async () => {
    if (!location) return;

    setIsLoading(true);
    setError(null);

    try {
      const weather = await fetchWeatherByCoords(location.lat, location.lon);
      setCurrentWeather(weather);

      const forecast = await fetchForecast(weather.city);
      setCurrentForecast(forecast);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("Error fetching weather:", apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const weather = await fetchWeatherByCity(city);
      setCurrentWeather(weather);

      const forecast = await fetchForecast(city);
      setCurrentForecast(forecast);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("Error fetching weather:", apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header
        theme={theme}
        isCelsius={isCelsius}
        onThemeToggle={toggleTheme}
        onUnitToggle={() => setIsCelsius(!isCelsius)}
      />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search Section */}
        <section className="mb-12">
          <SearchComponent
            onSearch={handleSearch}
            isLoading={isLoading}
            isCelsius={isCelsius}
          />
        </section>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 rounded-lg">
            <p className="font-semibold">Error: {error.message}</p>
            <p className="text-sm mt-1">Please try another city or check your internet connection.</p>
          </div>
        )}

        {/* Current Weather Card */}
        {isLoading ? (
          <section className="mb-12">
            <SkeletonWeatherCard />
          </section>
        ) : currentWeather ? (
          <section className="mb-12">
            <WeatherCard weather={currentWeather} isCelsius={isCelsius} />
          </section>
        ) : (
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {geoLoading
                  ? "Detecting your location..."
                  : "Search for a city to see weather information"}
              </p>
            </div>
          </section>
        )}

        {/* 5-Day Forecast */}
        {isLoading ? (
          <section className="mb-12">
            <SkeletonForecast />
          </section>
        ) : currentForecast ? (
          <section className="mb-12">
            <ForecastComponent forecast={currentForecast} isCelsius={isCelsius} />
          </section>
        ) : null}

        {/* Cities Weather Table */}
        <section>
          <CitiesTable isCelsius={isCelsius} />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>Weather Forecast Application built with Next.js, React & Tailwind CSS</p>
          <p className="text-sm mt-2">Data provided by OpenWeatherMap API</p>
        </div>
      </footer>
    </div>
  );
}

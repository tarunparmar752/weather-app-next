"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WeatherData } from "@/types/weather";
import { fetchWeatherByCity } from "@/utils/weatherApi";
import {
  useTemperatureConversion,
  useWindSpeedConversion,
  useWindSpeedUnit,
} from "@/hooks/useTemperatureConversion";
import { SkeletonTableRow } from "./SkeletonLoading";

interface CitiesTableProps {
  isCelsius: boolean;
}

const CITIES = [
  "London",
  "Paris",
  "New York",
  "Tokyo",
  "Sydney",
  "Dubai",
  "Singapore",
  "Hong Kong",
  "Bangkok",
  "Mumbai",
  "Istanbul",
  "Moscow",
  "Berlin",
  "Amsterdam",
  "Barcelona",
  "Rome",
  "Madrid",
  "Toronto",
  "Mexico City",
  "São Paulo",
  "Buenos Aires",
  "Cape Town",
  "Bangkok",
  "Seoul",
  "Beijing",
];

export const CitiesTable = ({ isCelsius }: CitiesTableProps) => {
  const [allCitiesWeather, setAllCitiesWeather] = useState<WeatherData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAllCitiesWeather = async () => {
      setIsLoading(true);
      try {
        const weatherData: WeatherData[] = [];
        for (const city of CITIES) {
          try {
            const data = await fetchWeatherByCity(city);
            weatherData.push(data);
          } catch (error) {
            console.error(`Error fetching weather for ${city}:`, error);
          }
        }
        setAllCitiesWeather(weatherData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCitiesWeather();
  }, []);

  const totalPages = Math.ceil(allCitiesWeather.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCities = allCitiesWeather.slice(startIndex, endIndex);

  const tempUnit = isCelsius ? "°C" : "°F";
  const windUnit = useWindSpeedUnit(isCelsius);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Weather in {allCitiesWeather.length} Cities
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                City
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Temperature
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Condition
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Humidity
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Wind Speed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <>
                {[...Array(itemsPerPage)].map((_, i) => (
                  <SkeletonTableRow key={i} />
                ))}
              </>
            ) : (
              currentCities.map((city) => {
                const temp = useTemperatureConversion(
                  city.temperature,
                  isCelsius
                );
                const windSpeed = useWindSpeedConversion(
                  city.windSpeed,
                  isCelsius
                );

                return (
                  <tr
                    key={`${city.city}-${city.country}`}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {city.city}, {city.country}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-semibold">
                      {temp}
                      {tempUnit}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 capitalize">
                      {city.condition}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {city.humidity}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {windSpeed} {windUnit}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, allCitiesWeather.length)} of{" "}
          {allCitiesWeather.length} cities
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <span className="px-4 py-2 text-gray-900 dark:text-white font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

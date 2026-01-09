'use client';

import { WeatherData } from '@/types/weather';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge } from 'lucide-react';
import {
  useTemperatureConversion,
  useWindSpeedConversion,
  useWindSpeedUnit,
} from '@/hooks/useTemperatureConversion';

interface WeatherCardProps {
  weather: WeatherData;
  isCelsius: boolean;
}

const getWeatherIcon = (condition: string, size: number = 64) => {
  const iconProps = { size, className: 'text-yellow-400' };

  switch (condition.toLowerCase()) {
    case 'clear':
      return <Sun {...iconProps} />;
    case 'clouds':
      return <Cloud {...iconProps} className="text-gray-400" />;
    case 'rain':
    case 'drizzle':
      return <CloudRain {...iconProps} className="text-blue-400" />;
    default:
      return <Cloud {...iconProps} className="text-gray-400" />;
  }
};

export const WeatherCard = ({ weather, isCelsius }: WeatherCardProps) => {
  const temp = useTemperatureConversion(weather.temperature, isCelsius);
  const feelsLike = useTemperatureConversion(weather.feelsLike, isCelsius);
  const windSpeed = useWindSpeedConversion(weather.windSpeed, isCelsius);
  const windUnit = useWindSpeedUnit(isCelsius);
  const tempUnit = isCelsius ? '°C' : '°F';

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-8 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {weather.city}, {weather.country}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg capitalize">
            {weather.description}
          </p>
        </div>
        <div className="flex flex-col items-center">
          {getWeatherIcon(weather.condition, 80)}
        </div>
      </div>

      {/* Main Temperature */}
      <div className="mb-8">
        <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
          {temp}{tempUnit}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Feels like {feelsLike}{tempUnit}
        </p>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Humidity</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {weather.humidity}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {windSpeed} {windUnit}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Pressure</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {weather.pressure} mb
          </p>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Visibility</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {weather.visibility.toFixed(1)} km
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Cloud coverage: {weather.cloudiness}%
        </p>
      </div>
    </div>
  );
};

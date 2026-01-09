'use client';

import { Forecast } from '@/types/weather';
import { Cloud, CloudRain, Sun } from 'lucide-react';
import { useTemperatureConversion, useWindSpeedConversion, useWindSpeedUnit } from '@/hooks/useTemperatureConversion';

interface ForecastComponentProps {
  forecast: Forecast;
  isCelsius: boolean;
}

const getWeatherIcon = (condition: string, size: number = 32) => {
  const iconProps = { size, className: 'text-yellow-400 dark:text-yellow-300' };

  switch (condition.toLowerCase()) {
    case 'clear':
      return <Sun {...iconProps} />;
    case 'clouds':
      return <Cloud {...iconProps} className="text-gray-400 dark:text-gray-500" />;
    case 'rain':
    case 'drizzle':
      return <CloudRain {...iconProps} className="text-blue-400 dark:text-blue-300" />;
    default:
      return <Cloud {...iconProps} className="text-gray-400 dark:text-gray-500" />;
  }
};

export const ForecastComponent = ({ forecast, isCelsius }: ForecastComponentProps) => {
  const tempUnit = isCelsius ? '°C' : '°F';
  const windUnit = useWindSpeedUnit(isCelsius);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-300">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        5-Day Forecast for {forecast.city}, {forecast.country}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {forecast.days.map((day, index) => {
          const maxTemp = useTemperatureConversion(day.tempMax, isCelsius);
          const minTemp = useTemperatureConversion(day.tempMin, isCelsius);
          const windSpeed = useWindSpeedConversion(day.windSpeed, isCelsius);

          return (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
            >
              <p className="font-semibold text-gray-900 dark:text-white mb-3">
                {new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>

              <div className="flex justify-center mb-3">
                {getWeatherIcon(day.condition)}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-3 capitalize">
                {day.condition}
              </p>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Max:</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-2">
                    {maxTemp}{tempUnit}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Min:</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-2">
                    {minTemp}{tempUnit}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Wind:</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-2">
                    {windSpeed} {windUnit}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Humidity:</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-2">
                    {day.humidity}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

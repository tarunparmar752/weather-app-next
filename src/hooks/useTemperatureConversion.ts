'use client';

export const useTemperatureConversion = (celsius: number, isCelsius: boolean): number => {
  if (isCelsius) {
    return celsius;
  }
  return Math.round((celsius * 9/5) + 32);
};

export const useTemperatureDisplay = (celsius: number, isCelsius: boolean): string => {
  const temp = useTemperatureConversion(celsius, isCelsius);
  return `${temp}°${isCelsius ? 'C' : 'F'}`;
};

export const useWindSpeedConversion = (meterPerSecond: number, isCelsius: boolean): number => {
  // If Celsius (metric), return km/h. If Fahrenheit (imperial), return mph
  if (isCelsius) {
    return Math.round(meterPerSecond * 3.6 * 10) / 10;
  }
  return Math.round(meterPerSecond * 2.237 * 10) / 10;
};

export const useWindSpeedUnit = (isCelsius: boolean): string => {
  return isCelsius ? 'km/h' : 'mph';
};

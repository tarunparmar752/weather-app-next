'use client';

import { useEffect, useState } from 'react';
import { LocationData } from '@/types/weather';

interface GeolocationError {
  message: string;
  code: number;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError({
        message: 'Geolocation is not supported by your browser',
        code: 0,
      });
      setLoading(false);
      return;
    }

    const handleSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      
      try {
        // Use reverse geocoding to get city name
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        
        setLocation({
          lat: latitude,
          lon: longitude,
          city: data.address?.city || data.address?.town || 'Unknown',
          country: data.address?.country || 'Unknown',
        });
      } catch (err) {
        // If reverse geocoding fails, just set coordinates
        setLocation({
          lat: latitude,
          lon: longitude,
          city: 'Unknown',
          country: 'Unknown',
        });
      }
      setError(null);
      setLoading(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      setError({
        message: err.message,
        code: err.code,
      });
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      timeout: 10000,
      enableHighAccuracy: false,
    });
  }, []);

  return { location, error, loading };
};

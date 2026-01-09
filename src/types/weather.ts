export interface OpenWeatherMapResponse {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  dt: number;
  timezone: number;
  coord: {
    lat: number;
    lon: number;
  };
}

// Processed Weather Data Types
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  cloudiness: number;
  sunrise: number;
  sunset: number;
  lat: number;
  lon: number;
  icon: string;
}

export interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  timestamp: number;
}

export interface Forecast {
  city: string;
  country: string;
  days: ForecastDay[];
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_max: number;
      temp_min: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
  };
}

export interface CityWeather {
  id: string;
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export interface LocationData {
  lat: number;
  lon: number;
  city: string;
  country: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

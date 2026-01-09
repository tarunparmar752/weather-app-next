import axios from "axios";
import {
  WeatherData,
  ForecastData,
  Forecast,
  OpenWeatherMapResponse,
  ApiError,
} from "@/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

if (!API_KEY) {
  console.warn(
    "Warning: NEXT_PUBLIC_WEATHER_API_KEY is not set in environment variables"
  );
}

// Helper function to convert API response to WeatherData
const convertOpenWeatherMapToWeatherData = (
  data: OpenWeatherMapResponse
): WeatherData => {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 10) / 10,
    pressure: data.main.pressure,
    visibility: data.visibility / 1000,
    cloudiness: data.clouds.all,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    lat: data.coord.lat,
    lon: data.coord.lon,
    icon: data.weather[0].icon,
  };
};

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const response = await axios.get<OpenWeatherMapResponse>(
      `${BASE_URL}/weather`,
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      }
    );
    return convertOpenWeatherMapToWeatherData(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || "Failed to fetch weather",
        code: error.response?.status.toString(),
      } as ApiError;
    }
    throw { message: "Unknown error occurred" } as ApiError;
  }
};

export const fetchWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const response = await axios.get<OpenWeatherMapResponse>(
      `${BASE_URL}/weather`,
      {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: "metric",
        },
      }
    );
    return convertOpenWeatherMapToWeatherData(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || "Failed to fetch weather",
        code: error.response?.status.toString(),
      } as ApiError;
    }
    throw { message: "Unknown error occurred" } as ApiError;
  }
};

export const fetchForecast = async (city: string): Promise<Forecast> => {
  try {
    const response = await axios.get<ForecastData>(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    // Group forecast by day and get first forecast of each day
    const forecastByDay: { [key: string]: (typeof response.data.list)[0] } =
      {};

    response.data.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!forecastByDay[date]) {
        forecastByDay[date] = item;
      }
    });

    const days = Object.values(forecastByDay)
      .slice(0, 5)
      .map((item) => ({
        date: item.dt_txt.split(" ")[0],
        tempMax: Math.round(item.main.temp_max),
        tempMin: Math.round(item.main.temp_min),
        condition: item.weather[0].main,
        description: item.weather[0].description,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 10) / 10,
        icon: item.weather[0].icon,
        timestamp: item.dt,
      }));

    return {
      city: response.data.city.name,
      country: response.data.city.country,
      days,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || "Failed to fetch forecast",
        code: error.response?.status.toString(),
      } as ApiError;
    }
    throw { message: "Unknown error occurred" } as ApiError;
  }
};

// Get weather for multiple cities (for city table)
export const fetchMultipleCitiesWeather = async (
  cities: string[]
): Promise<WeatherData[]> => {
  try {
    const promises = cities.map((city) => fetchWeatherByCity(city));
    return await Promise.all(promises);
  } catch (error) {
    console.error("Error fetching multiple cities weather:", error);
    return [];
  }
};

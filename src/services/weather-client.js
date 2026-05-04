import { OpenWeatherService } from "./open-weather-service";

export const weatherClient = new OpenWeatherService({
    apiKey: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
    units: "metric",
});

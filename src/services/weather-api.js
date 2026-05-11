import { weatherClient } from "./weather-client";

export const getCurrentWeatherByCity = (city) => {
    return weatherClient.getCurrentWeatherByCity(city);
};

export const getCurrentWeatherByCoordinates = (latitude, longitude) => {
    return weatherClient.getCurrentWeatherByCoordinates(latitude, longitude);
};

export const getWeatherForecast = (city) => {
    return weatherClient.getForecastWeatherByCity(city);
};

export const getWeatherForecastByCoordinates = (latitude, longitude) => {
    return weatherClient.getForecastWeatherByCoordinates(latitude, longitude);
};

export const searchCities = (query) => {
    return weatherClient.searchCities(query);
};

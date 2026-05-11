import { useEffect, useState } from "react";
import { getCurrentWeatherByCity, getCurrentWeatherByCoordinates, getWeatherForecast } from "../services/weather-api";


export const useWeather = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unit, setUnit] = useState("C");


    const fetchWeatherByCity = async (city) => {
        setLoading(true);
        setError(null);
        try {
            const [weatherData, forecast] = await Promise.all([
                getCurrentWeatherByCity(city),
                getWeatherForecast(city),
            ]);

            setCurrentWeather(weatherData);
            setForecast(forecast);

        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Failed to load weather data."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchWeatherByLocation = async () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const weatherData = await getCurrentWeatherByCoordinates(latitude, longitude);
                    setCurrentWeather(weatherData);

                    const forecastData = await getWeatherForecast(weatherData.name);
                    setForecast(forecastData);

                } catch (error) {
                    setError(
                        error instanceof Error ? error.message : "Failed to load weather data."
                    );
                } finally {
                    setLoading(false);
                }
            }, (error) => {
                setError("Unable to get your location: " + error.message);
                setLoading(false);
            }
        )
    }

    const toggleUnit = () => {
        setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
    }

    useEffect(() => {
        fetchWeatherByCity("San Francisco");
    }, []);

    return {
        currentWeather,
        forecast,
        loading,
        error,
        unit,
        fetchWeatherByCity,
        fetchWeatherByLocation,
        toggleUnit
    }

}

import { useCallback, useEffect, useRef, useState } from "react";
import {
    getCurrentWeatherByCity,
    getCurrentWeatherByCoordinates,
    getWeatherForecast,
    getWeatherForecastByCoordinates,
} from "../services/weather-api";

const DEFAULT_CITY = "San Francisco";
const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: false,
    maximumAge: 10 * 60 * 1000,
};

export const useWeather = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unit, setUnit] = useState("C");
    const requestIdRef = useRef(0);

    const createRequestId = useCallback(() => {
        requestIdRef.current += 1;
        return requestIdRef.current;
    }, []);

    const fetchWeatherByCity = useCallback(async (city) => {
        const requestId = createRequestId();
        setLoading(true);
        setError(null);
        try {
            const [weatherData, forecast] = await Promise.all([
                getCurrentWeatherByCity(city),
                getWeatherForecast(city),
            ]);

            if (requestId === requestIdRef.current) {
                setCurrentWeather(weatherData);
                setForecast(forecast);
            }

        } catch (error) {
            if (requestId === requestIdRef.current) {
                setError(
                    error instanceof Error ? error.message : "Failed to load weather data."
                );
            }
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, [createRequestId]);

    const fetchWeatherByCoordinates = useCallback(async (latitude, longitude) => {
        const requestId = createRequestId();
        setLoading(true);
        setError(null);
        try {
            const [weatherData, forecastData] = await Promise.all([
                getCurrentWeatherByCoordinates(latitude, longitude),
                getWeatherForecastByCoordinates(latitude, longitude),
            ]);

            if (requestId === requestIdRef.current) {
                setCurrentWeather(weatherData);
                setForecast(forecastData);
            }

        } catch (error) {
            if (requestId === requestIdRef.current) {
                setError(
                    error instanceof Error ? error.message : "Failed to load weather data."
                );
            }
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, [createRequestId]);

    const fetchWeatherByLocation = useCallback(async ({ fallbackCity, silentFallback = false } = {}) => {
        const locationRequestId = createRequestId();

        if (!navigator.geolocation) {
            if (fallbackCity) {
                fetchWeatherByCity(fallbackCity);
            } else if (!silentFallback) {
                setError("Geolocation is not supported by your browser.");
                setLoading(false);
            } else {
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                if (locationRequestId !== requestIdRef.current) {
                    return;
                }

                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            }, (error) => {
                if (locationRequestId !== requestIdRef.current) {
                    return;
                }

                if (fallbackCity) {
                    fetchWeatherByCity(fallbackCity);
                } else {
                    if (!silentFallback) {
                        setError("Unable to get your location: " + error.message);
                    }
                    setLoading(false);
                }
            },
            GEOLOCATION_OPTIONS
        )
    }, [createRequestId, fetchWeatherByCity, fetchWeatherByCoordinates]);

    const fetchInitialWeather = useCallback(() => {
        fetchWeatherByCity(DEFAULT_CITY);

        if (!navigator.geolocation) {
            return;
        }

        const initialLocationRequestId = requestIdRef.current;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (initialLocationRequestId !== requestIdRef.current) {
                    return;
                }

                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            },
            () => {},
            GEOLOCATION_OPTIONS
        );
    }, [fetchWeatherByCity, fetchWeatherByCoordinates]);

    const toggleUnit = () => {
        setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
    }

    useEffect(() => {
        fetchInitialWeather();
    }, [fetchInitialWeather]);

    return {
        currentWeather,
        forecast,
        loading,
        error,
        unit,
        fetchWeatherByCity,
        fetchWeatherByCoordinates,
        fetchWeatherByLocation,
        toggleUnit
    }

}

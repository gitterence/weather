
const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const OPENWEATHER_GEO_URL = "http://api.openweathermap.org/geo/1.0";
const UNIT = "metric";

export const getCurrentWeatherByCity = async (city) => {
    try {
        const response = await fetch(`${OPENWEATHER_BASE_URL}/weather?q=${city}&units=${UNIT}&appid=${API_KEY}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City not found: ${city}`);
            } else if (response.status === 401) {
                throw new Error(`Invalid API key`);
            } else {
                throw new Error(`The weather service is temporarily unavailable. Please try again later.`);
            }
        }

        const data = await response.json();
        if (!data.dt) {
            data.dt = Math.floor(Date.now() / 1000); // current timestamp in seconds if not provided
        }
        return data;

    } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error(`Network error. Please check your internet connection.`);
        }
    }
}

export const getCurrentWeatherByCoordinates = async (latitude, longitude) => {
    try {
        const response = await fetch(`${OPENWEATHER_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=${UNIT}&appid=${API_KEY}`);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error(`Invalid API key`);
            } else {
                throw new Error(`The weather service is temporarily unavailable. Please try again later.`);
            }
        }

        const data = await response.json();
        if (!data.dt) {
            data.dt = Math.floor(Date.now() / 1000); // current timestamp in seconds if not provided
        }
        return data;

    } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error(`Network error. Please check your internet connection.`);
        }
    }
}

export const getWeatherForecast = async (city) => {
    try {
        const response = await fetch(`${OPENWEATHER_BASE_URL}/forecast?q=${city}&units=${UNIT}&appid=${API_KEY}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City not found: ${city}`);
            } else if (response.status === 401) {
                throw new Error(`Invalid API key`);
            } else {
                throw new Error(`The weather service is temporarily unavailable. Please try again later.`);
            }
        }

        const data = await response.json();
        return data;

    } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error(`Network error. Please check your internet connection.`);
        }
    }
}

export const searchCities = async (query) => {
    try {
        const response = await fetch(`${OPENWEATHER_GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error(`Invalid API key`);
            } else {
                throw new Error(`The weather service is temporarily unavailable. Please try again later.`);
            }
        }

        const data = await response.json();

        const cities = data.map((city) => {
            return {
                name: city.name,
                lat: city.lat,
                lon: city.lon,
                state: city.state || "",
                country: city.country
            }
        });

        return cities;

    } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error(`Network error. Please check your internet connection.`);
        }
    }
}

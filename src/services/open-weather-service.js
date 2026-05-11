const DEFAULT_WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const DEFAULT_GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0";

export class OpenWeatherService {
    constructor({
        apiKey,
        weatherBaseUrl = DEFAULT_WEATHER_BASE_URL,
        geoBaseUrl = DEFAULT_GEO_BASE_URL,
        units = "metric",
        fetcher = (...args) => fetch(...args),
    }) {
        this.apiKey = apiKey;
        this.weatherBaseUrl = weatherBaseUrl;
        this.geoBaseUrl = geoBaseUrl;
        this.units = units;
        this.fetcher = fetcher;
    }

    /**
     * Core request method handling URL construction, fetch, and unified error handling.
     */
    async _request(baseUrl, endpoint, params = {}) {
        if (!this.apiKey) {
            throw new Error("Missing OpenWeather API key");
        }

        const url = new URL(`${baseUrl}${endpoint}`);

        url.search = new URLSearchParams({
            ...params,
            appid: this.apiKey,
        });

        try {
            const response = await this.fetcher(url.toString());

            if (!response.ok) {
                await this._handleApiError(response);
            }

            return await response.json();
        } catch (error) {
            this._handleNetworkError(error);
        }
    }

    async _handleApiError(response) {
        let errorMessage = `OpenWeather API Error: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
                errorMessage = errorData.message;
            }
        } catch {
            // Ignore if response body isn't JSON
        }

        if (response.status === 401) {
            throw new Error("Invalid API key");
        } else if (response.status === 404) {
            throw new Error("Requested resource not found");
        } else if (response.status >= 500) {
            throw new Error("The weather service is temporarily unavailable. Please try again later.");
        }

        throw new Error(errorMessage);
    }

    _handleNetworkError(error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error("Network error. Please check your internet connection.");
        }
        throw error;
    }

    /**
     * Generic method for Weather Data API endpoints.
     */
    async _requestWeather(endpoint, params = {}) {
        return this._request(this.weatherBaseUrl, endpoint, {
            ...params,
            units: this.units,
        });
    }

    /**
     * Generic method for Geo API endpoints.
     */
    async _requestGeo(endpoint, params = {}) {
        return this._request(this.geoBaseUrl, endpoint, params);
    }

    // --- Public Methods ---

    async getCurrentWeatherByCity(city) {
        const data = await this._requestWeather("/weather", { q: city });
        if (!data.dt) {
            data.dt = Math.floor(Date.now() / 1000);
        }
        return data;
    }

    async getCurrentWeatherByCoordinates(latitude, longitude) {
        const data = await this._requestWeather("/weather", { lat: latitude, lon: longitude });
        if (!data.dt) {
            data.dt = Math.floor(Date.now() / 1000);
        }
        return data;
    }

    async getForecastWeatherByCity(city) {
        return this._requestWeather("/forecast", { q: city });
    }

    async getForecastWeatherByCoordinates(latitude, longitude) {
        return this._requestWeather("/forecast", { lat: latitude, lon: longitude });
    }

    async searchCities(query, limit = 5) {
        const data = await this._requestGeo("/direct", { q: query, limit });
        
        // Map to a standardized city object structure for the frontend components
        return data.map((city) => ({
            name: city.name,
            lat: city.lat,
            lon: city.lon,
            state: city.state || "",
            country: city.country,
        }));
    }
}

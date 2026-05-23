import { 
    Sun, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow, CloudFog, Wind 
} from "lucide-react";

export const getWeatherIcon = (weather) => {
    const iconMap = {
        Clear: Sun,
        Clouds: Cloud,
        Rain: CloudRain,
        Drizzle: CloudDrizzle,
        Thunderstorm: CloudLightning,
        Snow: CloudSnow,
        Haze: CloudFog,
        Mist: CloudFog,
        Fog: CloudFog,
        Dust: Wind,
        Sand: Wind,
        Ash: Wind,
        Squall: Wind,
        Tornado: CloudLightning,
    };

    return iconMap[weather] || Cloud;
}

export const formatTemperature = (temp, unit) => {
    if (unit === "F") {
        return Math.round((temp * 9) / 5 + 32);
    }
    return Math.round(temp);
}

export const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

export const formatDate = (timestamp, options = {}) => {
    const defaultOptions = {
        weekday: "long",
        month: "short",
        day: "numeric"
    };
    return new Date(timestamp * 1000).toLocaleDateString("en-US", { ...defaultOptions, ...options });
}

// Formats a specific timestamp (like sunrise/sunset) to the city's local time
export const formatCityTime = (timestamp, timezoneOffsetSeconds) => {
    const utcTimeMs = timestamp * 1000;
    const browserOffsetMs = new Date().getTimezoneOffset() * 60000;
    const cityTimeMs = utcTimeMs + browserOffsetMs + (timezoneOffsetSeconds * 1000);
    return new Date(cityTimeMs).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Formats a specific timestamp to the city's local date
export const formatCityDate = (timestamp, timezoneOffsetSeconds, options = {}) => {
    const defaultOptions = {
        weekday: "long",
        month: "short",
        day: "numeric"
    };
    const utcTimeMs = timestamp * 1000;
    const browserOffsetMs = new Date().getTimezoneOffset() * 60000;
    const cityTimeMs = utcTimeMs + browserOffsetMs + (timezoneOffsetSeconds * 1000);
    return new Date(cityTimeMs).toLocaleDateString("en-US", { ...defaultOptions, ...options });
}

export const getLocalTimeAsSeconds = (timezoneOffsetSeconds) => {
    const now = new Date();
    // Convert to UTC, then add the city's timezone offset
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cityTime = utcTime + (timezoneOffsetSeconds * 1000);
    // Return in seconds for formatTime/formatDate
    return cityTime / 1000;
}

export const isWeatherDaytime = (weather) => {
    const timestamp = weather?.dt;
    const sunrise = weather?.sys?.sunrise;
    const sunset = weather?.sys?.sunset;

    if (Number.isFinite(timestamp) && Number.isFinite(sunrise) && Number.isFinite(sunset)) {
        return timestamp >= sunrise && timestamp < sunset;
    }

    if (Number.isFinite(weather?.timezone)) {
        const cityTimeMs = Date.now() + weather.timezone * 1000;
        const cityHour = new Date(cityTimeMs).getUTCHours();
        return cityHour >= 6 && cityHour < 18;
    }

    return true;
}

export const formatSpeed = (speed, unit) => {
    if (unit === "km/h") {
        return Math.round(speed * 3.6);
    }
    return Math.round(speed);
}

export const getWindDirection = (deg) => {
    const directions = [
        "N",
        "NNE",
        "NE",
        "ENE",
        "E",
        "ESE",
        "SE",
        "SSE",
        "S",
        "SSW",
        "SW",
        "WSW",
        "W",
        "WNW",
        "NW",
        "NNW",
    ];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
}

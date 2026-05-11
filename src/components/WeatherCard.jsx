import { createElement } from "react";
import {
    MapPin, Sunrise, Sunset,
    Thermometer, Droplets, Eye, CloudRain, Wind, Compass
} from "lucide-react";
import {
    getWeatherIcon, formatTemperature, formatTime, formatDate,
    getWindDirection, getLocalTimeAsSeconds, formatCityTime
} from "../utils/weather-utils"

const getRainForecast = (forecast) => {
    if (!forecast?.list?.length) {
        return {
            pop: 0,
            forecastTime: null,
        };
    }

    const currentUtcSeconds = Date.now() / 1000;
    const nextForecast = forecast.list.find(item => item.dt >= currentUtcSeconds);
    const rainForecast = nextForecast || forecast.list[0];

    return {
        pop: rainForecast.pop ?? 0,
        forecastTime: rainForecast.dt,
    };
};

const getWeatherStats = (weather, unit, rainForecast) => [
    {
        icon: Thermometer,
        label: "Feels Like",
        value: `${formatTemperature(weather.main.feels_like, unit)}°${unit}`,
        color: "text-rose-200",
    },
    {
        icon: Droplets,
        label: "Humidity",
        value: `${weather.main.humidity}%`,
        color: "text-cyan-300",
    },
    {
        icon: Eye,
        label: "Visibility",
        value: `${(weather.visibility / 1000).toFixed(1)} km`,
        color: "text-amber-200",
    },
    {
        icon: CloudRain,
        label: rainForecast.forecastTime
            ? `Rain at ${formatCityTime(rainForecast.forecastTime, weather.timezone)}`
            : "Rain Chance",
        value: `${Math.round(rainForecast.pop * 100)}%`,
        color: "text-sky-400"
    },
    {
        icon: Wind,
        label: "Wind Speed",
        value: `${weather.wind.speed.toFixed(1)} m/s`,
        color: "text-green-300",
    },
    {
        icon: Compass,
        label: "Wind Dir",
        value: getWindDirection(weather.wind.deg),
        color: "text-teal-300",
    },
];

function WeatherCard({ weather, forecast, unit }) {
    const WeatherIconComponent = getWeatherIcon(weather.weather[0].main);
    const rainForecast = getRainForecast(forecast);
    const weatherStats = getWeatherStats(weather, unit, rainForecast);


    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl 
        p-8 shadow-2xl hover:bg-white/15 transition-all duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/10 rounded-full">
                        <MapPin className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                        <h2 className="text-white font-semibold text-lg">{weather.name}</h2>
                        <p className="text-white/60 text-sm">{weather.sys.country}</p>
                    </div>
                </div>

                <div className="text-right">
                    {/* Display Current Date */}
                    <div className="text-white/70 text-sm">
                        {formatDate(getLocalTimeAsSeconds(weather.timezone), { weekday: "long" })}
                    </div>

                    {/* Display Current Time */}
                    <div className="text-white/50 text-xs">
                        {formatTime(getLocalTimeAsSeconds(weather.timezone))}
                    </div>
                </div>
            </div>

            {/* Main Weather Content*/}
            <div className="flex items-center justify-between mb-10">
                <div className="flex-1">
                    <div className="text-7xl font-bold text-white mb-3 tracking-tight">
                        {formatTemperature(weather.main.temp, unit)}°
                    </div>
                    <div className="text-white/90 text-xl capitalize mb-2 font-medium">
                        {weather.weather[0].description}
                    </div>
                    <div className="flex items-center space-x-4 text-white/60 text-sm">
                        <span>Highest: {formatTemperature(weather.main.temp_max, unit)}°</span>
                        <span>Lowest: {formatTemperature(weather.main.temp_min, unit)}°</span>
                    </div>
                </div>
                <div className="text-white/90 transform hover:scale-110 
                transition-transform duration-300">
                    {/* Display Weather Icon */}
                    {createElement(WeatherIconComponent, {
                        size: 100,
                        className: "drop-shadow-2xl animate-pulse",
                    })}
                </div>
            </div>

            {/* Weather Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Stats Grid */}
                {weatherStats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl p-4
                        hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-2 rounded-full ${stat.color} bg-white/10
                                group-hover:bg-white/20 transition-all`}>
                                {createElement(stat.icon, { className: "w-5 h-5" })}
                            </div>
                            <span className="text-white/70 text-sm font-medium">{stat.label}</span>
                        </div>
                        <div className="text-white font-semibold text-lg pl-11">
                            {stat.value}
                        </div>
                    </div>
                ))}

            </div>

            {/* Sunrise/Sunset Time */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-linear-to-r from-orange-500/20 to-yellow-500/20 
                backdrop-blur-sm rounded-2xl p-4 border border-orange-400/20
                hover:from-orange-500/30 hover:to-yellow-500/30 transition-all duration-300 group">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-orange-400/20 rounded-full
                        group-hover:bg-orange-400/40 transition-all">
                            <Sunrise className="w-4 h-4 text-orange-300" />
                        </div>
                        <span className="text-white/80 text-sm font-medium">Sunrise</span>
                    </div>
                    <div className="text-white font-semibold text-lg pl-11">
                        {formatCityTime(weather.sys.sunrise, weather.timezone)}
                    </div>
                </div>

                <div className="bg-linear-to-r from-purple-500/20 to-pink-500/20 
                backdrop-blur-sm rounded-2xl p-4 border border-purple-400/20
                hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 group">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-purple-400/20 rounded-full
                        group-hover:bg-purple-400/40 transition-all">
                            <Sunset className="w-4 h-4 text-purple-300" />
                        </div>
                        <span className="text-white/80 text-sm font-medium">Sunset</span>
                    </div>
                    <div className="text-white font-semibold text-lg pl-11">
                        {formatCityTime(weather.sys.sunset, weather.timezone)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeatherCard

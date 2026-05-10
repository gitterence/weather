import { Calendar, Droplet } from "lucide-react";
import { formatDate, formatTemperature, getWeatherIcon } from "../utils/weather-utils";

const processDailyForecasts = (list) => {
    const dailyForecasts = list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString()

        if (!acc[date]) {
            // Initialize: Shallow copy item and main to prevent mutating original data
            acc[date] = {
                ...item,
                main: { ...item.main }
            };
        } else {
            // Compare and save the highest and lowest temperatures of the day
            acc[date].main.temp_max = Math.max(acc[date].main.temp_max, item.main.temp_max);
            acc[date].main.temp_min = Math.min(acc[date].main.temp_min, item.main.temp_min);

            // Save the highest probability of precipitation for the day
            acc[date].pop = Math.max(acc[date].pop, item.pop);

            // Weather Icon: Try to use daytime (12:00 PM - 3:00 PM) weather as the daily representative
            const hour = new Date(item.dt * 1000).getHours();
            if (hour >= 12 && hour <= 15) {
                acc[date].weather = item.weather;
            }
        }

        return acc;
    }, {});

    return Object.values(dailyForecasts).slice(0, 5);
};

function WeatherForecast({ forecastData, unit }) {
    const dailyItems = processDailyForecasts(forecastData.list);

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 
        rounded-3xl p-6 sm:p-8 shadow-2xl h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="p-2 bg-white/10 rounded-full">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">5-Day Forecast</h2>
            </div>

            <div className="flex flex-col flex-1">
                {/* Mapping Logic */}
                {dailyItems.map((item, index) => {
                    const IconComponent = getWeatherIcon(item.weather[0].main);
                    const dateObj = new Date(item.dt * 1000);
                    const weekdayStr = index === 0 ? "Today" : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                    return (
                        <div key={index} className={`flex-1 flex items-center py-2 sm:py-3 transition-colors duration-300 hover:bg-white/5 px-2 sm:px-4 rounded-xl ${index !== dailyItems.length - 1 ? 'border-b border-white/10' : ''
                            }`}>
                            {/* 1. Left: Calendar Date Style */}
                            <div className="flex flex-col w-12 sm:w-16 shrink-0 justify-center">
                                <span className="text-white font-bold text-base sm:text-lg">{weekdayStr}</span>
                                <span className="text-white/50 text-[10px] sm:text-xs font-medium uppercase tracking-wider">{dateStr}</span>
                            </div>

                            {/* 2. Center: Icon & POP */}
                            <div className="flex items-center flex-1 min-w-0 px-2 sm:px-4">
                                <div className="flex flex-row items-center">
                                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-white/5 rounded-full border border-white/10">
                                        <IconComponent size={20} className="text-white sm:w-6 sm:h-6" />
                                    </div>

                                    {item.pop > 0 && (
                                        <div className="ml-2 sm:ml-3 whitespace-nowrap">
                                            <span className="flex items-center text-blue-400 text-[10px] sm:text-[11px] font-bold">
                                                <Droplet size={10} className="mr-0.5 sm:w-3 sm:h-3" />
                                                {Math.round(item.pop * 100)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 3. Right: Description & Compact Temps */}
                            <div className="flex flex-col items-end justify-center shrink-0 text-right">
                                <span className="text-white/90 text-xs sm:text-sm font-medium capitalize tracking-wide mb-0.5 sm:mb-1">
                                    {item.weather[0].description}
                                </span>
                                <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] sm:text-sm">
                                    <span className="text-white font-bold">
                                        H: {formatTemperature(item.main.temp_max, unit)}°
                                    </span>
                                    <span className="text-white/60 font-medium">
                                        L: {formatTemperature(item.main.temp_min, unit)}°
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default WeatherForecast;
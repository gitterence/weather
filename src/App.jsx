import bgImage from "./assets/weather-bg-image.jpeg"
import SearchBar from "./components/SearchBar"
import TemperatureToggle from "./components/TemperatureToggle"
import LoadingSpinner from "./components/LoadingSpinner"
import ErrorMessage from "./components/ErrorMessage"
import WeatherCard from "./components/WeatherCard"
import WeatherForecast from "./components/WeatherForecast"
import WeatherBackground from "./components/WeatherBackground"
import { useWeather } from "./hooks/useWeather"


function App() {
  const {
    currentWeather,
    forecast,
    loading,
    error,
    unit,
    fetchWeatherByCity,
    fetchWeatherByCoordinates,
    fetchWeatherByLocation,
    toggleUnit,
  } = useWeather();
  const hasWeather = Boolean(currentWeather);
  const showInitialLoading = loading && !hasWeather;
  const showWeather = hasWeather && !error;

  const handleRetry = () => {
    if (currentWeather) {
      fetchWeatherByCity(currentWeather.name)
    } else {
      fetchWeatherByCity("Cupertino")
    }

  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Base Textured Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      
      {/* Dynamic Weather Overlay & Particles */}
      <WeatherBackground weatherCondition={currentWeather} />
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-8">
              <h1 className="app-title text-5xl md:text-6xl mb-4">
                <span>
                  SkyLite
                </span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl font-medium mb-8 max-w-2xl mx-auto leading-relaxed">
                Get the latest weather updates for any location around the world
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-6 mb-12">
              <SearchBar
                onSearch={fetchWeatherByCity}
                onCitySelect={fetchWeatherByCoordinates}
                onLocationSearch={fetchWeatherByLocation}
                isLoading={loading}
              />
              <TemperatureToggle unit={unit} onToggle={toggleUnit} />
            </div>
          </div>

          {/* Main Content */}
          <div className="min-h-[520px] space-y-8">
            {/* Render Loading Spinner */}
            {showInitialLoading && (
              <div className="flex justify-center content-fade-in">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  <LoadingSpinner />
                  <p className="text-white/80 text-center mt-4 font-medium animate-pulse">
                    Loading weather data...
                  </p>
                </div>
              </div>
            )}

            {/* Render Error Message */}
            {error && !loading && (
              <div className="max-w-2xl mx-auto content-fade-in">
                <ErrorMessage message={error} onRetry={handleRetry} />
              </div>
            )}

            {/* Render Weather Data*/}
            {showWeather && (
              <div className="relative grid grid-cols-1 xl:grid-cols-3 gap-8 content-fade-in">
                {loading && (
                  <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-white/15 bg-slate-950/35 px-4 py-2 text-sm font-medium text-white/80 shadow-lg backdrop-blur-xl">
                    Updating...
                  </div>
                )}
                <div className="xl:col-span-2">
                  <WeatherCard weather={currentWeather} forecast={forecast} unit={unit} />
                </div>
                <div className="xl:col-span-1">
                  {/* Render Forecast Data */}
                  {forecast && (<WeatherForecast forecastData={forecast} unit={unit} />)}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default App

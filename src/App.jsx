import bgImage from "./assets/weather-bg-image.jpeg"
import SearchBar from "./components/SearchBar"
import TemperatureToggle from "./components/TemperatureToggle"
import LoadingSpinner from "./components/LoadingSpinner"
import ErrorMessage from "./components/ErrorMessage"
import WeatherCard from "./components/WeatherCard"


function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`
        }}
      ></div>
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-8">
              <h1 className="text-5xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight">
                Weather{" "}
                <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Pro
                </span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Get the latest weather updates for any location around the world.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-6 mb-12">
              <SearchBar />
              <TemperatureToggle />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Conditional Render Loading Spinner */}
            {/* <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <LoadingSpinner />
                <p className="text-white/80 text-center mt-4 font-medium animate-pulse">
                  Loading weather data...
                </p>
              </div>
            </div> */}

            {/* Conditional Render Error Message */}
            {/* <div className="max-w-2xl mx-auto">
              <ErrorMessage />
            </div> */}

            {/* Conditional Render Weather Data*/}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <WeatherCard />

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

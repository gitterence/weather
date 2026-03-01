import bgImage from "./assets/weather-bg-image.jpeg"
import SearchBar from "./components/SearchBar"
import TemperatureToggle from "./components/TemperatureToggle"

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
        </div>
      </div>
    </div>
  )
}

export default App

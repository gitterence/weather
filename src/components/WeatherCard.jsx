import { MapPin } from "lucide-react";

function WeatherCard() {
    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/10 rounded-full">
                        <MapPin className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                        <h2 className="text-white font-semibold text-lg">Weather Name</h2>
                        <p className="text-white/60 text-sm">Weather Country</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-white/70 text-sm">
                        {/* Display Dynamic Date */}
                    </div>
                    <div className="text-white/50 text-xs">
                        {/* Display Dynamic Time */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeatherCard

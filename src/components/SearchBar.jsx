import { useState, useRef, useEffect } from "react";
import { LocateFixed, Search, X } from "lucide-react";
import { searchCities } from "../services/weather-api";

function SearchBar({ onSearch, onCitySelect, onLocationSearch, isLoading }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const searchRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const searchTimeout = setTimeout(async () => {
            if (query.length > 2) {
                setSearchLoading(true);

                try {
                    const result = await searchCities(query);
                    setSuggestions(result);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Error searching cities:", error);
                    setSuggestions([]);
                    setShowSuggestions(false);
                } finally {
                    setSearchLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);
        return () => clearTimeout(searchTimeout);
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimQuery = query.trim();
        if (trimQuery) {
            onSearch(trimQuery);
            setQuery("");
            setShowSuggestions(false);
        }
    };

    const clearSearch = () => {
        setQuery("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (city) => {
        if (onCitySelect && city.lat && city.lon) {
            onCitySelect(city.lat, city.lon);
        } else {
            onSearch(city.name);
        }
        setQuery("");
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full max-w-2xl" ref={searchRef}>
            <form className="relative" onSubmit={handleSubmit}>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray/60 w-5 h-5 
                    group-focus-within:text-white transition-all" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter a city to see its weather"
                        className="w-full pl-12 pr-24 py-4 bg-white/10 backdrop-blur-xl rounded-full text-white placeholder-white/70 
                        focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 hover:bg-white/20"
                        disabled={isLoading}
                    />
                    {/* Conditional Rendering for Clear Button */}
                    {query && (
                        <button
                            type="button"
                            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white 
                            transition-all p-1 rounded-full hover:bg-white/10"
                            onClick={clearSearch}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    <button
                        type="button"
                        className="group/location absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white 
                        transition-all p-1 rounded-full hover:bg-white/10"
                        onClick={onLocationSearch}
                        disabled={isLoading}
                        aria-label="Current location weather"
                    >
                        <LocateFixed className="w-5 h-5" />
                        <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/15 bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl backdrop-blur-md transition-opacity duration-200 group-hover/location:opacity-100 group-focus-visible/location:opacity-100">
                            Current location weather
                        </span>
                    </button>
                </div>
            </form>

            {/* Searching */}
            {showSuggestions && (suggestions.length > 0 || searchLoading) && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/10 backdrop-blur-xl 
                border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50">
                    {searchLoading ? (
                        <div className="p-6 text-center text-white/70">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white mx-auto"></div>
                            <p className="animate-pulse mt-2">Searching...</p>
                        </div>
                    ) : (
                        suggestions.map((city, index) => (
                            <button
                                type="button"
                                className="w-full px-6 py-4 text-left hover:bg-white/10 transition-all duration-200 
                                flex items-center justify-between group border-b border-white/10 last:border-b-0"
                                key={city.name + "-" + city.country + "-" + index}
                                onClick={() => handleSuggestionClick(city)}
                            >
                                <div>
                                    <div className="font-medium text-white group-hover:text-white/90">
                                        {city.name}
                                        {city.state && <span className="text-white/70">, {city.state}</span>}
                                    </div>
                                    <div className="text-sm text-white/60">{city.country}</div>
                                </div>

                                <Search className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-all" />
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;

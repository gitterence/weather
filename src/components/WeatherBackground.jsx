import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useAppShellColor } from "../hooks/useAppShellColor";
import { isWeatherDaytime } from "../utils/weather-utils";

const WEATHER_THEMES = {
    thunderstorm: {
        themeClasses: {
            day: "from-slate-700 via-gray-800 to-slate-900",
            night: "from-slate-950 via-gray-950 to-black",
        },
        shellColors: {
            day: "#374151",
            night: "#020617",
        },
    },
    drizzle: {
        themeClasses: {
            day: "from-slate-400 via-slate-500 to-slate-600",
            night: "from-slate-900 via-slate-950 to-gray-950",
        },
        shellColors: {
            day: "#64748b",
            night: "#0f172a",
        },
    },
    rain: {
        themeClasses: {
            day: "from-slate-500 via-slate-600 to-slate-700",
            night: "from-zinc-950 via-slate-950 to-black",
        },
        shellColors: {
            day: "#475569",
            night: "#09090b",
        },
    },
    snow: {
        themeClasses: {
            day: "from-zinc-200 via-slate-300 to-slate-500",
            night: "from-slate-800 via-slate-900 to-blue-950",
        },
        shellColors: {
            day: "#94a3b8",
            night: "#1e293b",
        },
    },
    atmosphere: {
        themeClasses: {
            day: "from-stone-300 via-gray-400 to-slate-500",
            night: "from-stone-800 via-slate-900 to-gray-950",
        },
        shellColors: {
            day: "#78716c",
            night: "#1c1917",
        },
    },
    clouds: {
        themeClasses: {
            day: "from-slate-300 via-slate-400 to-gray-500",
            night: "from-slate-900 via-slate-800 to-gray-950",
        },
        shellColors: {
            day: "#94a3b8",
            night: "#1e293b",
        },
    },
    clear: {
        themeClasses: {
            day: "from-slate-300 via-sky-300 to-gray-500",
            night: "from-indigo-950 via-slate-950 to-sky-950",
        },
        shellColors: {
            day: "#94a3b8",
            night: "#334155",
        },
        overlayOpacityClasses: {
            day: "opacity-[0.94]",
        },
    },
};

const DEFAULT_OVERLAY_OPACITY_CLASS = "opacity-[0.82]";

const PARTICLE_OPTIONS = {
    thunderstorm: {
        particles: {
            color: { value: "#ffffff" },
            number: { value: 300, density: { enable: true, area: 800 } },
            opacity: { value: { min: 0.5, max: 0.9 } },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: { min: 30, max: 50 }, direction: "bottom", straight: true, outModes: "out" },
        },
    },
    drizzle: {
        particles: {
            color: { value: "#cbd5e1" },
            number: { value: 130, density: { enable: true, area: 900 } },
            opacity: { value: { min: 0.18, max: 0.45 } },
            shape: { type: "circle" },
            size: { value: { min: 0.6, max: 1.5 } },
            move: { enable: true, speed: { min: 8, max: 18 }, direction: "bottom", straight: true, outModes: "out" },
        },
    },
    rain: {
        particles: {
            color: { value: "#a0aec0" },
            number: { value: 250, density: { enable: true, area: 800 } },
            opacity: { value: { min: 0.3, max: 0.7 } },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 2.5 } },
            move: { enable: true, speed: { min: 20, max: 40 }, direction: "bottom", straight: true, outModes: "out" },
        },
    },
    snow: {
        particles: {
            color: { value: "#ffffff" },
            number: { value: 150, density: { enable: true, area: 800 } },
            opacity: { value: { min: 0.4, max: 0.9 } },
            shape: { type: "circle" },
            size: { value: { min: 2, max: 5 } },
            move: { enable: true, speed: { min: 1, max: 3 }, direction: "bottom", straight: false, outModes: "out" },
        },
    },
    atmosphere: {
        particles: {
            color: { value: "#e2e8f0" },
            number: { value: 28, density: { enable: true, area: 1000 } },
            opacity: { value: { min: 0.06, max: 0.18 } },
            shape: { type: "circle" },
            size: { value: { min: 12, max: 48 } },
            move: { enable: true, speed: { min: 0.12, max: 0.45 }, direction: "right", random: false, straight: false, outModes: "out" },
        },
    },
    clouds: {
        particles: {
            color: { value: ["#ffffff", "#dbeafe", "#cbd5e1"] },
            number: { value: 16, density: { enable: true, area: 1200 } },
            opacity: { value: { min: 0.025, max: 0.08 } },
            shape: { type: "circle" },
            size: { value: { min: 18, max: 54 } },
            move: { enable: true, speed: { min: 0.14, max: 0.32 }, direction: "right", straight: false, outModes: "out" },
        },
    },
    clear: {
        particles: {
            color: { value: "#ffffff" },
            number: { value: 15, density: { enable: true, area: 800 } },
            opacity: { value: { min: 0.1, max: 0.3 } },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 0.2, direction: "none", random: true, outModes: "out" },
        },
    },
};

const getWeatherType = (id) => {
    if (id >= 200 && id < 300) return "thunderstorm";
    if (id >= 300 && id < 400) return "drizzle";
    if (id >= 500 && id < 600) return "rain";
    if (id >= 600 && id < 700) return "snow";
    if (id >= 700 && id < 800) return "atmosphere";
    if (id >= 801 && id <= 804) return "clouds";
    return "clear";
};

const getBackgroundConfig = (condition) => {
    const weatherId = condition?.weather?.[0]?.id || 801;
    const weatherType = getWeatherType(weatherId);
    const timeOfDay = isWeatherDaytime(condition) ? "day" : "night";
    const theme = WEATHER_THEMES[weatherType];

    return {
        weatherId,
        timeOfDay,
        themeClasses: theme.themeClasses[timeOfDay],
        shellColor: theme.shellColors[timeOfDay],
        overlayOpacityClass: theme.overlayOpacityClasses?.[timeOfDay] || DEFAULT_OVERLAY_OPACITY_CLASS,
        particleOptions: PARTICLE_OPTIONS[weatherType],
    };
};

const WeatherBackground = ({ weatherCondition }) => {
    const [particlesReady, setParticlesReady] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setParticlesReady(true);
        });
    }, []);

    const {
        weatherId,
        themeClasses,
        particleOptions,
        timeOfDay,
        shellColor,
        overlayOpacityClass,
    } = useMemo(() => getBackgroundConfig(weatherCondition), [weatherCondition]);

    useAppShellColor(shellColor);

    return (
        <div className="absolute inset-0 z-0">
            {/* Frosted Glass Color Overlay */}
            <div className={`absolute inset-0 bg-linear-to-br ${overlayOpacityClass} backdrop-blur-2xl transition-colors duration-1000 ease-in-out ${themeClasses}`} />

            {/* Particles on top of the frosted glass */}
            {particlesReady && particleOptions && (
                <Particles
                    key={`${weatherId}-${timeOfDay}`}
                    id="tsparticles"
                    options={{
                        ...particleOptions,
                        background: { color: { value: "transparent" } },
                        detectRetina: true,
                    }}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                />
            )}
        </div>
    );
};

export default WeatherBackground;

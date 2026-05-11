import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const WeatherBackground = ({ weatherCondition }) => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const getThemeAndOptions = (condition) => {
        const id = condition?.weather?.[0]?.id || 801;

        let themeClasses = 'from-gray-500 via-slate-600 to-gray-700';
        let options = null;

        // Thunderstorm (id 200 - 299)
        if (id >= 200 && id < 300) {
            themeClasses = 'from-slate-900 via-gray-900 to-black';
            options = {
                particles: {
                    color: { value: "#ffffff" },
                    number: { value: 300, density: { enable: true, area: 800 } },
                    opacity: { value: { min: 0.5, max: 0.9 } },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 3 } },
                    move: { enable: true, speed: { min: 30, max: 50 }, direction: "bottom", straight: true, outModes: "out" }
                }
            };
        }
        // Drizzle & Rain (id 300 - 599)
        else if (id >= 300 && id < 600) {
            themeClasses = 'from-slate-700 via-slate-800 to-slate-900';
            options = {
                particles: {
                    color: { value: "#a0aec0" },
                    number: { value: 250, density: { enable: true, area: 800 } },
                    opacity: { value: { min: 0.3, max: 0.7 } },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 2.5 } },
                    move: { enable: true, speed: { min: 20, max: 40 }, direction: "bottom", straight: true, outModes: "out" }
                }
            };
        }
        // Snow (id 600 - 699)
        else if (id >= 600 && id < 700) {
            themeClasses = 'from-sky-300 via-slate-400 to-slate-500';
            options = {
                particles: {
                    color: { value: "#ffffff" },
                    number: { value: 150, density: { enable: true, area: 800 } },
                    opacity: { value: { min: 0.4, max: 0.9 } },
                    shape: { type: "circle" },
                    size: { value: { min: 2, max: 5 } },
                    move: { enable: true, speed: { min: 1, max: 3 }, direction: "bottom", straight: false, outModes: "out" }
                }
            };
        }
        // Atmosphere: Fog, Mist, Dust, Sand (id 700 - 799)
        else if (id >= 700 && id < 800) {
            themeClasses = 'from-stone-400 via-gray-400 to-stone-500';
            options = {
                particles: {
                    color: { value: "#e2e8f0" },
                    number: { value: 60, density: { enable: true, area: 800 } },
                    opacity: { value: { min: 0.1, max: 0.3 } },
                    shape: { type: "circle" },
                    size: { value: { min: 10, max: 60 } },
                    move: { enable: true, speed: { min: 0.5, max: 1.5 }, direction: "none", random: true, straight: false, outModes: "out" }
                }
            };
        }
        // Clouds (id 801-804)
        else if (id >= 801 && id <= 804) {
            themeClasses = 'from-gray-500 via-slate-600 to-gray-700';
            options = {
                particles: {
                    color: { value: "#ffffff" },
                    number: { value: 18, density: { enable: true, area: 900 } },
                    opacity: { value: { min: 0.04, max: 0.1 } },
                    shape: { type: "circle" },
                    size: { value: { min: 24, max: 72 } },
                    move: { enable: true, speed: 0.35, direction: "right", straight: false, outModes: "out" }
                }
            };
        }
        // Clear (id 800)
        else {
            themeClasses = 'from-sky-500 via-blue-400 to-cyan-300';
            options = {
                particles: {
                    color: { value: "#ffffff" },
                    number: { value: 15, density: { enable: true, area: 800 } },
                    opacity: { value: { min: 0.1, max: 0.3 } },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 3 } },
                    move: { enable: true, speed: 0.2, direction: "none", random: true, outModes: "out" }
                }
            };
        }

        return { themeClasses, options };
    };

    const weatherId = weatherCondition?.weather?.[0]?.id || 801;
    const { themeClasses, options } = useMemo(() => getThemeAndOptions(weatherCondition), [weatherCondition]);

    return (
        <div className="absolute inset-0 z-0">
            {/* Frosted Glass Color Overlay */}
            <div className={`absolute inset-0 bg-linear-to-br opacity-80 backdrop-blur-2xl transition-colors duration-1000 ease-in-out ${themeClasses}`} />

            {/* Particles on top of the frosted glass */}
            {init && options && (
                <Particles
                    key={weatherId}
                    id="tsparticles"
                    options={{
                        ...options,
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

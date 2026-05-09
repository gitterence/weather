

function TemperatureToggle({ unit, onToggle }) {
    const units = ["C", "F"];
    const baseClasses = "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300";
    const activeClasses = "bg-white text-blue-400 shadow-lg transform scale-105";
    const inactiveClasses = "text-white/70 hover:text-white hover:bg-white/10";

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1 shadow-lg">
            <div className="flex items-center">
                {units.map((u) => (
                    <button
                        key={u}
                        className={`${baseClasses} ${unit === u ? activeClasses : inactiveClasses
                            }`}
                        onClick={onToggle}
                    >
                        °{u}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TemperatureToggle
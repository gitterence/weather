import { AlertCircle, RefreshCw } from "lucide-react"

function ErrorMessage({ message, onRetry }) {
    return (
        <div className="rounded-3xl border border-red-300/20 bg-slate-950/45 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-300/25 bg-red-400/15 text-red-100">
                    <AlertCircle className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-white sm:text-xl">
                        Unable to load weather
                    </h3>
                    <p className="mt-2 leading-relaxed text-white/70">{message}</p>

                    {onRetry && (
                        <button
                            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-red-200/50"
                            onClick={onRetry}
                        >
                            <RefreshCw className="h-4 w-4" />
                            <span>Try Again</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ErrorMessage

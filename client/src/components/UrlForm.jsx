import { useState } from "react";
import { Sparkles, Link2, Loader2, AlertCircle } from "lucide-react";

export default function UrlForm({ onSubmit, loading }) {
  const [url, setUrl] = useState("");
  const [localError, setLocalError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) {
      setLocalError("Please enter a valid webpage URL.");
      return;
    }
    setLocalError("");
    onSubmit(url.trim());
  }

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Link2 className="h-5 w-5" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (localError) setLocalError("");
            }}
            placeholder="Paste any article or website URL..."
            disabled={loading}
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 py-4 pl-12 pr-4 text-sm text-slate-100 placeholder-slate-500 shadow-inner backdrop-blur-md transition-all duration-200 focus:border-cyan-500/50 focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-amber-500 p-[1px] font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/35 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex h-full w-full items-center justify-center gap-2 rounded-[15px] bg-slate-950 px-7 py-4 text-sm font-semibold transition-colors group-hover:bg-transparent group-hover:text-slate-950">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-cyan-400 group-hover:text-slate-950" />
                <span>Summarizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-400 group-hover:text-slate-950 transition-transform group-hover:rotate-12" />
                <span>Summarize</span>
              </>
            )}
          </span>
        </button>
      </form>

      {localError && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{localError}</span>
        </div>
      )}
    </div>
  );
}
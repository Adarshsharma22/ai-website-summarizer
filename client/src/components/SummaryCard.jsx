import { useState } from "react";
import { ExternalLink, Copy, Check, Clock, Sparkles } from "lucide-react";

function formatDate(dateString) {
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function SummaryCard({ summary }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fail silently
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-slate-700">
      {/* Decorative Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-500 opacity-80" />

      {/* Header Info */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-400">
              <Sparkles className="h-3 w-3" /> AI Summary
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">{summary.title}</h3>
          <a
            href={summary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1.5 truncate text-xs text-slate-400 transition-colors hover:text-cyan-400"
          >
            <span className="truncate">{summary.url}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="mt-5 rounded-xl border border-slate-800/50 bg-slate-950/50 p-4 text-sm leading-relaxed text-slate-300 whitespace-pre-line">
        {summary.summary}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-800/60 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDate(summary.createdAt)}</span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 shadow-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-800 hover:text-white active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
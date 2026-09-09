import { ExternalLink, Trash2, Clock, Loader2 } from "lucide-react";

function formatDate(dateString) {
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function HistoryCard({ summary, onDelete, deleting }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/50 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/80">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-slate-100 transition-colors group-hover:text-white">
            {summary.title}
          </h3>
          <a
            href={summary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 truncate text-xs text-slate-400 transition-colors hover:text-cyan-400"
          >
            <span className="truncate">{summary.url}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>

        <button
          onClick={() => onDelete(summary.id)}
          disabled={deleting}
          aria-label="Delete summary"
          className="shrink-0 rounded-xl border border-red-500/20 bg-red-500/10 p-2.5 text-xs font-medium text-red-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-400 whitespace-pre-line">
        {summary.summary}
      </div>

      <div className="mt-5 flex items-center gap-1.5 border-t border-slate-800/50 pt-4 text-xs text-slate-500">
        <Clock className="h-3.5 w-3.5" />
        <span>{formatDate(summary.createdAt)}</span>
      </div>
    </div>
  );
}
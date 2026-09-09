import { useEffect, useState } from "react";
import { summaryApi, getErrorMessage } from "../services/api.js";
import HistoryCard from "../components/HistoryCard.jsx";
import { History as HistoryIcon, AlertCircle, Sparkles, Inbox, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function History() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadSummaries();
  }, []);

  async function loadSummaries() {
    setLoading(true);
    setError("");
    try {
      const { data } = await summaryApi.list();
      setSummaries(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await summaryApi.remove(id);
      setSummaries((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-12 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-teal-500/30 bg-teal-500/10 text-teal-400">
                <HistoryIcon className="h-4 w-4" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Summary History</h1>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Manage and review your saved AI webpage summaries.
            </p>
          </div>

          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400">
            {summaries.length} Saved
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="mt-8 flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6"
              >
                <div className="h-5 w-2/3 rounded-lg bg-slate-800" />
                <div className="mt-3 h-3 w-1/3 rounded-lg bg-slate-800/60" />
                <div className="mt-6 h-12 w-full rounded-lg bg-slate-800/40" />
              </div>
            ))}
          </div>
        ) : summaries.length === 0 ? (
          /* Empty State */
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 px-6 py-16 text-center backdrop-blur-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500">
              <Inbox className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">No summaries generated yet</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-400">
              Enter any URL on the homepage to generate your first AI overview.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 hover:opacity-95"
            >
              <Sparkles className="h-4 w-4" />
              Summarize Now
            </Link>
          </div>
        ) : (
          /* Summary List */
          <div className="mt-8 flex flex-col gap-5">
            {summaries.map((summary) => (
              <HistoryCard
                key={summary.id}
                summary={summary}
                onDelete={handleDelete}
                deleting={deletingId === summary.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
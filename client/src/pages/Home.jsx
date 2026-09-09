import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { summaryApi, getErrorMessage } from "../services/api.js";
import UrlForm from "../components/UrlForm.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import { AlertCircle, Link2, FileText, Bookmark, Loader2, LogIn } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);

  async function handleSubmit(url) {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (loading) return;

    setLoading(true);
    setError("");
    setSummary(null);

    try {
      const { data } = await summaryApi.create(url);
      setSummary(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 pb-20 pt-16 text-slate-100">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Webpage Summarizer
          </h1>
          <p className="mt-3 text-base text-slate-400">
            Paste any article or document link below to extract key takeaways instantly.
          </p>
        </div>

        {/* Input Form */}
        <div className="mt-8">
          <UrlForm onSubmit={handleSubmit} loading={loading} />

          {!isAuthenticated && (
            <div className="mt-3 text-center text-xs text-slate-400">
              <span>
                Please{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-medium text-cyan-400 underline hover:text-cyan-300"
                >
                  log in
                </button>{" "}
                to summarize and save links.
              </span>
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-10 flex items-center justify-center gap-2.5 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            <span>Reading article and extracting insights...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        {/* Generated Result */}
        {summary && (
          <div className="mt-8">
            <SummaryCard summary={summary} />
          </div>
        )}

        {/* How It Works (Simple 3-Step Process) */}
        <div className="mt-20 border-t border-slate-800/80 pt-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">
            How it works
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300">
                <Link2 className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-medium text-white">1. Paste URL</h3>
              <p className="mt-1 text-xs text-slate-400">
                Provide a link to any public article, documentation, or news story.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-medium text-white">2. AI Processing</h3>
              <p className="mt-1 text-xs text-slate-400">
                Key points and core context are extracted without clutter or ads.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300">
                <Bookmark className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-medium text-white">3. Review & Save</h3>
              <p className="mt-1 text-xs text-slate-400">
                Read your summary immediately or access it later in your history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
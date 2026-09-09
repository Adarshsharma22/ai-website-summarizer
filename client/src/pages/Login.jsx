import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Sparkles, Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(form);
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      {/* Glow effect */}
      <div className="pointer-events-none absolute h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-amber-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">Log in to access your saved summaries</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-cyan-500/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-cyan-500/10"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-3 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/10 transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-cyan-400 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
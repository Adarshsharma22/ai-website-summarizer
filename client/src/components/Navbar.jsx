import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Sparkles, History, Home, LogOut, LogIn, UserPlus, Menu, X } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/login");
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-amber-500 p-0.5 shadow-lg shadow-cyan-500/20 transition-transform duration-300 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Sparkles className="h-4 w-4 text-cyan-400 transition-transform group-hover:rotate-12" />
            </div>
          </div>
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            AI Summarizer
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 sm:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive("/")
                    ? "bg-slate-800/80 text-cyan-400 border border-slate-700/60 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/40 hover:text-white"
                }`}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                to="/history"
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive("/history")
                    ? "bg-slate-800/80 text-cyan-400 border border-slate-700/60 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/40 hover:text-white"
                }`}
              >
                <History className="h-4 w-4" />
                History
              </Link>
              <div className="mx-2 h-4 w-[1px] bg-slate-800" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-sm font-medium text-slate-300 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800/50 hover:text-white"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/10 transition-all duration-200 hover:opacity-95 hover:shadow-cyan-500/25 active:scale-[0.98]"
              >
                <UserPlus className="h-4 w-4" />
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="flex items-center rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-300 hover:text-white sm:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="flex flex-col gap-1.5 border-t border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur-xl sm:hidden">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white"
              >
                <Home className="h-4 w-4 text-cyan-400" />
                Home
              </Link>
              <Link
                to="/history"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white"
              >
                <History className="h-4 w-4 text-teal-400" />
                History
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-3 py-2.5 text-sm font-semibold text-slate-950"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
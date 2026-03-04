import { useState, useRef, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Leaderboard from "./pages/Leaderboard";
import Contest from "./pages/Contest";
import About from "./pages/About";
import Exam from "./pages/Exam";
import PreviousYear from "./pages/PreviousYear";
import WakeUpScreen from "./components/WakeUpScreen";
import { ThemeProvider, useTheme, THEMES } from "./contexts/ThemeContext";

// ─── Theme Selector Dropdown ─────────────────────────────────────────────────
function ThemeSelector() {
  const { theme, switchTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200"
        style={{
          background: 'rgb(var(--gcg-accent) / 0.12)',
          border: '1px solid rgb(var(--gcg-accent) / 0.35)',
          color: 'rgb(var(--gcg-light))',
        }}
      >
        {/* Live swatches of active theme */}
        <span className="flex gap-1 items-center">
          {theme.swatches.slice(0, 3).map((c, i) => (
            <span key={i} className="w-3 h-3 rounded-full border border-white/20 transition-transform duration-300"
              style={{ background: c, transform: open ? `translateY(${i % 2 === 0 ? '-2px' : '2px'})` : 'none' }} />
          ))}
        </span>
        <span className="hidden sm:inline">{theme.name}</span>
        {/* Chevron */}
        <svg className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-2xl overflow-hidden z-[200] py-2"
          style={{
            background: 'linear-gradient(145deg, rgb(var(--gcg-dark) / 0.97), rgb(var(--gcg-mid) / 0.92))',
            border: '1px solid rgb(var(--gcg-accent) / 0.3)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 20px 60px rgb(var(--gcg-dark) / 0.8), 0 0 0 1px rgb(var(--gcg-light) / 0.04)',
          }}
        >
          {/* Header */}
          <div className="px-4 pt-1 pb-3 border-b" style={{ borderColor: 'rgb(var(--gcg-accent) / 0.15)' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgb(var(--gcg-accent))' }}>
              ✦ Choose Theme
            </p>
          </div>

          {/* Theme list */}
          <div className="py-1 max-h-[400px] overflow-y-auto">
            {THEMES.map((t) => {
              const active = t.id === theme.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { switchTheme(t.id); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 group"
                  style={active ? {
                    background: `linear-gradient(90deg, ${t.swatches[1]}22, transparent)`,
                    borderLeft: `3px solid ${t.swatches[2]}`,
                  } : { borderLeft: '3px solid transparent' }}
                >
                  {/* Swatch row */}
                  <span className="flex gap-0.5 shrink-0">
                    {t.swatches.map((c, i) => (
                      <span key={i}
                        className={`rounded-full border border-white/10 transition-all duration-200 group-hover:scale-110 ${i === 0 ? 'w-5 h-5' : 'w-4 h-4'}`}
                        style={{ background: c, transitionDelay: `${i * 30}ms` }}
                      />
                    ))}
                  </span>
                  {/* Label */}
                  <span className="flex flex-col min-w-0">
                    <span className={`text-sm font-bold truncate ${active ? '' : 'text-white/80'}`}
                      style={active ? { color: t.swatches[2] } : {}}>
                      {t.name}
                    </span>
                    <span className="text-xs truncate" style={{ color: 'rgb(var(--gcg-light) / 0.35)' }}>
                      {t.description}
                    </span>
                  </span>
                  {/* Active tick */}
                  {active && (
                    <span className="ml-auto shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: t.swatches[2], color: t.swatches[0] }}>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="px-4 pt-2 pb-1 border-t" style={{ borderColor: 'rgb(var(--gcg-accent) / 0.1)' }}>
            <p className="text-[10px]" style={{ color: 'rgb(var(--gcg-light) / 0.25)' }}>
              Theme saved to your browser
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Inner App (inside ThemeProvider) ────────────────────────────────────────
function AppInner() {
  const [mobileMenu, setMobileMenu] = useState(false);
  // Skip wake screen if server was confirmed alive within the last 10 minutes
  const [appReady, setAppReady] = useState(() => {
    const ts = localStorage.getItem('gcg-server-alive');
    if (!ts) return false;
    return (Date.now() - parseInt(ts, 10)) < 10 * 60 * 1000;
  });

  const handleServerReady = () => {
    localStorage.setItem('gcg-server-alive', Date.now().toString());
    setAppReady(true);
  };

  const links = [
    { path: "/",             label: "Home" },
    { path: "/resources",    label: "Resources" },
    { path: "/leaderboard",  label: "Leaderboard" },
    { path: "/contest",      label: "Contest" },
    { path: "/exam",         label: "Practice" },
    { path: "/previous-year",label: "Interview" },
    { path: "/about",        label: "About" },
  ];

  if (!appReady) {
    return <WakeUpScreen onReady={handleServerReady} />;
  }

  return (
    <div className="min-h-screen flex flex-col text-white relative overflow-x-hidden">

      {/* ── Ambient background orbs ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgb(var(--gcg-accent) / 0.22) 0%, transparent 65%)', animation: 'float 12s ease-in-out infinite, pulse-glow 8s ease-in-out infinite' }} />
        <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgb(var(--gcg-mid) / 0.32) 0%, transparent 65%)', animation: 'float 15s ease-in-out infinite reverse, pulse-glow 10s ease-in-out infinite' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgb(var(--gcg-light) / 0.05) 0%, transparent 65%)', animation: 'float 18s ease-in-out infinite' }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgb(var(--gcg-light) / 1) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--gcg-light) / 1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ── Content wrapper ── */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="sticky top-0 z-50 border-b"
          style={{ background: 'rgb(var(--gcg-dark) / 0.88)', backdropFilter: 'blur(20px)', borderColor: 'rgb(var(--gcg-accent) / 0.25)', boxShadow: '0 4px 30px rgb(var(--gcg-dark) / 0.5)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 gap-3">

              {/* ── Brand ── */}
              <NavLink
                to="/"
                className="text-xl font-black tracking-tight shrink-0"
                style={{ background: 'linear-gradient(90deg, rgb(var(--gcg-accent)), rgb(var(--gcg-light)), rgb(var(--gcg-accent)))', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                GLA CODING GROUP
              </NavLink>

              {/* ── Desktop nav ── */}
              <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
                {links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 group
                      ${isActive ? 'font-semibold' : ''}`
                    }
                    style={({ isActive }) => isActive
                      ? { color: 'rgb(var(--gcg-light))' }
                      : { color: 'rgba(255,255,255,0.65)' }}
                  >
                    {link.label}
                    <span className="absolute left-2 right-2 -bottom-0 h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                      style={{ background: `linear-gradient(90deg, rgb(var(--gcg-accent)), rgb(var(--gcg-light)))` }} />
                  </NavLink>
                ))}
              </div>

              {/* ── Theme selector + mobile toggle ── */}
              <div className="flex items-center gap-2 shrink-0">
                <ThemeSelector />
                <button
                  onClick={() => setMobileMenu(!mobileMenu)}
                  className="md:hidden p-2 rounded-lg transition"
                  style={{ background: 'rgb(var(--gcg-accent) / 0.15)', border: '1px solid rgb(var(--gcg-accent) / 0.3)', color: 'rgb(var(--gcg-light))' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {mobileMenu && (
              <div className="md:hidden pb-3 mt-1 rounded-xl overflow-hidden border"
                style={{ background: 'rgb(var(--gcg-dark) / 0.97)', borderColor: 'rgb(var(--gcg-accent) / 0.2)' }}>
                {links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    className="block py-2.5 px-4 text-sm font-medium transition-all"
                    style={({ isActive }) => isActive
                      ? { color: 'rgb(var(--gcg-light))', fontWeight: 600, background: 'rgb(var(--gcg-accent) / 0.1)' }
                      : { color: 'rgba(255,255,255,0.65)' }}
                    onClick={() => setMobileMenu(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <main className="flex-1 p-4 sm:p-6">
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/resources"    element={<Resources />} />
            <Route path="/leaderboard"  element={<Leaderboard />} />
            <Route path="/exam"         element={<Exam />} />
            <Route path="/previous-year" element={<PreviousYear />} />
            <Route path="/contest"      element={<Contest />} />
            <Route path="/about"        element={<About />} />
          </Routes>
        </main>

        <footer className="border-t py-6 text-center text-sm"
          style={{ background: 'rgb(var(--gcg-dark) / 0.82)', borderColor: 'rgb(var(--gcg-accent) / 0.15)', backdropFilter: 'blur(12px)' }}>
          <p style={{ color: 'rgb(var(--gcg-light) / 0.5)' }}>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold" style={{ color: 'rgb(var(--gcg-light))' }}>GLA CODING GROUP (GCG)</span>
            . All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

// ─── Root export (wraps in ThemeProvider) ────────────────────────────────────
function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;



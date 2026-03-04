import { useState, useEffect, useRef, useCallback } from "react";

// Strip the leaderboard path to get the server root (e.g. https://gcg-rqxl.onrender.com)
const API_BASE = (import.meta.env.VITE_API_URL || "https://gcg-rqxl.onrender.com/api/leaderboard")
  .replace(/\/api\/leaderboard$/, "");
// Health check is at root: GET /health

// How long a dot stays visible (ms)
const DOT_LIFETIME = 1400;
// How often a new dot spawns (ms)
const SPAWN_INTERVAL = 900;
// Colors for the dots — GCG palette shades
const DOT_COLORS = [
  "bg-[rgb(var(--gcg-accent))]",
  "bg-[rgb(var(--gcg-light))]",
  "bg-[rgb(var(--gcg-mid))]",
  "bg-[#7ab8e8]",
  "bg-[#a0d4f0]",
  "bg-[#3a6fa8]",
];

let dotIdCounter = 0;

// Fetch /health with AbortController timeout — returns true if server is alive
async function pingHealth(timeoutMs = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(`${API_BASE}/health`, { cache: "no-store", signal: ctrl.signal });
    const d = await r.json();
    return d.status === "ok";
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export default function WakeUpScreen({ onReady }) {
  const [backendReady, setBackendReady] = useState(false);
  const [dots, setDots] = useState([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showEnter, setShowEnter] = useState(false);
  const [popping, setPopping] = useState({}); // dotId -> true while pop animation
  const startTimeRef = useRef(Date.now());
  const spawnRef = useRef(null);
  const timerRef = useRef(null);
  const pollRef = useRef(null);
  const doneRef = useRef(false); // prevent double-resolve

  const markReady = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    clearInterval(pollRef.current);
    clearInterval(spawnRef.current);
    clearInterval(timerRef.current);
    setBackendReady(true);
    setShowEnter(true);
  }, []);

  // ── Backend wake-up: one long-lived request (wakes Render) + fast polling ──
  // Render queues the first request and responds once the server is alive (~30-90s).
  // The short-timeout polls catch it the moment it becomes ready.
  useEffect(() => {
    pingHealth(120_000).then(ok => { if (ok) markReady(); }); // wake request
    pollRef.current = setInterval(async () => {
      const ok = await pingHealth(6000);
      if (ok) markReady();
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [markReady]);

  // ── Elapsed timer ────────────────────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // ── Dot spawner ──────────────────────────────────────────────────────────
  const spawnDot = useCallback(() => {
    if (doneRef.current) return;
    const id = ++dotIdCounter;
    const x = 4 + Math.random() * 85; // % from left (keep away from edges)
    const y = 10 + Math.random() * 75; // % from top
    const color = DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)];
    const size = 36 + Math.floor(Math.random() * 24); // 36-60 px

    setDots((prev) => [...prev, { id, x, y, color, size }]);

    // Auto-remove after lifetime (missed!)
    setTimeout(() => {
      setDots((prev) => {
        const stillThere = prev.find((d) => d.id === id);
        if (stillThere) setMissed((m) => m + 1);
        return prev.filter((d) => d.id !== id);
      });
    }, DOT_LIFETIME);
  }, [backendReady]);

  useEffect(() => {
    spawnRef.current = setInterval(spawnDot, SPAWN_INTERVAL);
    return () => clearInterval(spawnRef.current);
  }, [spawnDot]);

  // ── Click handler ────────────────────────────────────────────────────────
  const handleClick = (id) => {
    setPopping((p) => ({ ...p, [id]: true }));
    setScore((s) => s + 1);
    setTimeout(() => {
      setDots((prev) => prev.filter((d) => d.id !== id));
      setPopping((p) => {
        const n = { ...p };
        delete n[id];
        return n;
      });
    }, 150);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-start overflow-hidden select-none" style={{ background: 'linear-gradient(160deg, rgb(var(--gcg-dark)) 0%, rgb(var(--gcg-mid)) 50%, rgb(var(--gcg-dark)) 100%)' }}>
      {/* Header */}
      <div className="w-full flex flex-col items-center pt-6 pb-2 z-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[rgb(var(--gcg-accent))] to-[rgb(var(--gcg-light))] bg-clip-text text-transparent tracking-tight">
          GLA CODING GROUP
        </h1>

        {!showEnter ? (
          <div className="mt-2 flex items-center gap-2 text-[rgb(var(--gcg-light))]/80 text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--gcg-accent))] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[rgb(var(--gcg-accent))]"></span>
            </span>
            <span>
              Server waking up&hellip; <span className="text-[rgb(var(--gcg-light))] font-semibold">{elapsed}s</span>
            </span>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2 text-[rgb(var(--gcg-light))] text-sm font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--gcg-light))] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[rgb(var(--gcg-light))]"></span>
            </span>
            Server is ready!
          </div>
        )}

        {/* Scoreboard */}
        <div className="mt-3 flex gap-6 text-xs text-[rgb(var(--gcg-light))]/50">
          <span>
            Score:{" "}
            <span className="text-[rgb(var(--gcg-light))] font-bold text-base">{score}</span>
          </span>
          <span>
            Missed:{" "}
            <span className="text-[rgb(var(--gcg-accent))]/80 font-bold text-base">{missed}</span>
          </span>
        </div>

        {!showEnter && (
          <p className="mt-1 text-[rgb(var(--gcg-accent))]/60 text-xs">
            Tap the dots while you wait!
          </p>
        )}
      </div>

      {/* Game area */}
      <div className="relative flex-1 w-full max-w-2xl">
        {dots.map((dot) => (
          <button
            key={dot.id}
            onClick={() => handleClick(dot.id)}
            style={{
              position: "absolute",
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              transform: popping[dot.id] ? "scale(1.5)" : "scale(1)",
              transition: "transform 0.12s ease",
            }}
            className={`${dot.color} rounded-full shadow-lg shadow-black/40 
                        hover:brightness-125 active:brightness-150
                        cursor-pointer border-2 border-white/20
                        animate-bounce-in`}
          />
        ))}

        {/* Dim overlay + Enter button when ready */}
        {showEnter && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm" style={{ background: 'rgb(var(--gcg-dark) /0.75)' }}>
            <div className="flex flex-col items-center gap-4 px-6 py-8 rounded-2xl border shadow-2xl"
              style={{ background: 'linear-gradient(145deg, rgb(var(--gcg-dark)), rgb(var(--gcg-mid)))', borderColor: 'rgb(var(--gcg-accent))', boxShadow: '0 0 40px rgb(var(--gcg-accent) /0.25)' }}>
              <div className="text-4xl">🎉</div>
              <p className="text-white text-lg font-semibold text-center">
                Backend is awake!
              </p>
              <p className="text-[rgb(var(--gcg-light))]/60 text-sm text-center">
                You scored <span className="text-[rgb(var(--gcg-light))] font-bold">{score}</span> points while waiting.
              </p>
              <button
                onClick={onReady}
                className="mt-2 px-8 py-3 rounded-xl font-bold text-[rgb(var(--gcg-dark))] text-lg
                           active:scale-95 transition-all duration-150
                           shadow-lg"
                style={{ background: 'linear-gradient(135deg, rgb(var(--gcg-accent)), rgb(var(--gcg-light)))', boxShadow: '0 4px 20px rgb(var(--gcg-accent) /0.4)' }}
              >
                Enter GCG →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom hint */}
      {!showEnter && (
        <p className="pb-4 text-gray-600 text-[11px]">
          Free-tier servers sleep when idle — usually ready in ~30s
        </p>
      )}
    </div>
  );
}

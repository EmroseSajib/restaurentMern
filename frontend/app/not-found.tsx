// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="relative max-w-xl rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/90 px-8 py-10 text-slate-100 shadow-[0_0_80px_rgba(15,23,42,0.9)] overflow-hidden">
        {/* Glow circles */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Code-style badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-slate-900/60 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-300/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>404 · Route not found</span>
        </div>

        {/* Big number */}
        <div className="flex items-baseline gap-3">
          <p className="text-6xl font-black leading-none text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-sky-400 bg-clip-text">
            404
          </p>
          <p className="text-sm text-slate-400">This page does not exist.</p>
        </div>

        {/* Message */}
        <p className="mt-5 text-sm text-slate-300">
          Looks like you took a wrong turn in the frontend universe. The page
          you&apos;re looking for either moved, never existed, or is still stuck
          in a Git branch.
        </p>

        {/* Helpful links */}
        <div className="mt-6 grid gap-3 text-sm md:grid-cols-2">
          <Link
            href="/"
            className="group flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-3 hover:border-emerald-400/80 hover:bg-slate-900 transition-colors"
          >
            <div>
              <p className="font-medium text-slate-100">Back to home</p>
              <p className="text-xs text-slate-400">
                Return to the main page of the site.
              </p>
            </div>
            <span className="text-lg transition-transform group-hover:translate-x-1">
              ↩
            </span>
          </Link>

          <Link
            href="/#projects"
            className="group flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/40 px-3 py-3 hover:border-cyan-400/80 hover:bg-slate-900 transition-colors"
          >
            <div>
              <p className="font-medium text-slate-100">View my projects</p>
              <p className="text-xs text-slate-400">
                Check out what I&apos;ve been building.
              </p>
            </div>
            <span className="text-lg transition-transform group-hover:-translate-x-1">
              ⭐
            </span>
          </Link>
        </div>

        {/* Small footer line */}
        <p className="mt-6 border-t border-slate-800 pt-4 text-[11px] text-slate-500">
          Tip: If you think this route should exist, double-check your URL or
          reach out to the site owner.
        </p>
      </div>
    </main>
  );
}

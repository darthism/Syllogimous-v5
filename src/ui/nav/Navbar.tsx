"use client";

import { usePathname } from "next/navigation";
import { AuthMenu } from "./AuthMenu";
import { RankMenu } from "./RankMenu";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <a
      href={href}
      onClick={(e) => {
        // Force full reload so the legacy Home app re-initializes cleanly and Supabase hydration runs.
        e.preventDefault();
        window.location.assign(href);
      }}
      className={[
        "ui-pill",
        active
          ? "shadow-[0_0_0_1px_rgba(34,211,238,0.22),0_18px_45px_-30px_rgba(34,211,238,0.45)] border-cyan-300/30 bg-cyan-500/10"
          : ""
      ].join(" ")}
    >
      {label}
    </a>
  );
}

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[4000]">
      <div className="mx-auto max-w-6xl px-3 sm:px-4">
        <div className="mt-2 sm:mt-3 rounded-3xl border border-slate-800/60 bg-slate-950/40 backdrop-blur-md shadow-[0_30px_80px_-55px_rgba(0,0,0,0.75)]">
          <div className="flex items-center justify-between gap-2 px-2 sm:px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 select-none">
                <div className="h-7 w-7 rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-400/25 via-slate-950/40 to-fuchsia-400/15 shadow-[0_18px_45px_-30px_rgba(34,211,238,0.55)]" />
                <div className="text-sm font-semibold tracking-wide bg-gradient-to-r from-slate-100 via-slate-100 to-cyan-100 bg-clip-text text-transparent">
                  SyllogimousV5
                </div>
              </div>

              <RankMenu />
              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar pr-1">
                <NavLink href="/" label="Home" />
                <NavLink href="/stats" label="Stats" />
                <NavLink href="/leaderboard" label="Leaderboard" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AuthMenu />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



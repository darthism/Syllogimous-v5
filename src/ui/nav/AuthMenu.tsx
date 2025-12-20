"use client";

import { getSupabaseClient, isSupabaseConfigured } from "@/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ProfileMenu } from "./ProfileMenu";

type Mode = "login" | "signup";

function maskEmail(email?: string | null) {
  if (!email) return null;
  return email;
}

export function AuthMenu() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const enabled = isSupabaseConfigured() && Boolean(supabase);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUserEmail(data.session?.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function submit() {
    setStatus(null);
    if (!supabase) return;
    if (!email || !password) {
      setStatus("Email and password are required.");
      return;
    }
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setStatus("Check your email to confirm your account (if required).");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setStatus(null);
        setOpen(false);
      }
    } catch (e: any) {
      setStatus(e?.message ?? "Authentication failed.");
    }
  }

  async function logout() {
    setStatus(null);
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  if (!enabled) {
    return (
      <div className="text-xs text-slate-400">
        Auth disabled (set Supabase env vars)
      </div>
    );
  }

  if (userEmail) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:block text-xs text-slate-300">
          {maskEmail(userEmail)}
        </div>
        <ProfileMenu />
        <button
          type="button"
          onClick={logout}
          className="ui-pill"
          aria-label="Log out"
          title="Log out"
        >
          <span className="inline-flex items-center gap-2">
            <i className="ci-Exit text-[18px] leading-none" aria-hidden="true" />
            <span className="hidden sm:inline">Log out</span>
          </span>
        </button>
      </div>
    );
  }

  const modal = open ? (
    <div style={{ position: "fixed", inset: 0, overflowY: "auto", zIndex: 5000 }}>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(900px 420px at 15% 0%, rgba(34,211,238,0.10), transparent 55%), radial-gradient(900px 420px at 85% 0%, rgba(168,85,247,0.09), transparent 60%), rgba(0,0,0,0.22)",
          zIndex: 0
        }}
        onClick={() => setOpen(false)}
      />
      <div
        style={{
          minHeight: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "16px",
          position: "relative",
          zIndex: 1
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "28rem",
            margin: "24px 0",
            borderRadius: "22px",
            border: "1px solid rgba(148,163,184,0.25)",
            background:
              "linear-gradient(180deg, rgba(2, 6, 23, 0.86), rgba(2, 6, 23, 0.72))",
            color: "#f1f5f9",
            boxShadow: "0 40px 100px -60px rgba(0,0,0,0.9)",
            padding: "16px"
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700 }}>
              {mode === "signup" ? "Create account" : "Log in"}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                padding: "6px 10px",
                borderRadius: "9999px",
                background: "rgba(30,41,59,0.55)",
                border: "1px solid rgba(148,163,184,0.18)",
                color: "#e2e8f0"
              }}
            >
              Close
            </button>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <div style={{ display: "grid", gap: "6px" }}>
              <label htmlFor="auth-email" style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#e2e8f0" }}>
                Email
              </label>
              <input
                id="auth-email"
                name="email"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                autoFocus
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(148,163,184,0.25)",
                  color: "#f1f5f9",
                  outline: "none"
                }}
              />
            </div>

            <div style={{ display: "grid", gap: "6px" }}>
              <label
                htmlFor="auth-password"
                style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#e2e8f0" }}
              >
                Password
              </label>
              <input
                id="auth-password"
                name="password"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(148,163,184,0.25)",
                  color: "#f1f5f9",
                  outline: "none"
                }}
              />
            </div>

            {status ? <div style={{ marginTop: "4px", fontSize: "12px", color: "#fde68a" }}>{status}</div> : null}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                style={{ fontSize: "12px", color: "#cbd5e1", background: "transparent", border: "none", padding: 0 }}
              >
                {mode === "signup" ? "Already have an account? Log in" : "New here? Sign up"}
              </button>
              <button
                type="button"
                onClick={submit}
                style={{
                  padding: "10px 14px",
                  borderRadius: "9999px",
                  background: "rgba(34, 211, 238, 0.22)",
                  border: "1px solid rgba(34, 211, 238, 0.35)",
                  color: "#e0f2fe",
                  fontSize: "14px"
                }}
              >
                {mode === "signup" ? "Sign up" : "Log in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setOpen(true);
            setStatus(null);
          }}
          className="ui-pill"
          aria-label="Sign up"
          title="Sign up"
        >
          <span className="inline-flex items-center gap-2">
            <i className="ci-User_Add text-[18px] leading-none" aria-hidden="true" />
            <span className="hidden sm:inline">Sign up</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setOpen(true);
            setStatus(null);
          }}
          className="ui-pill-primary"
          aria-label="Log in"
          title="Log in"
        >
          <span className="inline-flex items-center gap-2">
            <i className="ci-User_Circle text-[18px] leading-none" aria-hidden="true" />
            <span className="hidden sm:inline">Log in</span>
          </span>
        </button>
      </div>

      {mounted ? (open ? createPortal(modal, document.body) : null) : null}
    </div>
  );
}



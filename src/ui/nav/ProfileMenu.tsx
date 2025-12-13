"use client";

import { getSupabaseClient, isSupabaseConfigured } from "@/supabase/client";
import { useEffect, useMemo, useRef, useState } from "react";

type Profile = {
  username: string;
  avatar_path: string | null;
};

export function ProfileMenu() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const enabled = isSupabaseConfigured() && Boolean(supabase);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    void supabase.auth.getUser().then(async ({ data }) => {
      if (cancelled) return;
      const id = data.user?.id;
      if (!id) return;

      const { data: row } = await supabase
        .from("user_profiles")
        .select("username,avatar_path")
        .eq("user_id", id)
        .maybeSingle();

      if (cancelled) return;
      if (row) {
        setProfile(row as any);
        setUsername((row as any).username ?? "");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function save() {
    if (!supabase) return;
    setLoading(true);
    setStatus(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Not authenticated.");

      const fd = new FormData();
      fd.set("username", username.trim());
      const file = fileRef.current?.files?.[0];
      if (file) fd.set("avatar", file);

      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.error ?? "Profile update failed.";
        const debug = json?.debug;
        if (debug && typeof debug === "object") {
          setStatus(
            `${msg} (nudity.safe=${debug.nuditySafe}, weapon=${debug.weaponProb}, alcohol=${debug.alcoholProb}, drugs=${debug.drugsProb}, offensive=${debug.offensiveProb})`
          );
        } else {
          setStatus(msg);
        }
        return;
      }

      setProfile({ username: json.username, avatar_path: json.avatar_path ?? null });
      setStatus("Saved.");
      setOpen(false);
    } catch (e: any) {
      setStatus(e?.message ?? "Profile update failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!enabled) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setStatus(null);
          setOpen((v) => !v);
        }}
        className="ui-pill"
        aria-label="Profile"
        title="Profile"
      >
        <span className="inline-flex items-center gap-2">
          <i className="ci-User_01 text-[18px] leading-none" aria-hidden="true" />
          <span className="hidden sm:inline">Profile</span>
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[320px] z-[4500] ui-card shadow-[0_40px_100px_-60px_rgba(0,0,0,0.9)] backdrop-blur-md">
          <div className="text-sm font-semibold">Customize profile</div>
          <div className="mt-3 grid gap-3">
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-slate-200">Username</label>
              <input
                className="ui-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={profile?.username ?? "Your name"}
              />
              <div className="text-[11px] text-slate-400">
                3–20 chars, letters/numbers/underscore. Checked via SFW API. Required for leaderboards.
              </div>
            </div>

            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-slate-200">Profile picture</label>
              <input ref={fileRef} type="file" accept="image/*" className="text-xs text-slate-200" />
              <div className="text-[11px] text-slate-400">
                PNG/JPG/WebP only. Required for leaderboards.
              </div>
            </div>

            {status ? <div className="text-xs text-amber-200">{status}</div> : null}

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setOpen(false)} className="ui-pill">
                Cancel
              </button>
              <button type="button" disabled={loading} onClick={save} className="ui-pill-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}



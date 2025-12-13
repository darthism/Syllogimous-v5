import { getSupabaseAdmin, getUserIdFromAuthHeader } from "@/supabase/admin";

async function isUsernameSfw(username: string): Promise<boolean> {
  // Simple profanity check API (SFW gate). You can replace/extend this later.
  const url = `https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(username)}`;
  const res = await fetch(url, { method: "GET" });
  const text = (await res.text()).trim().toLowerCase();
  return text === "false";
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json(
      { error: "Server missing SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const userId = await getUserIdFromAuthHeader(request);
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const usernameRaw = String(form.get("username") ?? "").trim();
  const file = form.get("avatar");

  if (usernameRaw.length < 3 || usernameRaw.length > 20) {
    return Response.json({ error: "Username must be 3–20 characters." }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(usernameRaw)) {
    return Response.json({ error: "Username may only contain letters, numbers, and underscore." }, { status: 400 });
  }

  const okName = await isUsernameSfw(usernameRaw);
  if (!okName) return Response.json({ error: "Username failed SFW check." }, { status: 400 });

  // IMPORTANT: if user updates username without uploading a new avatar, preserve existing avatar_path.
  let existingAvatarPath: string | null = null;
  try {
    const { data } = await supabase
      .from("user_profiles")
      .select("avatar_path")
      .eq("user_id", userId)
      .maybeSingle();
    const p = (data as any)?.avatar_path;
    if (typeof p === "string" && p.trim().length > 0) existingAvatarPath = p.trim();
  } catch {
    // ignore
  }

  let avatarPath: string | null = existingAvatarPath;
  if (file instanceof File && file.size > 0) {
    if (file.size > 2_000_000) {
      return Response.json({ error: "Avatar too large (max 2MB)." }, { status: 400 });
    }
    if (!/^image\//.test(file.type)) {
      return Response.json({ error: "Avatar must be an image." }, { status: 400 });
    }
    // We do NOT moderate images anymore, but still block scriptable/edge formats.
    const allowed = new Set(["image/png", "image/jpeg", "image/webp"]);
    if (!allowed.has(file.type)) {
      return Response.json(
        { error: "Avatar must be PNG, JPG, or WebP (SVG/ICO not allowed)." },
        { status: 400 }
      );
    }

    // Upload to Supabase storage (fixed path, overwrite)
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    avatarPath = `${userId}/avatar.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await supabase.storage.from("avatars").upload(avatarPath, buf, {
      upsert: true,
      contentType: file.type
    } as any);
    if (upErr) {
      return Response.json({ error: `Avatar upload failed: ${upErr.message}` }, { status: 500 });
    }
  }

  // Upsert profile (enforces unique usernames via index)
  const { error: profErr } = await supabase.from("user_profiles").upsert(
    {
      user_id: userId,
      username: usernameRaw,
      avatar_path: avatarPath,
      updated_at: new Date().toISOString()
    } as any,
    { onConflict: "user_id" }
  );

  if (profErr) {
    const msg = profErr.message?.includes("user_profiles_username_lower_unique")
      ? "Username already taken."
      : profErr.message;
    return Response.json({ error: msg }, { status: 400 });
  }

  // Sync leaderboard identity fields immediately so users appear without needing another played question.
  try {
    await supabase.from("leaderboard_minutes").upsert(
      {
        user_id: userId,
        display_name: usernameRaw,
        avatar_path: avatarPath,
        updated_at: new Date().toISOString()
      } as any,
      { onConflict: "user_id" }
    );
  } catch {
    // ignore
  }

  try {
    await supabase
      .from("leaderboard_2d_gq")
      .update({ display_name: usernameRaw, avatar_path: avatarPath, updated_at: new Date().toISOString() } as any)
      .eq("user_id", userId);
  } catch {
    // ignore
  }

  return Response.json({ ok: true, username: usernameRaw, avatar_path: avatarPath }, { status: 200 });
}



export function getLocalDisplayName(): string {
  // Prefer current profile name when available.
  try {
    const profilesRaw = localStorage.getItem("sllgms-v3-profiles");
    const selectedRaw = localStorage.getItem("sllgms-v3-selected-profile");
    if (profilesRaw) {
      const profiles = JSON.parse(profilesRaw);
      const idx = selectedRaw ? Number(selectedRaw) : 0;
      const profile = Array.isArray(profiles) ? profiles[idx] : null;
      const name = profile?.name;
      if (typeof name === "string" && name.trim().length > 0) return name.trim();
    }
  } catch {
    // ignore
  }
  return "Anonymous";
}



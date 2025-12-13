"use client";

// Bridge third-party libs that legacy code expects as globals.
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import "chartjs-adapter-date-fns";
import { Delaunay } from "d3-delaunay";

import { isSupabaseConfigured } from "@/supabase/client";
import { ensureSupabaseSession } from "@/supabase/session";
import { pullKvText, pushKvText } from "@/storage/kv";

(globalThis as any).Chart = Chart;
(globalThis as any).d3 = { Delaunay };

const OLD_SETTINGS_KEY = "sllgms-v3";
const PROFILES_KEY = "sllgms-v3-profiles";
const SELECTED_PROFILE_KEY = "sllgms-v3-selected-profile";
const APP_STATE_KEY = "sllgms-v3-app-state";

// User request:
// - Problem history should remain local (appState.questions / appState.score)
// - Settings should sync to Supabase
const SYNC_KEYS = new Set<string>([OLD_SETTINGS_KEY, PROFILES_KEY, SELECTED_PROFILE_KEY, APP_STATE_KEY]);

function redactAppStateForCloud(valueText: string): string {
  try {
    const parsed = JSON.parse(valueText);
    if (parsed && typeof parsed === "object") {
      // Keep UI prefs in cloud, but do not sync per-problem history.
      if ("questions" in parsed) delete parsed.questions;
      if ("score" in parsed) delete parsed.score;
      return JSON.stringify(parsed);
    }
  } catch {
    // ignore
  }
  return valueText;
}

function mergeCloudAppStateIntoLocal(localText: string | null, cloudText: string): string {
  try {
    const cloud = JSON.parse(cloudText);
    const local = localText ? JSON.parse(localText) : {};
    if (cloud && typeof cloud === "object" && local && typeof local === "object") {
      // Preserve local problem history.
      const preservedQuestions = (local as any).questions;
      const preservedScore = (local as any).score;
      const merged = { ...local, ...cloud };
      if (preservedQuestions !== undefined) (merged as any).questions = preservedQuestions;
      if (preservedScore !== undefined) (merged as any).score = preservedScore;
      return JSON.stringify(merged);
    }
  } catch {
    // ignore
  }
  // If parsing fails, prefer local.
  return localText ?? cloudText;
}

async function hydrateLocalStorageFromCloud() {
  if (!isSupabaseConfigured()) return;
  const userId = await ensureSupabaseSession();
  if (!userId) return;

  const remote = await pullKvText(Array.from(SYNC_KEYS));
  for (const [key, valueText] of Object.entries(remote)) {
    if (valueText == null) continue;
    if (key === APP_STATE_KEY) {
      // Merge cloud settings into local appState without overwriting local history.
      const merged = mergeCloudAppStateIntoLocal(localStorage.getItem(key), valueText);
      localStorage.setItem(key, merged);
      continue;
    }
    // Settings keys: cloud is source of truth across devices.
    localStorage.setItem(key, valueText);
  }
}

function enableCloudSyncForLocalStorage() {
  if (!isSupabaseConfigured()) return;

  const proto = Storage.prototype as any;
  const originalSetItem = proto.setItem;
  const originalRemoveItem = proto.removeItem;

  proto.setItem = function patchedSetItem(key: string, value: string) {
    originalSetItem.call(this, key, value);
    // Let React UI (Navbar Rank dropdown, etc.) react to app-state updates in the same tab.
    try {
      if (this === localStorage && key === APP_STATE_KEY) {
        window.dispatchEvent(new CustomEvent("sllgms-app-state", { detail: value }));
      }
    } catch {
      // ignore
    }
    if (this === localStorage && SYNC_KEYS.has(key)) {
      if (key === APP_STATE_KEY) {
        // Sync settings portion only.
        void pushKvText(key, redactAppStateForCloud(value));
      } else {
        void pushKvText(key, value);
      }
    }
  };

  proto.removeItem = function patchedRemoveItem(key: string) {
    originalRemoveItem.call(this, key);
    if (this === localStorage && SYNC_KEYS.has(key)) {
      void pushKvText(key, null);
    }
  };
}

function bridgeLegacyThemeToHtmlClass() {
  const apply = () => {
    const isLight = document.body.classList.contains("light-mode");
    document.documentElement.classList.toggle("light", isLight);
    document.documentElement.classList.toggle("dark", !isLight);
  };

  // Initial + reactive updates whenever legacy toggles body class.
  apply();
  const observer = new MutationObserver(apply);
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
}

void (async () => {
  await hydrateLocalStorageFromCloud();
  enableCloudSyncForLocalStorage();
  bridgeLegacyThemeToHtmlClass();
  // Import the legacy app bundle (generated from the original script order).
  await import("./legacy");
})();



const STORAGE_KEYS = {
  profile: "hireforge.profile",
  analyses: "hireforge.analyses",
  wellness: "hireforge.wellness"
};

export const DEFAULT_PROFILE = {
  full_name: "",
  email: "",
  headline: "",
  phone: "",
  location: "",
  website: "",
  linkedin_url: "",
  github_username: "",
  twitter_username: "",
  summary: "",
  skills: [],
  years_of_experience: "",
  target_role: "",
  target_companies: "",
  availability: ""
};

const fallbackStorage = new Map();

const storage = typeof window === "undefined"
  ? {
      getItem: (key) => fallbackStorage.get(key) || null,
      setItem: (key, value) => fallbackStorage.set(key, value)
    }
  : window.localStorage;

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function readJson(key, fallback) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  storage.setItem(key, JSON.stringify(value));
}

function normalizeStringList(values) {
  return [...new Set((values || []).map((value) => String(value || "").trim()).filter(Boolean))];
}

function sortNewest(items, key) {
  return [...items].sort((a, b) => new Date(b[key] || 0).getTime() - new Date(a[key] || 0).getTime());
}

export async function getProfile() {
  return {
    ...DEFAULT_PROFILE,
    ...readJson(STORAGE_KEYS.profile, {})
  };
}

export async function updateProfile(updates) {
  const current = await getProfile();
  const next = {
    ...current,
    ...updates,
    skills: normalizeStringList(updates.skills ?? current.skills)
  };

  writeJson(STORAGE_KEYS.profile, next);
  return next;
}

export async function listAnalyses(_sort = "-created_date", limit = 20) {
  return sortNewest(readJson(STORAGE_KEYS.analyses, []), "created_date").slice(0, limit);
}

export async function createAnalysis(analysis) {
  const current = readJson(STORAGE_KEYS.analyses, []);
  const nextItem = {
    id: createId("analysis"),
    created_date: new Date().toISOString(),
    ...analysis
  };

  writeJson(STORAGE_KEYS.analyses, [nextItem, ...current]);
  return nextItem;
}

export async function listWellnessEntries(_sort = "-date", limit = 30) {
  return sortNewest(readJson(STORAGE_KEYS.wellness, []), "date").slice(0, limit);
}

export async function createWellnessEntry(entry) {
  const current = readJson(STORAGE_KEYS.wellness, []);
  const nextItem = {
    id: createId("wellness"),
    created_date: new Date().toISOString(),
    ...entry
  };

  writeJson(STORAGE_KEYS.wellness, [nextItem, ...current]);
  return nextItem;
}

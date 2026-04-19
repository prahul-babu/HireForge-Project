const CLIENT_ID_KEY = "hireforge.client_id";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `hireforge_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getClientId() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem(CLIENT_ID_KEY);
  if (existing) {
    return existing;
  }

  const next = createId();
  window.localStorage.setItem(CLIENT_ID_KEY, next);
  return next;
}

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function http<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts?.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw await res.json().catch(() => ({ error: res.statusText }));
  return res.json();
}

export const api = {
  register: (payload: { name: string; email: string; password: string }) =>
    http<{ token: string; user: { id: string; name: string; email: string } }>(
      "/api/auth/register",
      { method: "POST", body: JSON.stringify(payload) }
    ),
  login: (payload: { email: string; password: string }) =>
    http<{ token: string; user: { id: string; name: string; email: string } }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify(payload) }
    ),
  me: (token: string) =>
    http<{ user: { id: string; name: string; email: string } }>("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

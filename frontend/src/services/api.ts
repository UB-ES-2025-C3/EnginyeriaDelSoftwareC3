export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Tipus de dades
type UserProfile = {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  links?: {
    [key: string]: string;
  };
};

type UpdateProfilePayload = {
  name?: string;
  bio?: string;
  links?: {
    [key: string]: string;
  };
};

type MediaResponse = {
  avatarUrl?: string;
  bannerUrl?: string;
};

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


  // Obté el perfil complet de l'usuari autenticat
  getProfile: (token: string) =>
    http<UserProfile>("/api/profile/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Actualitza el perfil de l'usuari autenticat
  updateProfile: (token: string, payload: UpdateProfilePayload) =>
    http<UserProfile>("/api/profile/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    }),
    
  uploadProfileMedia: (token: string, formData: FormData) =>
    fetch(`${API_BASE}/api/profile/me/media`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw j?.error ? j : { error: res.statusText };
      }
      return res.json() as Promise<MediaResponse>;
    }),
};
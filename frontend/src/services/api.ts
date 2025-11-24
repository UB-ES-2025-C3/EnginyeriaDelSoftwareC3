import { create } from "domain";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ⭐ CAMBIO 1: User completo con avatarUrl, bio, etc.
type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  links?: {
    [key: string]: string;
  };
};

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


export interface Review {
  _id?: string
  stars: number
  text: string
  createdAt?: string
  user?: {
    _id?: string
    name?: string
    avatarUrl?: string
  }
  game?: {
    _id?: string
    name?: string
  }
}

export interface CreateReviewPayload {
  stars: number
  text: string
}

export interface CreatedReview {
  _id: string
  game: string
  stars: number
  text: string
  createdAt: string
  user: {
    _id: string
    name?: string
    avatarUrl?: string
  }
}

export interface CreateReviewResponse {
  message: string
  review: CreatedReview
}

export interface GameReviewsResponse {
  gameId: string
  reviews: Review[]
}

export type Game = {
  _id: string;
  name: string;
  genre: string;
  year: number;
  platform: string;
  image: string;
  reviews: Review[];
};

// ⭐ NUEVO: Tipo para Solicitud
export type Solicitud = {
  _id?: string;
  nombre: string;
  email: string;
  tipo: 'queja' | 'mejora' | 'comentario';
  asunto: string;
  mensaje: string;
  fecha?: Date;
  leido?: boolean;
};
export type GameSummary = {
  _id: string;
  name: string;
  genre: string;
  year: number;
  platform: string;
  image: string;
  averageRating: number;
  reviewCount: number;
};

export type PaginatedGamesResponse = {
  items: GameSummary[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  availableGenres: string[];
  availablePlatforms: string[];
};

type GameQueryParams = Partial<{
  q: string;
  sort: string;
  page: number;
  limit: number;
  genres: string[];
  platforms: string[];
}>;

const buildQueryString = (params?: GameQueryParams) => {
  if (!params) return '';
  const query = new URLSearchParams();

  if (params.q) query.set('q', params.q);
  if (params.sort) query.set('sort', params.sort);
  if (typeof params.page === 'number') query.set('page', String(params.page));
  if (typeof params.limit === 'number') query.set('limit', String(params.limit));
  if (params.genres && params.genres.length) query.set('genres', params.genres.join(','));
  if (params.platforms && params.platforms.length) query.set('platforms', params.platforms.join(','));

  const qs = query.toString();
  return qs ? `?${qs}` : '';
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
  // ⭐ CAMBIO 2: register y login ahora retornan User completo
  register: (payload: { name: string; email: string; password: string }) =>
    http<{ token: string; user: User }>( // Cambiado el tipo de retorno
      "/api/auth/register",
      { method: "POST", body: JSON.stringify(payload) }
    ),
    
  login: (payload: { email: string; password: string }) =>
    http<{ token: string; user: User }>( // Cambiado el tipo de retorno
      "/api/auth/login",
      { method: "POST", body: JSON.stringify(payload) }
    ),
    
  // ⭐ CAMBIO 3: /me ahora retorna User completo
  me: (token: string) =>
    http<{ user: User }>("/api/auth/me", { // Cambiado el tipo de retorno
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Obtenir el perfil complet de l'usuari autenticat
  getProfile: (token: string) =>
    http<UserProfile>("/api/profile/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Actualitzar el perfil de l'usuari autenticat
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

  // Jocs
  getGames: (params?: GameQueryParams) =>
    http<PaginatedGamesResponse>(`/api/games${buildQueryString(params)}`),
  getGame:  (id: string) => http<Game>(`/api/games/${id}`),

  // Ressenyes
  getAllReviews: () => http<Review[]>("/api/reviews"),

  createReview: (token: string, gameId: string, payload: CreateReviewPayload) =>
    http<CreateReviewResponse>(`/api/reviews/${gameId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }),

  getGameReviews: (gameId: string) => http<GameReviewsResponse>(`/api/games/${gameId}/reviews`),
};
  // ⭐ NUEVO: Solicitudes (Contacto)
  createSolicitud: (payload: Omit<Solicitud, '_id' | 'fecha' | 'leido'>) =>
    http<{ success: boolean; message: string; data: Solicitud }>("/api/solicitudes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // ⭐ NUEVO: Crear solicitud con archivos (FormData)
  createSolicitudWithFiles: async (formData: FormData) => {
    const res = await fetch(`${API_BASE}/api/solicitudes`, {
      method: 'POST',
      body: formData, // No incluir Content-Type, el navegador lo establece automáticamente con boundary
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      throw error;
    }
    return res.json() as Promise<{ success: boolean; message: string; data: Solicitud }>;
  },

  // Métodos opcionales para admin (si quieres ver las solicitudes)
  getSolicitudes: (token?: string) =>
    http<{ success: boolean; count: number; data: Solicitud[] }>("/api/solicitudes", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  getSolicitud: (id: string, token?: string) =>
    http<{ success: boolean; data: Solicitud }>(`/api/solicitudes/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  markSolicitudAsRead: (id: string, token: string) =>
    http<{ success: boolean; message: string; data: Solicitud }>(`/api/solicitudes/${id}/leido`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    }),

  deleteSolicitud: (id: string, token: string) =>
    http<{ success: boolean; message: string }>(`/api/solicitudes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};

import { reactive } from "vue";
import { api } from "./api";

// ⭐ Tipo User completo con todos los campos
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

const state = reactive<{ token: string | null; user: User | null }>({
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
});

export const auth = {
  state,
  
  // Inicializar auth al cargar la app
  async init() {
    if (state.token) {
      try {
        const { user } = await api.me(state.token);
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user));
      } catch {
        // Si falla, limpiar todo
        auth.logout();
      }
    }
  },
  
  async register(data: { name: string; email: string; password: string }) {
    const res = await api.register(data);
    state.token = res.token;
    state.user = res.user;
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    return res.user;
  },
  
  async login(data: { email: string; password: string }) {
    const res = await api.login(data);
    state.token = res.token;
    state.user = res.user;
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    return res.user;
  },
  
  // Método para actualizar el usuario (cuando se actualiza el perfil)
  updateUser(userData: Partial<User>) {
    if (state.user) {
      state.user = { ...state.user, ...userData };
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  },
  
  // ⭐ LOGOUT CORREGIDO - Limpia COMPLETAMENTE la sesión
  logout() {
    // Limpiar el estado reactivo
    state.token = null;
    state.user = null;
    
    // Limpiar localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // ⭐ EXTRA: Limpiar TODA la memoria de sesión
    localStorage.clear();
    sessionStorage.clear();
    
    // Forzar limpieza del estado reactivo
    Object.assign(state, { token: null, user: null });
  },
};
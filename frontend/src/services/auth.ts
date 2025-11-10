import { reactive } from "vue";
import { api } from "./api";

// ⭐ CAMBIO 1: Tipo User completo con todos los campos
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
  user: JSON.parse(localStorage.getItem("user") || "null"), // ⭐ CAMBIO 2: Cargar usuario del localStorage
});

export const auth = {
  state,
  
  // ⭐ CAMBIO 3: Inicializar auth al cargar la app
  async init() {
    if (state.token) {
      try {
        const { user } = await api.me(state.token);
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user)); // Guardar en localStorage
      } catch {
        auth.logout();
      }
    }
  },
  
  async register(data: { name: string; email: string; password: string }) {
    const res = await api.register(data);
    state.token = res.token;
    state.user = res.user;
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user)); // ⭐ CAMBIO 4: Guardar usuario
    return res.user;
  },
  
  async login(data: { email: string; password: string }) {
    const res = await api.login(data);
    state.token = res.token;
    state.user = res.user;
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user)); // ⭐ CAMBIO 5: Guardar usuario
    return res.user;
  },
  
  // ⭐ CAMBIO 6: Método para actualizar el usuario (cuando se actualiza el perfil)
  updateUser(userData: Partial<User>) {
    if (state.user) {
      state.user = { ...state.user, ...userData };
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  },
  
  logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ⭐ CAMBIO 7: Limpiar usuario del localStorage
  },
};
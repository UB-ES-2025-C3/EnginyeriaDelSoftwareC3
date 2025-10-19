import { reactive } from "vue";
import { api } from "./api";

type User = { id: string; name: string; email: string };

const state = reactive<{ token: string | null; user: User | null }>({
  token: localStorage.getItem("token"),
  user: null,
});

export const auth = {
  state,
  async init() {
    if (state.token) {
      try {
        const { user } = await api.me(state.token);
        state.user = user;
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
    return res.user;
  },
  async login(data: { email: string; password: string }) {
    const res = await api.login(data);
    state.token = res.token;
    state.user = res.user;
    localStorage.setItem("token", res.token);
    return res.user;
  },
  logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem("token");
  },
};

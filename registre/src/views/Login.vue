<template>
  <form class="form" @submit.prevent="submit">
    <h2>Iniciar sesión</h2>

    <label>
      Email
      <input v-model="email" type="email" placeholder="tucorreo@mail.com" required />
    </label>

    <label>
      Contraseña
      <div class="pass">
        <input
          :type="showPass ? 'text' : 'password'"
          v-model="password"
          placeholder="Tu contraseña"
          required
        />
        <button type="button" class="toggle" @click="showPass = !showPass">
          {{ showPass ? 'Ocultar' : 'Ver' }}
        </button>
      </div>
    </label>

    <button :disabled="loading">{{ loading ? 'Entrando...' : 'Entrar' }}</button>

    <p v-if="error" class="err">{{ error }}</p>

    <p class="hint">
      ¿No tienes cuenta?
      <router-link to="/register">Regístrate</router-link>
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { auth } from '@/services/auth'; // ⚠️ Ajusta el import si es necesario
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');
const showPass = ref(false);

const loading = ref(false);
const error = ref<string | null>(null);

async function submit() {
  error.value = null;
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value });
    // router.push('/') // opcional: redirigir a home
    // TEMPORAL: Redirigir a la nova pàgina de perfil
    // TODO: Temporal. Canviar per '/' o '/dashboard' quan estigui llest
    router.push('/perfil');
  } catch (e: any) {
    error.value = e?.error || 'Error iniciando sesión';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.form { max-width: 380px; margin: 2rem auto; display: grid; gap: .75rem; }
label { display: grid; gap: .35rem; font-size: .95rem; }
input { padding: .7rem .8rem; border: 1px solid #ddd; border-radius: .5rem; }
button { padding: .75rem 1rem; border: 0; border-radius: .5rem; cursor: pointer; }
button[disabled]{ opacity:.6; cursor:not-allowed; }
.err { color: #c62828; }
.hint { font-size: .9rem; }
.pass { display: grid; grid-template-columns: 1fr auto; align-items: center; gap:.5rem; }
.toggle { border: 1px solid #ddd; background: #f7f7f7; border-radius: .5rem; padding: .5rem .7rem; }
</style>

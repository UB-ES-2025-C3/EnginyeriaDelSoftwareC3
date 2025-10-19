<template>
  <form class="form" @submit.prevent="submit">
    <h2>Crear cuenta</h2>

    <label>
      Nombre
      <input v-model="name" type="text" placeholder="Tu nombre" required />
    </label>

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
          placeholder="Mínimo 8 caracteres (Aa0...)"
          required
        />
        <button type="button" class="toggle" @click="showPass = !showPass">
          {{ showPass ? 'Ocultar' : 'Ver' }}
        </button>
      </div>
    </label>

    <button :disabled="loading">{{ loading ? 'Creando...' : 'Registrarme' }}</button>

    <p v-if="error" class="err">{{ error }}</p>
    <p v-if="ok" class="ok">¡Registro correcto!</p>

    <p class="hint">
      ¿Ya tienes cuenta?
      <router-link to="/login">Inicia sesión</router-link>
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { auth } from '@/services/auth'; // ⚠️ Ajusta el import si tu alias no es @/src

const name = ref('');
const email = ref('');
const password = ref('');
const showPass = ref(false);

const loading = ref(false);
const error = ref<string | null>(null);
const ok = ref(false);

async function submit() {
  error.value = null;
  ok.value = false;
  loading.value = true;
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value });
    ok.value = true;
    // Opcional: redirige a inicio
    // useRouter().push('/')
  } catch (e: any) {
    error.value = e?.error || 'Error registrando';
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
.ok { color: #2e7d32; }
.hint { font-size: .9rem; }
.pass { display: grid; grid-template-columns: 1fr auto; align-items: center; gap:.5rem; }
.toggle { border: 1px solid #ddd; background: #f7f7f7; border-radius: .5rem; padding: .5rem .7rem; }
</style>

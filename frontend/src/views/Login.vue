<template>
  <section
    class="min-h-screen flex items-center justify-center text-white px-4 sm:px-6 py-12 relative overflow-hidden"
    style="background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%), linear-gradient(to bottom, #18181b, #000);"
  >
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="mb-8 text-center">
        <p class="text-sm md:text-base text-white font-bold uppercase tracking-wide mb-2">
          Checkpoint
        </p>
        <h2 class="text-4xl md:text-5xl font-extrabold mb-2">Iniciar sessió</h2>
        <p class="text-gray-400 text-sm">Benvingut de nou al teu espai gamer</p>
      </div>

      <form @submit.prevent="submit" class="space-y-6">
        <!-- Email Input -->
        <label class="block space-y-2">
          <span class="text-sm font-semibold text-gray-300 uppercase tracking-wide">Email</span>
          <input
            v-model="email"
            type="email"
            placeholder="tucorreo@mail.com"
            required
            class="w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-all"
          />
        </label>

        <!-- Password Input -->
        <label class="block space-y-2">
          <span class="text-sm font-semibold text-gray-300 uppercase tracking-wide">Contrasenya</span>
          <div class="relative">
            <input
              :type="showPass ? 'text' : 'password'"
              v-model="password"
              placeholder="La teva contrasenya"
              required
              class="w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-all pr-24"
            />
            <button
              type="button"
              @click="showPass = !showPass"
              class="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs border border-gray-600 rounded-lg hover:bg-gray-800 transition-all font-semibold uppercase tracking-wide"
            >
              {{ showPass ? 'Ocultar' : 'Veure' }}
            </button>
          </div>
        </label>

        <!-- Submit Button -->
        <button
          :disabled="loading"
          class="w-full px-8 py-4 text-base border-2 border-gray-600 rounded-xl hover:bg-gray-800 transition-all font-semibold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Entrant...' : 'Entrar' }}
        </button>

        <!-- Error Message -->
        <p v-if="error" class="text-red-400 text-sm text-center bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
          {{ error }}
        </p>

        <!-- Register Link -->
        <p class="text-center text-gray-400 text-sm">
          No tens compte?
          <router-link to="/register" class="text-white hover:text-gray-300 font-semibold underline transition-colors">
            Registra't
          </router-link>
        </p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { auth } from '@/services/auth';
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
    router.push('/cataleg');
  } catch (e: any) {
    error.value = e?.error || 'Error iniciant sessió';
  } finally {
    loading.value = false;
  }
}
</script>
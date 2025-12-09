<template>
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-black to-slate-950 text-white px-6 py-12">
    <div class="w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md p-8 space-y-6">
      <div class="space-y-2">
        <p class="text-sm uppercase tracking-[0.2em] text-slate-300">Deployment check</p>
        <h1 class="text-3xl font-bold">Test deployment</h1>
        <p class="text-slate-300">
          Use this page to confirm the frontend can reach the latest backend deployment.
        </p>
      </div>

      <div class="space-y-3">
        <button
          class="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
          @click="pingBackend"
        >
          {{ loading ? 'Contacting backend...' : 'Ping backend' }}
        </button>

        <p v-if="result" class="text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 rounded-lg">
          {{ result }}
          <span v-if="environment" class="block text-sm text-emerald-200/80 mt-1">
            Environment: {{ environment }}
          </span>
        </p>

        <p v-if="error" class="text-red-300 bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-lg">
          {{ error }}
        </p>
      </div>

      <p class="text-sm text-slate-400">
        You can remove this page after verifying the deployment.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/services/api';

const loading = ref(false);
const result = ref<string | null>(null);
const error = ref<string | null>(null);
const environment = ref<string | undefined>();

const pingBackend = async () => {
  loading.value = true;
  result.value = null;
  error.value = null;

  try {
    const response = await api.ping();
    result.value = response.message;
    environment.value = response.environment;
  } catch (err: unknown) {
    const message = typeof err === 'object' && err !== null && 'error' in err
      ? (err as { error?: string }).error
      : 'No hem pogut contactar amb el backend';
    error.value = message || 'Error desconegut';
  } finally {
    loading.value = false;
  }
};
</script>

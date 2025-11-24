<template>
  <div class="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Ressenyes</h1>
      <p class="text-gray-400 text-sm">
        Obre la consola del navegador per veure totes les ressenyes carregades.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { api } from '@/services/api'

onMounted(async () => {
  try {
    const reviews = await api.getAllReviews()
    console.log('TOTES LES RESSENYES:', reviews)
  } catch (err) {
    console.error('Error carregant les ressenyes:', err)
  }
})
</script>

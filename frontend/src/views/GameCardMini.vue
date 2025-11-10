<!-- src/views/GameCardMini.vue -->
<template>
  <router-link
    :to="`/game/${id}`"
    class="relative group cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl block"
  >
    <!-- Imagen del juego -->
    <div class="relative aspect-[3/4] overflow-hidden bg-gray-900">
      <img 
        :src="image" 
        :alt="name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      <!-- Overlay con información al hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        <div class="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <h3 class="font-bold text-white text-base leading-tight line-clamp-2">{{ name }}</h3>
          <div class="flex items-center gap-2 text-xs text-gray-300">
            <span>{{ genre }}</span>
            <span>•</span>
            <span>{{ year }}</span>
          </div>
          
          <!-- Rating con estrellas si hay reviews -->
          <div v-if="reviews && reviews.length > 0" class="flex items-center gap-1">
            <span class="text-yellow-400">⭐</span>
            <span class="text-sm font-semibold text-white">{{ averageRating }}</span>
            <span class="text-xs text-gray-400">({{ reviews.length }})</span>
          </div>
          
          <div v-else class="text-xs text-gray-400">
            Sense ressenyes encara 
          </div>
          
          <!-- Platform -->
          <div class="text-xs text-gray-300">
            <span class="bg-gray-700 px-2 py-1 rounded">{{ platform }}</span>
          </div>
        </div>
      </div>

      <!-- Indicador de reviews siempre visible (arriba a la derecha) -->
      <div v-if="reviews && reviews.length > 0" class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
        <span>⭐</span>
        <span>{{ averageRating }}</span>
      </div>
    </div>

    <!-- Título siempre visible (abajo) -->
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 group-hover:opacity-0 transition-opacity duration-300">
      <h3 class="text-white font-semibold text-sm truncate">{{ name }}</h3>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: { type: [String, Number], required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  genre: { type: String, default: '' },
  year: { type: [String, Number], default: '' },
  platform: { type: String, default: '' },
  reviews: { type: Array, default: () => [] }
})

// Calcular el rating promedio
const averageRating = computed(() => {
  if (!props.reviews || props.reviews.length === 0) return 0
  
  const sum = props.reviews.reduce((acc, review) => acc + (review.stars || 0), 0)
  const avg = sum / props.reviews.length
  return avg.toFixed(1)
})
</script>
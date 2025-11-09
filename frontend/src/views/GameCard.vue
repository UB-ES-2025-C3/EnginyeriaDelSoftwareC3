<!-- src/views/GameCard.vue -->
<template>
  <!-- Contenedor de página con fondo y centrado -->
  <div class="min-h-screen bg-linear-to-t from-gray-900 to-black flex items-center justify-center py-12 px-4">
    <div class="relative w-full max-w-md mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl">
      <!-- Imagen del juego -->
      <div class="relative h-64">
        <img :src="image" :alt="name" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent"></div>
      </div>

      <!-- Información principal -->
      <div class="absolute -mt-12 left-0 right-0 p-6 text-white">
        <h2 class="text-3xl font-bold tracking-wider drop-shadow-2xl">{{ name }}</h2>
        <p class="mt-2 text-sm opacity-90">{{ genre }} · {{ year }} · {{ platform }}</p>

        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Pròximament"
          class="text-sm mt-2 inline-block bg-purple-600 text-white font-bold py-1 px-2 rounded-full shadow-lg transition sm:py-2 sm:px-3 sm:text-sm sm:shadow-lg opacity-60 cursor-not-allowed"
        >
          Visualitza detalls
        </button>
      </div>

      <!-- Ressenyes -->
      <div class="mt-4 p-6 text-white">
        <h3 class="text-xl font-bold mt-10 mb-4">Ressenyes recents</h3>
        <div v-if="reviews.length === 0" class="text-sm text-gray-400">
          Encara no hi ha ressenyes.
        </div>
        <div v-else v-for="(review, i) in reviews" :key="i" class="flex items-start gap-3 mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-1">
              <Star v-for="n in review.stars" :key="`full-${i}-${n}`" class="w-3 h-3 fill-yellow-400" />
              <Star v-for="n in (5 - review.stars)" :key="`empty-${i}-${n}`" class="w-3 h-3 fill-gray-600" />
            </div>
            <p class="mt-1 text-sm leading-relaxed">{{ review.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/api'
import Star from '@/components/icons/Star.vue'

// Prop opcional (id)
const props = defineProps({
  id: { type: [String, Number], required: false }
})

// Datos del juego
const image = ref('')
const name = ref('')
const genre = ref('')
const year = ref(0)
const platform = ref('')
const reviews = ref([])

const route = useRoute()
const gameId = ref(String(props.id ?? route.params.id ?? ''))

async function loadGame() {
  try {
    const g = await api.getGame(gameId.value)
    image.value = g.image
    name.value = g.name
    genre.value = g.genre
    year.value = Number(g.year)
    platform.value = g.platform
    reviews.value = g.reviews || []
  } catch (e) {
    console.error('Error carregant joc:', e)
  }
}

onMounted(loadGame)
watch(() => route.params.id, v => {
  gameId.value = String(v ?? '')
  loadGame()
})
</script>

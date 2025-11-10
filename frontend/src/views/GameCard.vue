<!-- src/views/GameCard.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-t from-gray-900 to-black text-white">
    <header class="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg">
      <div class="w-full px-6 py-4">
        <div class="flex items-center gap-6">
          <!-- Logo y navegación principal -->
          <div class="flex items-center gap-8 flex-shrink-0">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 flex items-center justify-center">
                <img src="../assets/staticlogo.png" alt="Home" class="w-5 h-auto" />
              </div>
              <span class="font-bold text-xl hidden sm:block">CheckPoint</span>
            </div>
            
            <nav class="hidden md:flex items-center gap-6">
              <button class="text-gray-300 hover:text-white transition-colors font-medium">
                Home
              </button>
              <button class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium">
                <span class="text-sm">👥</span>
                Comunidad
              </button>
              <button class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium">
                <span class="text-sm">❓</span>
                Soporte
              </button>
            </nav>
          </div>

          <!-- Buscador -->
          <div class="flex-1 relative">
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input 
                type="text"
                placeholder="Buscar juegos..."
                v-model="searchQuery"
                @input="handleSearch"
                @focus="showSearchDropdown = searchQuery.length > 0"
                @blur="hideDropdown"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Dropdown de búsqueda -->
            <div 
              v-if="showSearchDropdown && filteredGames.length > 0"
              class="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto"
            >
              <router-link
                v-for="game in filteredGames"
                :key="game.id"
                :to="`/game/${game.id}`"
                class="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                @click="closeDropdown"
              >
                <img 
                  :src="game.image" 
                  :alt="game.name"
                  class="w-12 h-16 object-cover rounded"
                />
                <div class="flex-1">
                  <p class="font-semibold text-white">{{ game.name }}</p>
                  <p class="text-xs text-gray-400">{{ game.genre }} • {{ game.year }}</p>
                </div>
              </router-link>
            </div>

            <!-- Mensaje cuando no hay resultados -->
            <div 
              v-if="showSearchDropdown && searchQuery && filteredGames.length === 0"
              class="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 text-center text-gray-400"
            >
              No se encontraron juegos
            </div>
          </div>

          <!-- User actions -->
          <div class="flex items-center gap-3 flex-shrink-0">
            <button class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
              <span class="text-xl">👤</span>
            </button>
            <button class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
              <span class="text-xl">⚙️</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    <div class="max-w-5xl mx-auto px-4 py-12">
      <div class="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
        <!-- Imagen del juego (banner) -->
        <div class="relative w-full h-64 md:h-96">
          <img :src="image" :alt="name" class="w-full h-full object-cover object-center" />
          <!-- overlay oscuro para legibilidad -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        </div>

        <!-- Información principal (sobre la imagen) -->
        <div class="relative -mt-16 px-6 pb-6">
          <div class="bg-gradient-to-r from-black/50 via-black/40 to-transparent rounded-2xl p-6 shadow-lg backdrop-blur-sm border border-gray-800">
            <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{{ name }}</h2>
            <p class="text-sm text-gray-300 mb-4">{{ genre }} · {{ year }} · {{ platform }}</p>

            <div class="flex items-center gap-4">
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Próximamente"
                class="text-sm inline-block bg-purple-600 text-white font-semibold py-2 px-3 rounded-full shadow-md opacity-70 cursor-not-allowed"
              >
                Visualitza detalls
              </button>

              <div class="flex items-center gap-2 text-sm text-gray-300">
                <span class="font-semibold text-white">{{ reviews.length }} reseñas</span>
                <span class="text-gray-500">•</span>
                <div class="flex items-center gap-1">
                  <template v-if="reviews && reviews.length">
                    <Star v-for="n in Math.round(avgRating)" :key="`star-${n}`" class="w-4 h-4 fill-yellow-400" />
                    <Star v-for="n in (5 - Math.round(avgRating))" :key="`star-empty-${n}`" class="w-4 h-4 fill-gray-600" />
                    <span class="text-gray-400 ml-2">{{ avgRating.toFixed(1) }}</span>
                  </template>
                  <template v-else>
                    <span class="text-gray-500">Sin reseñas</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reseñas (contenido principal bajo la tarjeta) -->
        <div class="px-6 pb-8 pt-6">
          <h3 class="text-xl font-bold mb-4">Reseñas recientes</h3>

          <div v-if="reviews.length === 0" class="text-sm text-gray-400">
            Aún no hay reseñas.
          </div>

          <div v-else class="space-y-4">
            <div v-for="(review, i) in reviews" :key="i" class="flex items-start gap-4 bg-gray-800/60 p-4 rounded-lg border border-gray-800">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-white">
                  {{ (review.user && review.user[0]) || 'U' }}
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1">
                      <Star v-for="n in review.stars" :key="`rfull-${i}-${n}`" class="w-4 h-4 fill-yellow-400" />
                      <Star v-for="n in (5 - review.stars)" :key="`rempty-${i}-${n}`" class="w-4 h-4 fill-gray-600" />
                    </div>
                    <span class="text-sm text-gray-300 font-semibold">{{ review.title || 'Reseña' }}</span>
                  </div>
                  <span class="text-xs text-gray-400">{{ review.date || '' }}</span>
                </div>
                <p class="mt-2 text-sm text-gray-300 leading-relaxed">{{ review.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <footer class="bg-gray-900 border-t border-gray-800 mt-20">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="font-bold text-lg mb-4">GameHub</h3>
            <p class="text-gray-400 text-sm">
              Tu plataforma de confianza para descubrir, valorar y compartir tus juegos favoritos.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Explorar</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Catálogo</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Novedades</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Más valorados</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Próximos lanzamientos</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Comunidad</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Foros</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Reviews</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Eventos</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Discord</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Soporte</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Centro de ayuda</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Política de privacidad</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Términos de uso</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 GameHub. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div> 
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/api'
import Star from '@/components/icons/Star.vue'

const props = defineProps({
  id: { type: [String, Number], required: false }
})

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
    window.scrollTo({ top: 0, behavior: 'auto' })
  } catch (e) {
    console.error('Error carregant joc:', e)
  }
}

onMounted(loadGame)
watch(() => route.params.id, v => {
  gameId.value = String(v ?? '')
  loadGame()
})

const avgRating = computed(() => {
  if (!reviews.value || reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, r) => acc + (r.stars || 0), 0)
  return sum / reviews.value.length
})
</script>

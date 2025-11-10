<!-- src/views/Cataleg.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
    <!-- Header / Navigation -->
    <header class="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg">
      <div class="w-full px-6 py-4">
        <div class="grid grid-cols-3 items-center gap-4">
          <!-- IZQUIERDA: Logo y navegación -->
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 flex items-center justify-center">
                <img src="../assets/staticlogo.png" alt="Home" class="w-5 h-auto" />
              </div>
              <span class="font-bold text-xl hidden sm:block">CheckPoint</span>
            </div>
            
            <nav class="hidden lg:flex items-center gap-6">
              <button class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium whitespace-nowrap">
                <span class="text-sm">👥</span>
                Comunitat
              </button>
              <button class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium whitespace-nowrap">
                <span class="text-sm">❓</span>
                Suport
              </button>
            </nav>
          </div>

          <!-- CENTRO: Buscador MÁS GRANDE -->
          <div class="relative">
            <div class="relative max-w-lg mx-auto">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input 
                type="text"
                placeholder="Buscar jocs..."
                v-model="searchQuery"
                @input="handleSearch"
                @focus="showSearchDropdown = searchQuery.length > 0"
                @blur="hideDropdown"
                class="w-full bg-gray-800 border border-gray-700 rounded-full pl-12 pr-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-gray-750"
              />
            </div>

            <!-- Dropdown de búsqueda -->
            <div 
              v-if="showSearchDropdown && filteredGames.length > 0"
              class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto"
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
              class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 text-center text-gray-400"
            >
              No s'han trobat jocs.
            </div>
          </div>

          <!-- DERECHA: User actions -->
          <div class="flex items-center justify-end gap-4">
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

<!-- Hero Section -->
  <div class="relative h-[280px] md:h-[320px] overflow-hidden">
    <img 
      src="../assets/background_image.jpg"
      alt="Hero"
      class="w-full h-full object-cover object-center scale-105"
      style="object-position: center 60%;"
    />

    <!-- Overlay con efecto moderno -->
    <div class="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900" />
    
    <!-- Efecto de spotlight desde arriba -->
    <div class="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />

    <!-- Contenido centrado -->
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
      <div class="space-y-3 max-w-3xl">
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white">
          Catàleg de Jocs
        </h1>
        <p class="text-base md:text-lg text-gray-300 font-medium">
          Descobreix i valora els millors títols de la comunitat
        </p>
      </div>
    </div>

    <!-- Línea inferior decorativa -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
  </div>



    <!-- Catàleg de jocs -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="mb-8">
        <h2 class="text-3xl font-bold mb-2">Jocs Destacats</h2>
        <p class="text-gray-400">Explora la nostra selecció de títols populars</p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-20">
        <p class="text-gray-400 text-lg">Carregant jocs...</p>
      </div>

      <!-- Grid de juegos -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <GameCardMini 
          v-for="game in games" 
          :key="game.id"
          :id="game.id"
          :image="game.image"
          :name="game.name"
          :genre="game.genre"
          :year="game.year"
          :platform="game.platform"
          :reviews="game.reviews"
        />
      </div>

      <!-- Mensaje si no hay juegos -->
      <div v-if="!loading && games.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg">No s'han trobat jocs. Torna aviat!</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 border-t border-gray-800 mt-20">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="font-bold text-lg mb-4">CheckPoint</h3>
            <p class="text-gray-400 text-sm">
              La teva plataforma de confiança per descobrir, valorar i compartir els teus jocs favorits.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Explorar</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Catàleg</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Novetats</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Més valorats</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Pròxims llançaments</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Comunitat</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Foros</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Reviews</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Esdeveniments</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Discord</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Suport</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Centre d'ajuda</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Contacte</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Política de privacitat</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Termes d'ús</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 CheckPoint. Tots els drets reservats.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import GameCardMini from '@/views/GameCardMini.vue'
import { api } from '@/services/api'

// Estados
const games = ref([])
const loading = ref(true)
const searchQuery = ref('')
const showSearchDropdown = ref(false)

// Computed para filtrar juegos
const filteredGames = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return games.value.filter(game => 
    game.name.toLowerCase().includes(query) ||
    game.genre.toLowerCase().includes(query) ||
    game.platform.toLowerCase().includes(query)
  ).slice(0, 5) // Limitar a 5 resultados
})

// Funciones
const handleSearch = () => {
  showSearchDropdown.value = searchQuery.value.length > 0
}

const hideDropdown = () => {
  // Delay para permitir el click en el resultado
  setTimeout(() => {
    showSearchDropdown.value = false
  }, 200)
}

const closeDropdown = () => {
  showSearchDropdown.value = false
  searchQuery.value = ''
}

// Cargar juegos al montar el componente
onMounted(async () => {
  try {
    loading.value = true
    const data = await api.getGames()
    console.log('Jocs obtinguts del backend:', data)

    // Adaptar el formato del backend al del component
    games.value = data.map(g => ({
      id: g._id,
      image: g.image,
      name: g.name,
      genre: g.genre,
      year: Number(g.year),
      platform: g.platform,
      reviews: g.reviews || []
    }))
  } catch (err) {
    console.error('Error carregant jocs del backend:', err)
  } finally {
    loading.value = false
  }
})
</script>
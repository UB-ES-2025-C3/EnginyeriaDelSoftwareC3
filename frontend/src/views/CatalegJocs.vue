<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
    <!-- Header / Navigation -->
    <header class="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg">
      <div class="w-full px-6 py-4">
        <div class="grid grid-cols-3 items-center gap-4">
          <!-- IZQUIERDA: Logo y navegación -->
          <div class="flex items-center gap-6">
            <router-link to="/cataleg" class="flex items-center gap-2">
              <div class="w-8 h-8 flex items-center justify-center">
                <img src="../assets/staticlogo.png" alt="Home" class="w-5 h-auto" />
              </div>
              <span class="font-bold text-xl hidden sm:block">CheckPoint</span>
            </router-link>
            
            <nav class="hidden lg:flex items-center gap-6">
              <button class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium whitespace-nowrap">
                <span class="text-sm">👥</span> Comunitat
              </button>
              <button class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium whitespace-nowrap">
                <span class="text-sm">❓</span> Suport
              </button>
            </nav>
          </div>

          <!-- CENTRO: Buscador -->
          <div class="relative">
            <div class="relative max-w-lg mx-auto">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input type="text" placeholder="Buscar jocs..." v-model="searchQuery" @input="handleSearch" @focus="showSearchDropdown = searchQuery.length > 0" @blur="hideDropdown" class="w-full bg-gray-800 border border-gray-700 rounded-full pl-12 pr-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-gray-750" />
            </div>

            <!-- Dropdown de búsqueda -->
            <div v-if="showSearchDropdown && filteredGames.length > 0" class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
              <router-link v-for="game in filteredGames" :key="game.id" :to="`/game/${game.id}`" class="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors" @click="closeDropdown">
                <img :src="game.image" :alt="game.name" class="w-12 h-16 object-cover rounded" />
                <div class="flex-1">
                  <p class="font-semibold text-white">{{ game.name }}</p>
                  <p class="text-xs text-gray-400">{{ game.genre }} • {{ game.year }}</p>
                </div>
              </router-link>
            </div>

            <!-- Mensaje cuando no hay resultados -->
            <div v-if="showSearchDropdown && searchQuery && filteredGames.length === 0" class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 text-center text-gray-400 z-50">
              No s'han trobat jocs.
            </div>
          </div>

          <!-- DERECHA: User actions -->
          <div class="flex items-center justify-end gap-4">
            <!-- ⭐ AVATAR DEL USUARIO -->
            <router-link v-if="isLoggedIn" to="/perfil" class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors overflow-hidden border-2 border-gray-700 hover:border-purple-500" title="Veure perfil">
              <!-- Mostrar imagen si existe -->
              <img v-if="userAvatar" :src="userAvatar" :alt="userName" class="w-full h-full object-cover" />
              <!-- Mostrar iniciales si no hay imagen -->
              <span v-else class="text-sm font-bold">{{ userInitials }}</span>
            </router-link>

            <!-- Si no está autenticado -->
            <router-link v-else to="/login" class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors" title="Iniciar sessió">
              <span class="text-xl">👤</span>
            </router-link>

            <!-- Botón de configuración / logout -->
            <div class="relative" ref="menuRef">
              <button @click="showMenu = !showMenu" class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <span class="text-xl">⚙️</span>
              </button>

              <!-- Dropdown menu -->
              <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-2 z-50">
                <router-link v-if="isLoggedIn" to="/perfil" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors" @click="showMenu = false">
                  📝 Editar perfil
                </router-link>
                <button v-if="isLoggedIn" @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  🚪 Tancar sessió
                </button>
                <router-link v-else to="/login" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors" @click="showMenu = false">
                  🔑 Iniciar sessió
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <div class="relative h-[280px] md:h-[320px] overflow-hidden">
      <img src="../assets/background_image.jpg" alt="Hero" class="w-full h-full object-cover object-center scale-105" style="object-position: center 60%;" />
      <div class="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900" />
      <div class="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <div class="space-y-3 max-w-3xl">
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white">Catàleg de Jocs</h1>
          <p class="text-base md:text-lg text-gray-300 font-medium">Descobreix i valora els millors títols de la comunitat</p>
        </div>
      </div>
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
        <GameCardMini v-for="game in games" :key="game.id" :id="game.id" :image="game.image" :name="game.name" :genre="game.genre" :year="game.year" :platform="game.platform" :reviews="game.reviews" />
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
            <p class="text-gray-400 text-sm">La teva plataforma de confiança per descobrir, valorar i compartir els teus jocs favorits.</p>
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
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import GameCardMini from '@/views/GameCardMini.vue'
import { api } from '@/services/api'
import { auth } from '@/services/auth'

const router = useRouter()

// ⭐ Estados de autenticación
const isLoggedIn = computed(() => !!auth.state.token && !!auth.state.user)
const userName = computed(() => auth.state.user?.name || '')
const userAvatar = computed(() => auth.state.user?.avatarUrl || '')
const userInitials = computed(() => {
  if (!auth.state.user?.name) return '?'
  const names = auth.state.user.name.trim().split(' ')
  if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase()
  return names[0][0].toUpperCase()
})

// Estados del componente
const games = ref([])
const loading = ref(true)
const searchQuery = ref('')
const showSearchDropdown = ref(false)
const showMenu = ref(false)
const menuRef = ref(null)

// Computed para filtrar juegos
const filteredGames = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return games.value.filter(game => 
    game.name.toLowerCase().includes(query) ||
    game.genre.toLowerCase().includes(query) ||
    game.platform.toLowerCase().includes(query)
  ).slice(0, 5)
})

// Funciones
const handleSearch = () => { showSearchDropdown.value = searchQuery.value.length > 0 }
const hideDropdown = () => { setTimeout(() => { showSearchDropdown.value = false }, 200) }
const closeDropdown = () => { showSearchDropdown.value = false; searchQuery.value = '' }

const handleLogout = () => {
  auth.logout()
  showMenu.value = false
  router.push('/login')
}

// Cerrar menú al hacer click fuera
const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) { showMenu.value = false }
}

// Cargar juegos al montar el componente
onMounted(async () => {
  try {
    loading.value = true
    const data = await api.getGames()
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
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
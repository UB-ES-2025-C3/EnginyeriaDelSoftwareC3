<template>
  <div class="min-h-screen bg-gradient-to-t from-gray-900 to-black text-white">
    <!-- HEADER (copiado de GameCard) -->
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
              <router-link to="/reviews" class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium whitespace-nowrap">
                <span class="text-sm">👥</span> Comunitat
              </router-link>
              <router-link to="/contacte" class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium whitespace-nowrap">
                <span class="text-sm">❓</span> Contacte
              </router-link>
            </nav>
          </div>

          <!-- CENTRO: Buscador -->
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

            <!-- Dropdown de búsqueda (aquí vacío, pero mantenemos el markup) -->
            <div
              v-if="showSearchDropdown && filteredGames.length > 0"
              class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50"
            >
              <router-link
                v-for="game in filteredGames"
                :key="game.id"
                :to="`/game/${game.id}`"
                class="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                @click="closeDropdown"
              >
                <img :src="game.image" :alt="game.name" class="w-12 h-16 object-cover rounded" />
                <div class="flex-1">
                  <p class="font-semibold text-white">{{ game.name }}</p>
                  <p class="text-xs text-gray-400">{{ game.genre }} • {{ game.year }}</p>
                </div>
              </router-link>
            </div>

            <div
              v-if="showSearchDropdown && searchQuery && filteredGames.length === 0"
              class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 text-center text-gray-400 z-50"
            >
              No s'han trobat jocs.
            </div>
          </div>

          <!-- DERECHA: User actions -->
          <div class="flex items-center justify-end gap-4">
            <!-- ⭐ AVATAR DEL USUARIO -->
            <router-link
              v-if="isLoggedIn"
              to="/perfil"
              class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors overflow-hidden border-2 border-gray-700 hover:border-purple-500"
              title="Veure perfil"
            >
              <img
                v-if="userAvatar"
                :src="userAvatar"
                :alt="userName"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-sm font-bold">{{ userInitials }}</span>
            </router-link>

            <router-link
              v-else
              to="/login"
              class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              title="Iniciar sessió"
            >
              <span class="text-xl">👤</span>
            </router-link>

            <!-- Menú -->
            <div class="relative" ref="menuRef">
              <button
                @click="showMenu = !showMenu"
                class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <span class="text-xl">⚙️</span>
              </button>

              <div
                v-if="showMenu"
                class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-2 z-50"
              >
                <router-link
                  v-if="isLoggedIn"
                  to="/perfil"
                  class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  @click="showMenu = false"
                >
                  📝 Editar perfil
                </router-link>
                <button
                  v-if="isLoggedIn"
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  🚪 Tancar sessió
                </button>
                <router-link
                  v-else
                  to="/login"
                  class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  @click="showMenu = false"
                >
                  🔑 Iniciar sessió
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- CONTENIDO: feed de ressenyes -->
    <main class="max-w-5xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold mb-6">Ressenyes de la comunitat</h1>

      <div v-if="loading" class="text-center py-10 text-gray-400">
        Carregant ressenyes...
      </div>

      <div v-else>
        <div v-if="reviews.length === 0" class="text-sm text-gray-400">
          Encara no hi ha ressenyes. Torna més tard!
        </div>

        <div v-else class="space-y-4">
          <article
            v-for="(review, i) in reviews"
            :key="review._id || i"
            class="flex items-start gap-4 bg-gray-900/80 p-4 rounded-lg border border-gray-800"
          >
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div
                class="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-sm font-medium text-white"
              >
                <img
                  v-if="review.user?.avatarUrl"
                  :src="review.user.avatarUrl"
                  :alt="review.user?.name || 'Avatar'"
                  class="w-full h-full object-cover"
                />
                <span v-else>
                  {{ review.user?.name ? review.user.name[0].toUpperCase() : 'U' }}
                </span>
              </div>
            </div>

            <!-- Contenido -->
            <div class="flex-1">
              <!-- Nombre usuario + fecha -->
              <header class="flex items-center justify-between gap-4 mb-1">
                <div>
                  <h4 class="text-sm font-semibold text-white">
                    {{ review.user?.name || 'Usuari' }}
                  </h4>
                  <!-- 👇 TÍTULO DEL JUEGO -->
                  <p class="text-xs text-gray-400">
                    {{ review.game?.name || 'Joc desconegut' }}
                  </p>
                </div>
                <span class="text-xs text-gray-400">
                  {{ formatReviewDate(review.createdAt) }}
                </span>
              </header>

              <!-- Estrellas -->
              <div class="flex items-center gap-2 mb-1">
                <div class="flex items-center gap-1">
                  <Star
                    v-for="n in review.stars"
                    :key="`rfull-${i}-${n}`"
                    class="w-4 h-4 fill-yellow-400"
                  />
                  <Star
                    v-for="n in 5 - review.stars"
                    :key="`rempty-${i}-${n}`"
                    class="w-4 h-4 fill-gray-600"
                  />
                </div>
              </div>

              <!-- Texto -->
              <p class="mt-1 text-sm text-gray-300 leading-relaxed">
                {{ review.text }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <FooterComponent />
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'
import { auth } from '@/services/auth'
import Star from '@/components/icons/Star.vue'
import FooterComponent from '@/components/FooterComponent.vue'

interface Review {
  _id?: string
  stars: number
  text: string
  createdAt?: string
  user?: {
    _id?: string
    name?: string
    avatarUrl?: string
  }
  game?: {
    _id?: string
    name?: string
  }
}

const router = useRouter()

// Auth
const isLoggedIn = computed(() => !!auth.state.token && !!auth.state.user)
const userName = computed(() => auth.state.user?.name || '')
const userAvatar = computed(() => auth.state.user?.avatarUrl || '')
const userInitials = computed(() => {
  if (!auth.state.user?.name) return '?'
  const names = auth.state.user.name.trim().split(' ')
  if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase()
  return names[0][0].toUpperCase()
})

// Header state
const searchQuery = ref('')
const showSearchDropdown = ref(false)
const filteredGames = ref<any[]>([])
const showMenu = ref(false)
const menuRef = ref<HTMLDivElement | null>(null)

const handleSearch = () => {
  showSearchDropdown.value = searchQuery.value.length > 0
}
const hideDropdown = () => {
  setTimeout(() => {
    showSearchDropdown.value = false
  }, 200)
}
const closeDropdown = () => {
  showSearchDropdown.value = false
  searchQuery.value = ''
}

const handleLogout = () => {
  auth.logout()
  showMenu.value = false
  router.push('/login')
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (menuRef.value && !menuRef.value.contains(target)) {
    showMenu.value = false
  }
}

// Reviews state
const reviews = ref<Review[]>([])
const loading = ref(true)

const formatReviewDate = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('ca-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Cargar todas las reviews
onMounted(async () => {
  try {
    loading.value = true
    const data = await api.getAllReviews()
    reviews.value = data
    console.log('TOTES LES RESSENYES:', reviews.value)
  } catch (err) {
    console.error('Error carregant les ressenyes:', err)
  } finally {
    loading.value = false
  }

  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

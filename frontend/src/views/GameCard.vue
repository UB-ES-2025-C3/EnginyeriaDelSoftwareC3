<!-- src/views/GameCard.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-t from-gray-900 to-black text-white">
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
              <img v-if="userAvatar" :src="userAvatar" :alt="userName" class="w-full h-full object-cover" />
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
    <div class="max-w-5xl mx-auto px-4 py-12">
      <div class="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
        <!-- Imagen del juego (banner) -->
        <div class="relative w-full h-64 md:h-96">
          <img :src="image" :alt="name" class="w-full h-full object-cover object-center" />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        </div>

        <!-- Información principal (sobre la imagen) -->
        <div class="relative -mt-16 px-6 pb-6">
          <div class="bg-gradient-to-r from-black/50 via-black/40 to-transparent rounded-2xl p-6 shadow-lg backdrop-blur-sm border border-gray-800">
            <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{{ name }}</h2>
            <p class="text-sm text-gray-300 mb-4">{{ genre }} · {{ year }} · {{ platform }}</p>

            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 text-sm text-gray-300">
                <span class="font-semibold text-white">{{ reviews.length }} ressenyes</span>
                <span class="text-gray-500">•</span>
                <div class="flex items-center gap-1">
                  <template v-if="reviews && reviews.length">
                    <Star v-for="n in Math.round(avgRating)" :key="`star-${n}`" class="w-4 h-4 fill-yellow-400" />
                    <Star v-for="n in (5 - Math.round(avgRating))" :key="`star-empty-${n}`" class="w-4 h-4 fill-gray-600" />
                    <span class="text-gray-400 ml-2">{{ avgRating.toFixed(1) }}</span>
                  </template>
                  <template v-else>
                    <span class="text-gray-500">Sense ressenyes</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botó per afegir ressenya -->
        <div class="px-6 pb-2">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold">Resenyes recents</h3>

            <button
              v-if="isLoggedIn"
              @click="showReviewForm = !showReviewForm"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-sm font-semibold transition-colors"
            >
              <span>✍️</span>
              <span>{{ showReviewForm ? 'Cancel·lar' : 'Escriure una ressenya' }}</span>
            </button>

            <router-link
              v-else
              to="/login"
              class="text-sm text-purple-400 hover:text-purple-300 underline"
            >
              Inicia sessió per escriure una ressenya
            </router-link>
          </div>

          <!-- Formulari de nova ressenya -->
          <transition name="fade">
            <div
              v-if="showReviewForm"
              class="mt-4 bg-gray-800/80 border border-gray-700 rounded-2xl p-4 space-y-3"
            >
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-300 mb-1">
                    Puntuació
                  </label>
                  <select
                    v-model.number="newReviewStars"
                    class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option v-for="n in 5" :key="n" :value="n">
                      {{ n }} estrella{{ n > 1 ? 's' : '' }}
                    </option>
                  </select>
                </div>

                <div class="flex-[3]">
                  <label class="block text-sm font-medium text-gray-300 mb-1">
                    Comentari
                  </label>
                  <textarea
                    v-model="newReviewText"
                    rows="3"
                    maxlength="500"
                    class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Explica què t'ha semblat el joc..."
                  ></textarea>
                </div>
              </div>

              <div class="flex items-center justify-end gap-2">
                <button
                  type="button"
                  @click="showReviewForm = false"
                  class="px-4 py-2 text-sm rounded-full border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel·lar
                </button>
                <button
                  type="button"
                  @click="submitReview"
                  :disabled="isSubmittingReview"
                  class="px-4 py-2 text-sm rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  {{ isSubmittingReview ? 'Enviant...' : 'Publicar ressenya' }}
                </button>
              </div>

              <p v-if="reviewError" class="text-sm text-red-400 mt-1">
                {{ reviewError }}
              </p>
            </div>
          </transition>
        </div>


        <!-- Reseñas -->
        <div class="px-6 pb-8 pt-6">

          <div v-if="reviews.length === 0" class="text-sm text-gray-400">
            Encara no hi ha ressenyes per a aquest joc. Sigues el primer a escriure una ressenya!
          </div>

          <div v-else class="space-y-4">
            <article
              v-for="(review, i) in reviews"
              :key="review._id || i"
              class="flex items-start gap-4 bg-gray-800/60 p-4 rounded-lg border border-gray-800"
            >
              <!-- Avatar / imagen usuario -->
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
                    {{
                      review.user?.name
                        ? review.user.name[0].toUpperCase()
                        : 'U'
                    }}
                  </span>
                </div>
              </div>

              <!-- Contenido reseña -->
              <div class="flex-1">
                <!-- Nombre usuario + fecha -->
                <header class="flex items-center justify-between gap-4 mb-1">
                  <h4 class="text-sm font-semibold text-white">
                    {{ review.user?.name || 'Usuari' }}
                  </h4>
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

                <!-- Texto reseña -->
                <p class="mt-1 text-sm text-gray-300 leading-relaxed">
                  {{ review.text }}
                </p>
              </div>
            </article>
          </div>
        </div>

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
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Ressenyes</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Esdeveniments</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Discord</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Suport</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Centre d'ajuda</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Contacte</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Política de privadesa</a></li>
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

<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/services/api'
import { auth } from '@/services/auth'
import Star from '@/components/icons/Star.vue'

// ⭐ Definir tipos

interface Review {
  _id?: string
  stars: number
  text: string
  user?: {
    _id?: string
    name?: string
    avatarUrl?: string
  }
  createdAt?: string
}

// ⭐ Tipo para los juegos en búsqueda
interface GameSearchResult {
  id: string
  name: string
  genre: string
  year: number
  image: string
}

const props = defineProps({
  id: { type: [String, Number], required: false }
})

// Estados de autenticación
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
const image = ref('')
const name = ref('')
const genre = ref('')
const year = ref(0)
const platform = ref('')
const reviews = ref<Review[]>([])

// Formulario de nova ressenya
const showReviewForm = ref(false)
const newReviewStars = ref(5)
const newReviewText = ref('')
const isSubmittingReview = ref(false)
const reviewError = ref<string | null>(null)

// Estados del header (búsqueda y menú)
const searchQuery = ref('')
const showSearchDropdown = ref(false)
const filteredGames = ref<GameSearchResult[]>([]) // ⭐ TIPADO CORRECTO
const showMenu = ref(false)
const menuRef = ref<HTMLDivElement | null>(null)

const route = useRoute()
const router = useRouter()
const gameId = ref(String(props.id ?? route.params.id ?? ''))

async function loadGame() {
  try {
    const g = await api.getGame(gameId.value)
    image.value = g.image
    name.value = g.name
    genre.value = g.genre
    year.value = Number(g.year)
    platform.value = g.platform
    await getReviews()
    window.scrollTo({ top: 0, behavior: 'auto' })
  } catch (e) {
    console.error('Error carregant joc:', e)
  }
}

async function submitReview() {
  if (!isLoggedIn.value) {
    reviewError.value = 'Has d\'iniciar sessió per escriure una ressenya.'
    return
  }

  reviewError.value = null

  // Validació ràpida al client
  if (newReviewStars.value < 1 || newReviewStars.value > 5) {
    reviewError.value = 'La puntuació ha d\'estar entre 1 i 5.'
    return
  }
  if (!newReviewText.value.trim()) {
    reviewError.value = 'El text de la ressenya no pot estar buit.'
    return
  }

  try {
    isSubmittingReview.value = true
    const token = auth.state.token
    if (!token) {
      reviewError.value = 'Sessió no vàlida. Torna a iniciar sessió.'
      return
    }

    const res = await api.createReview(token, gameId.value, {
      stars: newReviewStars.value,
      text: newReviewText.value.trim(),
    })

    // Afegim la nova ressenya al principi del llistat
    reviews.value = [res.review, ...reviews.value]

    // Reset del formulari
    newReviewStars.value = 5
    newReviewText.value = ''
    showReviewForm.value = false
  } catch (e) {
    console.error('Error creant ressenya:', e)
    reviewError.value = 'No s\'ha pogut crear la ressenya.'
  } finally {
    isSubmittingReview.value = false
    console.log("Resenya enviada")
  }
}

async function getReviews() {
  try {
    const data = await api.getGameReviews(gameId.value)
    reviews.value = data.reviews
    console.log(`Ressenyes carregades:`, reviews.value)
  } catch (e) {
    console.error('Error carregant ressenyes:', e)
  }
}


// Funciones del header
const handleSearch = () => { showSearchDropdown.value = searchQuery.value.length > 0 }
const hideDropdown = () => { setTimeout(() => { showSearchDropdown.value = false }, 200) }
const closeDropdown = () => { showSearchDropdown.value = false; searchQuery.value = '' }

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

onMounted(() => {
  loadGame()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(() => route.params.id, v => {
  gameId.value = String(v ?? '')
  loadGame()
})

const avgRating = computed(() => {
  if (!reviews.value || reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, r) => acc + (r.stars || 0), 0)
  return sum / reviews.value.length
})

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


</script>
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
    <header class="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg">
      <div class="w-full px-6 py-4">
        <div class="grid grid-cols-3 items-center gap-4">
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

          <div class="relative">
            <div class="relative max-w-lg mx-auto flex items-center gap-3">
              <div class="relative flex-1">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar jocs..."
                  v-model="searchQuery"
                  @input="handleSearch"
                  @focus="showSearchDropdown = searchQuery.trim().length > 0"
                  @blur="hideDropdown"
                  @keyup.enter.prevent="handleSearchSubmit"
                  class="w-full bg-gray-800 border border-gray-700 rounded-full pl-12 pr-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-gray-750"
                />
              </div>
              <button
                type="button"
                class="w-11 h-11 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Obrir filtres"
                @click="filterPanelOpen = true"
              >
                <svg viewBox="0 0 24 24" class="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 4h18L14 12v6l-4-2v-4L3 4z"/>
                </svg>
              </button>
            </div>

            <div
              v-if="showSearchDropdown && searchResults.length > 0"
              class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50"
            >
              <router-link
                v-for="game in searchResults"
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
              v-if="showSearchDropdown && searchQuery && searchResults.length === 0"
              class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 text-center text-gray-400 z-50"
            >
              No s'han trobat jocs.
            </div>
          </div>

          <div class="flex items-center justify-end gap-4">
            <router-link
              v-if="isLoggedIn"
              to="/perfil"
              class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors overflow-hidden border-2 border-gray-700 hover:border-purple-500"
              title="Veure perfil"
            >
              <img v-if="userAvatar" :src="userAvatar" :alt="userName" class="w-full h-full object-cover" />
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

            <div class="relative" ref="menuRef">
              <button @click="showMenu = !showMenu" class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <span class="text-xl">⚙️</span>
              </button>

              <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-2 z-50">
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

    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="mb-8">
        <h2 class="text-3xl font-bold mb-2">Jocs Destacats</h2>
        <p class="text-gray-400">Explora la nostra selecció de títols populars</p>
      </div>

      <div class="mb-6">
        <div v-if="activeFilters.length" class="flex flex-wrap gap-2">
          <button
            v-for="filter in activeFilters"
            :key="`${filter.type}-${filter.value ?? 'search'}`"
            class="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-400/40 text-sm px-3 py-1 rounded-full text-purple-100 hover:bg-purple-500/20 transition-colors"
            @click="removeFilter(filter)"
            type="button"
          >
            <span>{{ filter.label }}</span>
            <span class="text-xs">&times;</span>
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400 hover:text-white"
            @click="clearFilters"
          >
            Netejar filtres
          </button>
        </div>
        <p v-else class="text-sm text-gray-500">Cap filtre actiu.</p>
      </div>

      <div v-if="loading" class="text-center py-20">
        <p class="text-gray-400 text-lg">Carregant jocs...</p>
      </div>

      <template v-else>
        <div v-if="games.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <GameCardMini
            v-for="game in games"
            :key="game.id"
            :id="game.id"
            :image="game.image"
            :name="game.name"
            :genre="game.genre"
            :year="game.year"
            :platform="game.platform"
            :average-rating="game.averageRating"
            :review-count="game.reviewCount"
          />
        </div>

        <div v-else class="text-center py-20">
          <p class="text-gray-400 text-lg">No s'han trobat jocs. Torna aviat!</p>
        </div>
      </template>
    </div>

    <!-- Footer -->
    <FooterComponent />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GameCardMini from '@/views/GameCardMini.vue'
import { api, GameSummary } from '@/services/api'
import { auth } from '@/services/auth'
import FooterComponent from "@/components/FooterComponent.vue";

const router = useRouter()
const route = useRoute()

type SortOption = { value: 'best' | 'worst' | 'year' | 'reviews'; label: string }
type ActiveFilter = { type: 'search' | 'genre' | 'platform'; label: string; value?: string }

const sortOptions: SortOption[] = [
  { value: 'best', label: 'Millor valorats primer' },
  { value: 'worst', label: 'Pitjor valorats primer' },
  { value: 'year', label: 'Any de llançament' },
  { value: 'reviews', label: 'Nombre de ressenyes' }
]

const isLoggedIn = computed(() => !!auth.state.token && !!auth.state.user)
const userName = computed(() => auth.state.user?.name || '')
const userAvatar = computed(() => auth.state.user?.avatarUrl || '')
const userInitials = computed(() => {
  if (!auth.state.user?.name) return '?'
  const names = auth.state.user.name.trim().split(' ')
  if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase()
  return names[0][0].toUpperCase()
})

type CatalogGame = {
  id: string
  image: string
  name: string
  genre: string
  year: number
  platform: string
  averageRating: number
  reviewCount: number
}

const games = ref<CatalogGame[]>([])
const searchResults = ref<CatalogGame[]>([])
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

const availableGenres = ref<string[]>([])
const availablePlatforms = ref<string[]>([])
const selectedGenres = ref<string[]>([])
const selectedPlatforms = ref<string[]>([])
const selectedSort = ref<SortOption['value']>('best')

const activeFilters = computed<ActiveFilter[]>(() => {
  const chips: ActiveFilter[] = []
  const trimmedSearch = searchQuery.value.trim()
  if (trimmedSearch.length) {
    chips.push({ type: 'search', label: `Cerca: ${trimmedSearch}` })
  }
  selectedGenres.value.forEach((genre) => chips.push({ type: 'genre', value: genre, label: `Gènere: ${genre}` }))
  selectedPlatforms.value.forEach((platform) =>
    chips.push({ type: 'platform', value: platform, label: `Plataforma: ${platform}` })
  )
  return chips
})

const handleLogout = () => {
  auth.logout()
  showMenu.value = false
  router.push('/login')
}

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    showMenu.value = false
  }
}

let searchDebounce: number | undefined
const handleSearch = () => {
  const query = searchQuery.value.trim()
  showSearchDropdown.value = query.length > 0
  if (searchDebounce) window.clearTimeout(searchDebounce)
  if (!query) {
    searchResults.value = []
    return
  }
  searchDebounce = window.setTimeout(() => fetchSearchSuggestions(query), 250)
}

const hideDropdown = () => {
  window.setTimeout(() => {
    showSearchDropdown.value = false
  }, 180)
}

const closeDropdown = () => {
  showSearchDropdown.value = false
}

const parseListQuery = (value: unknown) => {
  if (!value) return []
  if (Array.isArray(value)) {
    return Array.from(new Set(value.map((item) => (item ?? '').toString().trim()).filter(Boolean)))
  }
  if (typeof value === 'string') {
    return Array.from(new Set(value.split(',').map((item) => item.trim()).filter(Boolean)))
  }
  return []
}

const mapGame = (game: GameSummary): CatalogGame => ({
  id: game._id,
  image: game.image,
  name: game.name,
  genre: game.genre,
  year: Number(game.year),
  platform: game.platform,
  averageRating: Number.isFinite(game.averageRating) ? Number(game.averageRating) : 0,
  reviewCount: Number(game.reviewCount ?? 0)
})

const fetchGames = async () => {
  try {
    loading.value = true
    const data = await api.getGames({
      q: searchQuery.value.trim() || undefined,
      sort: selectedSort.value,
      genres: selectedGenres.value,
      platforms: selectedPlatforms.value,
    })
    games.value = data.items.map(mapGame)
    availableGenres.value = data.availableGenres
    availablePlatforms.value = data.availablePlatforms
  } catch (err) {
    console.error('Error carregant jocs del backend:', err)
  } finally {
    loading.value = false
  }
}

const fetchSearchSuggestions = async (term: string) => {
  try {
    const result = await api.getGames({ q: term, limit: 5 })
    searchResults.value = result.items.map(mapGame)
  } catch (error) {
    console.error('Error cercant jocs:', error)
    searchResults.value = []
  }
}

const updateQuery = ({ page, resetPage }: { page?: number; resetPage?: boolean } = {}) => {
  const trimmedSearch = searchQuery.value.trim()
  const query: Record<string, string> = {
    sort: selectedSort.value,
  }
  if (trimmedSearch) query.q = trimmedSearch
  if (selectedGenres.value.length) query.genres = selectedGenres.value.join(',')
  if (selectedPlatforms.value.length) query.platforms = selectedPlatforms.value.join(',')

  router.replace({ path: route.path, query }).catch(() => {})
}

const handleSearchSubmit = () => {
  updateQuery({ resetPage: true })
}

const handleSortChange = () => {
  updateQuery({ resetPage: true })
}

const handleGenreChange = () => {
  updateQuery({ resetPage: true })
}

const handlePlatformChange = () => {
  updateQuery({ resetPage: true })
}

const removeFilter = (filter: ActiveFilter) => {
  if (filter.type === 'search') {
    searchQuery.value = ''
    searchResults.value = []
  }
  if (filter.type === 'genre' && filter.value) {
    selectedGenres.value = selectedGenres.value.filter((genre) => genre !== filter.value)
  }
  if (filter.type === 'platform' && filter.value) {
    selectedPlatforms.value = selectedPlatforms.value.filter((platform) => platform !== filter.value)
  }
  updateQuery({ resetPage: true })
}

const clearFilters = () => {
  const hasChanges =
    !!searchQuery.value ||
    selectedGenres.value.length > 0 ||
    selectedPlatforms.value.length > 0 ||
    selectedSort.value !== 'best'
  searchQuery.value = ''
  selectedGenres.value = []
  selectedPlatforms.value = []
  selectedSort.value = 'best'
  if (hasChanges) {
    updateQuery({ resetPage: true })
  }
}

const syncStateFromRoute = () => {
  const { q, sort, genres, platforms, page } = route.query
  searchQuery.value = typeof q === 'string' ? q : ''
  const sortValue = typeof sort === 'string' && sortOptions.some((option) => option.value === sort) ? sort : 'best'
  selectedSort.value = sortValue as SortOption['value']
  selectedGenres.value = parseListQuery(genres)
  selectedPlatforms.value = parseListQuery(platforms)
  const parsedPage = Math.max(parseInt((page as string) ?? '1', 10) || 1, 1)
  handleSearch()
}

watch(
  () => ({ ...route.query }),
  () => {
    syncStateFromRoute()
    fetchGames()
  },
  { immediate: true }
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (searchDebounce) {
    window.clearTimeout(searchDebounce)
  }
})
</script>

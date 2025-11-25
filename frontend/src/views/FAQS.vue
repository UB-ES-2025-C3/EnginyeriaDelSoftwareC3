<!-- src/views/FAQs.vue -->
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

            <NavBarComponent />
          </div>

          <!-- CENTRO: Buscador -->
          <div class="relative">
            <div class="relative max-w-lg mx-auto">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input type="text" placeholder="Buscar jocs..." v-model="searchQuery" @input="handleSearch"
                @focus="showSearchDropdown = searchQuery.length > 0" @blur="hideDropdown"
                class="w-full bg-gray-800 border border-gray-700 rounded-full pl-12 pr-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-gray-750" />
            </div>

            <!-- Dropdown de búsqueda -->
            <div v-if="showSearchDropdown && filteredGames.length > 0"
              class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
              <router-link v-for="game in filteredGames" :key="game.id" :to="`/game/${game.id}`"
                class="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                @click="closeDropdown">
                <img :src="game.image" :alt="game.name" class="w-12 h-16 object-cover rounded" />
                <div class="flex-1">
                  <p class="font-semibold text-white">{{ game.name }}</p>
                  <p class="text-xs text-gray-400">{{ game.genre }} • {{ game.year }}</p>
                </div>
              </router-link>
            </div>

            <!-- Mensaje cuando no hay resultados -->
            <div v-if="showSearchDropdown && searchQuery && filteredGames.length === 0"
              class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 text-center text-gray-400 z-50">
              No s'han trobat jocs.
            </div>
          </div>

          <!-- DERECHA: User actions -->
          <div class="flex items-center justify-end gap-4">
            <!-- Avatar del usuario -->
            <router-link v-if="isLoggedIn" to="/perfil"
              class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors overflow-hidden border-2 border-gray-700 hover:border-purple-500"
              title="Veure perfil">
              <img v-if="userAvatar" :src="userAvatar" :alt="userName" class="w-full h-full object-cover" />
              <span v-else class="text-sm font-bold">{{ userInitials }}</span>
            </router-link>

            <!-- Si no está autenticado -->
            <router-link v-else to="/login"
              class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              title="Iniciar sessió">
              <span class="text-xl">👤</span>
            </router-link>

            <!-- Botón de configuración / logout -->
            <div class="relative" ref="menuRef">
              <button @click="showMenu = !showMenu"
                class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <span class="text-xl">⚙️</span>
              </button>

              <!-- Dropdown menu -->
              <div v-if="showMenu"
                class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-2 z-50">
                <router-link v-if="isLoggedIn" to="/perfil"
                  class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  @click="showMenu = false">
                  📝 Editar perfil
                </router-link>
                <button v-if="isLoggedIn" @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  🚪 Tancar sessió
                </button>
                <router-link v-else to="/login"
                  class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  @click="showMenu = false">
                  🔑 Iniciar sessió
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido principal: FAQs -->
    <div class="max-w-5xl mx-auto px-4 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1
          class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Preguntes Freqüents
        </h1>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          Troba respostes a les preguntes més habituals sobre CheckPoint
        </p>
      </div>

      <!-- Buscador de FAQs -->
      <div class="mb-8">
        <div class="relative max-w-2xl mx-auto">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input type="text" v-model="faqSearch" placeholder="Cerca en les FAQs..."
            class="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
        </div>
      </div>

      <!-- Categorías -->
      <div class="flex flex-wrap gap-3 justify-center mb-10">
        <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat"
          class="px-5 py-2 rounded-full font-semibold text-sm transition-all" :class="selectedCategory === cat
            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'">
          {{ cat }}
        </button>
      </div>

      <!-- Lista de FAQs -->
      <div class="space-y-4">
        <div v-for="(faq, index) in filteredFaqs" :key="index"
          class="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all">
          <button @click="toggleFaq(index)"
            class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors">
            <div class="flex items-start gap-4 flex-1">
              <span class="text-2xl flex-shrink-0">{{ faq.icon }}</span>
              <div class="flex-1">
                <h3 class="font-semibold text-white text-lg">{{ faq.question }}</h3>
                <span class="text-xs text-purple-400 mt-1 inline-block">{{ faq.category }}</span>
              </div>
            </div>
            <span class="text-gray-400 text-xl transition-transform duration-300"
              :class="{ 'rotate-180': openFaq === index }">
              ▼
            </span>
          </button>

          <transition name="accordion">
            <div v-if="openFaq === index" class="px-6 pb-6 pt-2">
              <div
                class="text-gray-300 leading-relaxed border-l-4 border-purple-500 pl-6 py-2 bg-gray-800/30 rounded-r">
                <p v-html="faq.answer"></p>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- No hay resultados -->
      <div v-if="filteredFaqs.length === 0" class="text-center py-12">
        <span class="text-6xl mb-4 block">🤔</span>
        <p class="text-gray-400 text-lg">No s'han trobat preguntes que coincideixin amb la teva cerca.</p>
        <button @click="faqSearch = ''; selectedCategory = 'Totes'" class="mt-4 text-purple-400 hover:text-purple-300">
          Esborrar cerca
        </button>
      </div>

      <!-- CTA Final -->
      <div
        class="mt-16 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8 text-center">
        <h2 class="text-2xl font-bold mb-3">No has trobat el que buscaves?</h2>
        <p class="text-gray-300 mb-6">Envia'ns la teva consulta i t'ajudarem encantats</p>
        <router-link to="/contacte"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl">
          <span>💬</span>
          <span>Contacta amb nosaltres</span>
        </router-link>
      </div>
    </div>

    <!-- Footer -->
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/services/auth'
import FooterComponent from '@/components/FooterComponent.vue'
import NavBarComponent from '@/components/NavBarComponent.vue'

// Tipos
interface GameSearchResult {
  id: string
  name: string
  genre: string
  year: number
  image: string
}

interface FAQ {
  question: string
  answer: string
  category: string
  icon: string
}

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

// Estados del header
const searchQuery = ref('')
const showSearchDropdown = ref(false)
const filteredGames = ref<GameSearchResult[]>([])
const showMenu = ref(false)
const menuRef = ref<HTMLDivElement | null>(null)

// Estados de FAQs
const faqSearch = ref('')
const selectedCategory = ref('Totes')
const openFaq = ref<number | null>(null)

const router = useRouter()

// Categorías
const categories = ['Totes', 'General', 'Compte', 'Catàleg', 'Ressenyes', 'Privacitat', 'Tècnic']

// FAQs Data
const faqs = ref<FAQ[]>([
  {
    question: "Què és CheckPoint?",
    answer: "CheckPoint és una xarxa social d'entreteniment centrada en videojocs on pots descobrir nous títols, puntuar-los amb estrelles, deixar ressenyes detallades i crear llistes personalitzades. És com una combinació de FilmAffinity i Backloggd, però per a gamers.",
    category: "General",
    icon: "🎮"
  },
  {
    question: "És gratuït utilitzar CheckPoint?",
    answer: "Sí, CheckPoint és completament gratuït. Pots crear un compte, explorar el catàleg, puntuar jocs i deixar ressenyes sense cap cost.",
    category: "General",
    icon: "💰"
  },
  {
    question: "Com puc crear un compte?",
    answer: "Fes clic a 'Iniciar sessió' a la part superior dreta, després selecciona 'Registrar-me'. Només necessites un nom, correu electrònic i contrasenya. El procés és ràpid i senzill!",
    category: "Compte",
    icon: "👤"
  },
  {
    question: "He oblidat la meva contrasenya, què faig?",
    answer: "A la pàgina d'inici de sessió, fes clic a 'He oblidat la meva contrasenya'. Rebràs un correu electrònic amb instruccions per restablir-la.",
    category: "Compte",
    icon: "🔑"
  },
  {
    question: "Com puc afegir un joc al meu perfil?",
    answer: "Navega pel catàleg, cerca el joc que vols i fes clic a la seva fitxa. Allà podràs puntuar-lo amb estrelles, afegir-lo a les teves llistes i deixar una ressenya.",
    category: "Catàleg",
    icon: "➕"
  },
  {
    question: "Puc editar o eliminar les meves ressenyes?",
    answer: "Sí! Ves al teu perfil, troba la ressenya que vols modificar i fes clic a l'icona d'editar o eliminar. Tens control total sobre el teu contingut.",
    category: "Ressenyes",
    icon: "✏️"
  },
  {
    question: "Com funciona el sistema de puntuació?",
    answer: "Utilitzem un sistema d'estrelles de 1 a 5, on 1 estrella significa que no t'ha agradat gens i 5 estrelles que t'ha encantat. Les puntuacions de tots els usuaris es combinen per crear una valoració mitjana.",
    category: "Ressenyes",
    icon: "⭐"
  },
  {
    question: "Puc crear llistes personalitzades?",
    answer: "Absolutament! Pots crear llistes com 'Els meus favorits', 'Jocs pendents', 'Millors RPGs', o el que vulguis. És una manera genial d'organitzar la teva col·lecció.",
    category: "Catàleg",
    icon: "📋"
  },
  {
    question: "Com puc personalitzar el meu perfil?",
    answer: "Ves a 'Editar perfil' des del menú de configuració. Pots afegir una foto de perfil, banner, biografia i enllaços a les teves xarxes socials i perfils de gaming.",
    category: "Compte",
    icon: "🎨"
  },
  {
    question: "Les meves dades estan segures?",
    answer: "Sí, prenem molt seriosament la seguretat. Les teves dades estan xifrades i mai compartim la teva informació personal amb tercers. Pots consultar la nostra política de privacitat per a més detalls.",
    category: "Privacitat",
    icon: "🔒"
  },
  {
    question: "Puc eliminar el meu compte?",
    answer: "Sí, pots eliminar el teu compte en qualsevol moment des de la configuració del perfil. Tingues en compte que aquesta acció és irreversible i eliminarà totes les teves dades.",
    category: "Compte",
    icon: "🗑️"
  },
  {
    question: "Com puc reportar contingut inapropiat?",
    answer: "Si veus una ressenya o contingut que viola les nostres normes comunitàries, utilitza el botó de 'Reportar' que trobaràs al costat de cada ressenya. El nostre equip ho revisarà ràpidament.",
    category: "General",
    icon: "⚠️"
  },
  {
    question: "Quins navegadors són compatibles?",
    answer: "CheckPoint funciona millor a les últimes versions de Chrome, Firefox, Safari i Edge. Per a la millor experiència, mantén el teu navegador actualitzat.",
    category: "Tècnic",
    icon: "🌐"
  },
  {
    question: "Hi ha una app mòbil?",
    answer: "Actualment estem treballant en versions natives per a iOS i Android. Mentrestant, la versió web està optimitzada per a dispositius mòbils i funciona perfectament des del navegador del teu telèfon.",
    category: "Tècnic",
    icon: "📱"
  },
  {
    question: "Com puc suggerir millores o reportar errors?",
    answer: "Ens encanta escoltar els nostres usuaris! Utilitza el <a href='/contacto' class='text-purple-400 hover:text-purple-300 underline'>formulari de contacte</a> i selecciona 'Suggeriment de millora' o 'Queixa o problema'. Llegim tots els missatges.",
    category: "General",
    icon: "💡"
  },
  {
    question: "Puc connectar amb altres jugadors?",
    answer: "Sí! Pots seguir altres usuaris, veure les seves ressenyes i llistes, i descobrir nous jocs a través de les seves recomanacions. La part social està en constant expansió.",
    category: "General",
    icon: "👥"
  },
  {
    question: "Hi ha límit en el nombre de jocs que puc afegir?",
    answer: "No, no hi ha cap límit! Afegeix tots els jocs que vulguis al teu perfil, crea tantes llistes com necessitis i deixa tantes ressenyes com desitgis.",
    category: "Catàleg",
    icon: "∞"
  },
  {
    question: "Com puc canviar l'idioma?",
    answer: "Actualment CheckPoint està disponible en català. Estem treballant per afegir més idiomes al futur proper, incloent castellà i anglès.",
    category: "Tècnic",
    icon: "🌍"
  }
])

// Funciones del header
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

// Funciones de FAQs
const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const filteredFaqs = computed(() => {
  let result = faqs.value

  // Filtrar por categoría
  if (selectedCategory.value !== 'Totes') {
    result = result.filter(faq => faq.category === selectedCategory.value)
  }

  // Filtrar por búsqueda
  if (faqSearch.value.trim()) {
    const search = faqSearch.value.toLowerCase()
    result = result.filter(faq =>
      faq.question.toLowerCase().includes(search) ||
      faq.answer.toLowerCase().includes(search)
    )
  }

  return result
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>

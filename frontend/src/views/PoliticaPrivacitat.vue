<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-950 to-black text-gray-100 flex flex-col">
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

            <NavBarComponent />

          </div>

          <div class="relative">
            <div class="relative max-w-lg mx-auto flex items-center gap-3">
              <div class="relative flex-1">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                <input type="text" placeholder="Buscar jocs..." v-model="searchQuery" @input="handleSearch"
                  @focus="showSearchDropdown = searchQuery.trim().length > 0" @blur="hideDropdown"
                  @keyup.enter.prevent="handleSearchSubmit"
                  class="w-full bg-gray-800 border border-gray-700 rounded-full pl-12 pr-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-gray-750" />
              </div>
              <button type="button"
                class="w-11 h-11 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Obrir filtres" @click="filterPanelOpen = true">
                <svg viewBox="0 0 24 24" class="w-5 h-5 text-purple-300" fill="none" stroke="currentColor"
                  stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M3 4h18L14 12v6l-4-2v-4L3 4z" />
                </svg>
              </button>
            </div>

            <div v-if="showSearchDropdown && searchResults.length > 0"
              class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
              <router-link v-for="game in searchResults" :key="game.id" :to="`/game/${game.id}`"
                class="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                @click="closeDropdown">
                <img :src="game.image" :alt="game.name" class="w-12 h-16 object-cover rounded" />
                <div class="flex-1">
                  <p class="font-semibold text-white">{{ game.name }}</p>
                  <p class="text-xs text-gray-400">{{ game.genre }} • {{ game.year }}</p>
                </div>
              </router-link>
            </div>

            <div v-if="showSearchDropdown && searchQuery && searchResults.length === 0"
              class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 text-center text-gray-400 z-50">
              No s'han trobat jocs.
            </div>
          </div>

          <div class="flex items-center justify-end gap-4">
            <router-link v-if="isLoggedIn" to="/perfil"
              class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors overflow-hidden border-2 border-gray-700 hover:border-purple-500"
              title="Veure perfil">
              <img v-if="userAvatar" :src="userAvatar" :alt="userName" class="w-full h-full object-cover" />
              <span v-else class="text-sm font-bold">{{ userInitials }}</span>
            </router-link>

            <router-link v-else to="/login"
              class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              title="Iniciar sessió">
              <span class="text-xl">👤</span>
            </router-link>

            <div class="relative" ref="menuRef">
              <button @click="showMenu = !showMenu"
                class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <span class="text-xl">⚙️</span>
              </button>

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
    <section class="flex-1">
      <div class="max-w-4xl mx-auto px-6 py-16">
        <header class="mb-12 text-center">
          <p class="text-sm uppercase tracking-widest text-purple-400 mb-2">Transparència</p>
          <h1 class="text-4xl md:text-5xl font-extrabold text-white">Política de privacitat</h1>
          <p class="text-gray-400 mt-4">
            Aquesta política descriu com CheckPoint recull, utilitza i protegeix les teves dades personals
            quan utilitzes la nostra plataforma.
          </p>
        </header>

        <div class="bg-gray-900/60 border border-gray-800 rounded-3xl shadow-2xl divide-y divide-gray-800">
          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Qui som</h2>
            <p>
              CheckPoint és el responsable del tractament de les dades i vetlla per l'ús correcte del servei.
              Ens pots contactar per qualsevol consulta a <span
                class="text-white font-medium">privacy@checkpoint.app</span>.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Dades que recollim</h2>
            <ul class="list-disc pl-6 space-y-2 text-gray-300">
              <li>Dades de compte: nom, email, contrasenya encriptada.</li>
              <li>Informació de perfil: avatar, preferències de joc i biografia.</li>
              <li>Registres tècnics: logs d'accés, dispositiu, navegador i adreça IP.</li>
              <li>Cookies i tecnologies similars per mantenir la sessió i recordar preferències.</li>
            </ul>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Finalitats i base legal</h2>
            <p>Tractem les dades per:</p>
            <ul class="list-disc pl-6 space-y-2 text-gray-300">
              <li>Prestar el servei i gestionar el teu compte (execució del contracte).</li>
              <li>Enviar notificacions i suport (interès legítim i consentiment quan cal).</li>
              <li>Analitzar l'ús de la plataforma per millorar-la (interès legítim).</li>
              <li>Complir obligacions legals de seguretat i conservació.</li>
            </ul>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Temps de conservació</h2>
            <p>
              Conservem les dades mentre el compte estigui actiu i durant un màxim de 3 anys després de la
              darrera interacció per atendre possibles reclamacions. Les dades vinculades a obligacions
              fiscals o legals podran conservar-se durant els terminis exigits.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Destinataris</h2>
            <p>
              Compartim dades amb proveïdors que ens ajuden a oferir el servei (hosting, analítica i suport),
              subjectes a contractes de confidencialitat. No venem dades personals a tercers.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Transferències internacionals</h2>
            <p>
              Si algun proveïdor està ubicat fora de l'Espai Econòmic Europeu, garantim la protecció de les
              dades mitjançant clàusules contractuals tipus aprovades per la Comissió Europea. Actualment no
              fem transferències fora d'aquesta cobertura.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Drets de l'usuari</h2>
            <p>Pots exercir els teus drets en qualsevol moment escrivint-nos a <span
                class="text-white font-medium">privacy@checkpoint.app</span>:</p>
            <ul class="list-disc pl-6 space-y-2 text-gray-300">
              <li>Accés, rectificació i supressió de les dades.</li>
              <li>Oposició i limitació del tractament.</li>
              <li>Portabilitat de les dades quan sigui tècnicament possible.</li>
              <li>Retirada del consentiment sense efecte retroactiu.</li>
            </ul>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Contacte</h2>
            <p>
              Per dubtes o reclamacions, escriu-nos a <span
                class="text-white font-medium">privacy@checkpoint.app</span>.
              També pots adreçar-te a l'autoritat de control corresponent si consideres que no hem respost adequadament.
            </p>
          </section>

          <section class="p-8 space-y-2">
            <h2 class="text-2xl font-semibold text-white">Data d'entrada en vigor</h2>
            <p class="text-gray-300">
              Aquesta política és vigent des de l'1 de desembre de 2025 i s'actualitzarà quan hi hagi canvis
              significatius.
            </p>
          </section>
        </div>
      </div>
    </section>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import FooterComponent from '@/components/FooterComponent.vue'
import NavBarComponent from '@/components/NavBarComponent.vue'

const pageTitle = 'Política de privacitat | CheckPoint'
const description = 'Coneix com CheckPoint gestiona les teves dades personals, les finalitats i els teus drets.'

let previousTitle = document.title
let previousDescription = ''
let metaDescription: HTMLMetaElement | null = null

onMounted(() => {
  previousTitle = document.title
  document.title = pageTitle

  metaDescription = document.querySelector('meta[name=\"description\"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }
  previousDescription = metaDescription?.getAttribute('content') || ''
  metaDescription?.setAttribute('content', description)
})

onUnmounted(() => {
  document.title = previousTitle
  if (metaDescription) {
    metaDescription.setAttribute('content', previousDescription)
  }
})
</script>

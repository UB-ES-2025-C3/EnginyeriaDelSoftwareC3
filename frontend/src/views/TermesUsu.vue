<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-gray-100 flex flex-col">
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
          <p class="text-sm uppercase tracking-widest text-purple-400 mb-2">Condicions legals</p>
          <h1 class="text-4xl md:text-5xl font-extrabold text-white">Termes d'ús</h1>
          <p class="text-gray-400 mt-4">
            Llegeix amb atenció aquestes condicions abans d'utilitzar CheckPoint. Fer servir la plataforma implica
            l'acceptació íntegra dels termes descrits a continuació.
          </p>
        </header>

        <div class="bg-gray-900/60 border border-gray-800 rounded-3xl shadow-2xl divide-y divide-gray-800">
          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Acceptació dels Termes</h2>
            <p>
              L'accés i ús de CheckPoint implica que acceptes aquests Termes d'ús i qualsevol norma addicional que s'hi
              publiqui. Si no hi estàs d'acord, has de deixar d'utilitzar el servei.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Descripció del Servei</h2>
            <p>
              CheckPoint ofereix un espai per descobrir, puntuar i comentar videojocs. El servei es proporciona tal com
              és, amb possibles limitacions d'accés, funcionalitats en evolució i actualitzacions periòdiques.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Compte d'usuari i seguretat</h2>
            <p>
              En registrar-te, garanteixes que la informació facilitada és veraç i actualitzada. Ets responsable de
              preservar la confidencialitat de les teves credencials i de qualsevol activitat que es realitzi des del
              teu
              compte. Notifica'ns immediatament qualsevol accés no autoritzat.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Normes d'ús</h2>
            <ul class="list-disc pl-6 space-y-2 text-gray-300">
              <li>No utilitzis la plataforma per difondre contingut il·lícit, ofensiu o que vulneri drets de tercers.
              </li>
              <li>No interfereixis en el funcionament del servei ni executis activitats que en comprometin la seguretat.
              </li>
              <li>Respecta la comunitat i evita qualsevol comportament abusiu, assetjament o llenguatge discriminatori.
              </li>
            </ul>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Contingut d'usuari</h2>
            <p>
              En publicar contingut, concedeixes a CheckPoint una llicència mundial, no exclusiva i gratuïta per
              emmagatzemar,
              mostrar i distribuir aquest material dins del servei. Ens reservem el dret de moderar o retirar contingut
              que
              incompleixi les normes.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Propietat intel·lectual</h2>
            <p>
              Les marques, logotips, codi i materials del servei són propietat de CheckPoint o de tercers amb llicència.
              No es permet fer-los servir sense autorització expressa, excepte per l'ús estrictament personal del
              servei.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Limitació de responsabilitat</h2>
            <p>
              CheckPoint es proporciona "tal qual" i no garantim la disponibilitat ininterrompuda ni l'absència
              d'errors.
              No serem responsables de danys indirectes, pèrdues de dades o danys derivats de l'ús del servei.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Suspensió i terminació</h2>
            <p>
              Podem suspendre o tancar comptes que incompleixin greument aquests termes, que amenacin la seguretat del
              servei
              o que hagin estat inactius durant períodes prolongats, prèvia notificació quan sigui possible.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Modificacions dels Termes</h2>
            <p>
              Podem actualitzar aquests Termes per adaptar-nos a canvis legals o operatius. Comunicarem les
              modificacions
              rellevants i indicarem la data d'actualització perquè puguis revisar-les.
            </p>
            <p class="text-gray-400 text-sm">Darrera actualització: 1 de desembre de 2025.</p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Llei aplicable i jurisdicció</h2>
            <p>
              Els presents Termes es regeixen per la legislació vigent a Espanya i qualsevol controvèrsia es sotmetrà
              als
              jutjats i tribunals de Barcelona, excepte quan la normativa de consum estableixi una altra cosa.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Contacte</h2>
            <p>
              Si tens dubtes legals o vols exercir algun dret, escriu-nos a
              <span class="text-white font-medium">legal@checkpoint.app</span>.
            </p>
          </section>
        </div>
      </div>
    </section>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import FooterComponent from '@/components/FooterComponent.vue'
import NavBarComponent from '@/components/NavBarComponent.vue'

const pageTitle = "Termes d'ús | CheckPoint";
const description =
  'Consulta les condicions de CheckPoint sobre acceptació del servei, normes d’ús i responsabilitats.';

let previousTitle = document.title;
let previousDescription = '';
let metaDescription: HTMLMetaElement | null = null;

onMounted(() => {
  previousTitle = document.title;
  document.title = pageTitle;

  metaDescription = document.querySelector('meta[name=\"description\"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  previousDescription = metaDescription?.getAttribute('content') || '';
  metaDescription?.setAttribute('content', description);
});

onUnmounted(() => {
  document.title = previousTitle;
  if (metaDescription) {
    metaDescription.setAttribute('content', previousDescription);
  }
});
</script>

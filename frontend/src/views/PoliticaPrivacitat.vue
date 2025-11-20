<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-950 to-black text-gray-100 flex flex-col">
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
              Ens pots contactar per qualsevol consulta a <span class="text-white font-medium">privacy@checkpoint.app</span>.
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
            <p>Pots exercir els teus drets en qualsevol moment escrivint-nos a <span class="text-white font-medium">privacy@checkpoint.app</span>:</p>
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
              Per dubtes o reclamacions, escriu-nos a <span class="text-white font-medium">privacy@checkpoint.app</span>.
              També pots adreçar-te a l'autoritat de control corresponent si consideres que no hem respost adequadament.
            </p>
          </section>

          <section class="p-8 space-y-2">
            <h2 class="text-2xl font-semibold text-white">Data d'entrada en vigor</h2>
            <p class="text-gray-300">
              Aquesta política és vigent des de l'1 de desembre de 2025 i s'actualitzarà quan hi hagi canvis significatius.
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

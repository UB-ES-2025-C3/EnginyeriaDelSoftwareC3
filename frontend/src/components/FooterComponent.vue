<template>
  <footer class="bg-gray-900 border-t border-gray-800 mt-20">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        <!-- CheckPoint -->
        <div class="flex flex-col">
          <h4 class="font-semibold mb-4 text-white flex items-center gap-2">
            CheckPoint
          </h4>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/cataleg" class="text-gray-400 hover:text-white transition-colors">La teva plataforma de
                confiança per descobrir, valorar i compartir els teus jocs preferits.</router-link>
            </li>
          </ul>
        </div>


        <!-- Explorar -->
        <div class="flex flex-col">
          <h4 class="font-semibold mb-4 text-white flex items-center gap-2">
            Explorar
          </h4>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/cataleg" class="text-gray-400 hover:text-white transition-colors">Catàleg</router-link>
            </li>

            <template v-if="showUpcomingFeatures">
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors">Novetats</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors">Més valorats</a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors">Pròxims llançaments</a>
              </li>
            </template>
          </ul>
        </div>

        <!-- Comunitat -->
        <div class="flex flex-col">
          <h4 class="font-semibold mb-4 text-white flex items-center gap-2">
            Comunitat
          </h4>
          <ul class="space-y-2 text-sm">

            <li>
              <router-link to="/reviews"
                class="text-gray-400 hover:text-white transition-colors">Ressenyes</router-link>
            </li>
            <template v-if="showUpcomingFeatures">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Fòrum</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Esdeveniments</a></li>
            </template>
            <li>
              <a href="https://discord.gg/Xrzh5J8FTm" target="_blank" rel="noopener noreferrer"
                class="text-gray-400 hover:text-white transition-colors">
                Discord
              </a>
            </li>
          </ul>
        </div>


        <!-- Suport -->
        <div class="flex flex-col">
          <h4 class="font-semibold mb-4 text-white flex items-center gap-2">
            Suport
          </h4>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/faqs" class="text-gray-400 hover:text-white transition-colors">FAQS</router-link>
            </li>
            <li>
              <router-link to="/contacte"
                class="text-gray-400 hover:text-white transition-colors">Contacte</router-link>
            </li>
            <li>
              <router-link to="/privacitat" class="text-gray-400 hover:text-white transition-colors">Política de
                privacitat</router-link>
            </li>
            <li>
              <router-link to="/termes" class="text-gray-400 hover:text-white transition-colors">Termes
                d'ús</router-link>
            </li>
          </ul>
        </div>

      </div>

      <!-- Footer bottom -->
      <div
        class="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400 flex flex-col gap-4 md:flex-row md:items-center md:justify-between justify-center">
        <p class="text-center w-full">&copy; 2025 CheckPoint. Tots els drets reservats.</p>
      </div>

    </div>
  </footer>
</template>
<script setup lang="ts">
const showUpcomingFeatures = false;
</script>

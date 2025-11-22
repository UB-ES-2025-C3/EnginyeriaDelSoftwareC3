<template>
  <footer class="bg-gray-900 border-t border-gray-800 mt-20">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        <!-- CheckPoint -->
        <div class="flex flex-col justify-between">
          <h3 class="font-bold text-lg mb-4 text-white">CheckPoint</h3>
          <p class="text-gray-400 text-sm">
            La teva plataforma de confiança per descobrir, valorar i compartir els teus jocs preferits.
          </p>
        </div>

        <!-- Explorar -->
        <div class="flex flex-col">
          <h4 class="font-semibold mb-4 text-white flex items-center gap-2">
            <!-- Icona llibre -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20l9-5-9-5-9 5 9 5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12l9-5-9-5-9 5 9 5z" />
            </svg>
            Explorar
          </h4>
          <ul class="space-y-2 text-sm">
            <router-link to="/cataleg">
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Catàleg</a></li>
            </router-link>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Novetats</a></li>
          </ul>
        </div>

        <!-- Comunitat -->
        <div class="flex flex-col">
          <h4 class="font-semibold mb-4 text-white flex items-center gap-2">
            <!-- Icona comunitat -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" />
              <circle cx="12" cy="7" r="4" stroke-width="2" stroke="currentColor" fill="none" />
            </svg>
            Comunitat
          </h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Ressenyes</a></li>
            <li>
              <a href="https://discord.gg/Xrzh5J8FTm" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors">
                Discord
              </a>
            </li>
          </ul>
        </div>

        <!-- Suport -->
        <div class="flex flex-col">
          <h4 class="font-semibold mb-4 text-white flex items-center gap-2">
            <!-- Icona suport -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
            </svg>
            Suport
          </h4>
          <ul class="space-y-2 text-sm">
            <router-link to="/faqs">
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">FAQS</a></li>
            </router-link>
            <router-link to="/contacte">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Contacte</a></li>
            </router-link>
          </ul>
        </div>

      </div>

      <!-- Footer bottom -->
      <div class="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p class="text-center md:text-left">&copy; 2025 CheckPoint. Tots els drets reservats.</p>
        <div class="flex items-center justify-center gap-6 text-center">
          <a href="#" class="hover:text-white transition-colors">Termes d'ús</a>
          <router-link to="/termes" class="hover:text-white transition-colors">Termes d'ús</router-link>
          <router-link to="/privacitat" class="hover:text-white transition-colors">Política de privacitat</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts"></script>

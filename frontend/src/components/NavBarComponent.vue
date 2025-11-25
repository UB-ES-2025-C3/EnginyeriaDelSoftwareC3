<template>
  <nav class="hidden lg:flex items-center gap-6">
    <router-link to="/reviews"
      class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium whitespace-nowrap">
      <span class="text-sm">👥</span> Comunitat
    </router-link>
    <router-link to="/contacte"
      class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium whitespace-nowrap">
      <span class="text-sm">❓</span> Contacte
    </router-link>
  </nav>
</template>

<script setup lang="ts"></script>

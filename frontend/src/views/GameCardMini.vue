<!-- src/components/GameCardMini.vue -->
<template>
  <router-link
    :to="`/game/${id}`"
    class="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
    style="width: 200px; height: 280px;"
  >
    <div class="relative w-full h-full bg-gray-900">
      <img
        :src="image"
        :alt="name"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div class="absolute bottom-0 left-0 right-0 p-3 text-center">
        <h3 class="text-sm font-bold text-white drop-shadow-md truncate">
          {{ name }}
        </h3>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  id: { type: [String, Number], required: true },
  image: { type: String, required: true },
  name: { type: String, required: true }
})
</script>

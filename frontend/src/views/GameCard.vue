<!-- src/views/GameCard.vue -->
<template>
  <div class="relative w-full max-w-md mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl">
    <!-- Imatge de fons -->
    <div class="relative h-64">
      <img :src="image" :alt="name" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent"></div>
    </div>

    <!-- Contingut sobre la imatge -->
    <div class="absolute -mt-15 left-0 right-0 p-6 text-white">
      <h2 class="text-3xl font-bold tracking-wider drop-shadow-2xl">
        {{ name }}
      </h2>
      <p class="mt-2 text-sm opacity-90">
        {{ genre }} · {{ year }} · {{ platform }}
      </p>
      <router-link
        :disabled="`/game/${id}`"
        class="text-sm mt-2 inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded-full shadow-lg transition sm:py-2 sm:px-3 sm:text-sm sm:shadow-lg"
      >
        Visualitza detalls
      </router-link>
    </div>

    <!-- Ressenyes recents -->
    <div class="mt-4 p-6 text-white">
      <h3 class="text-xl font-bold mt-10 mb-4">Ressenyes recents</h3>
      <div v-for="(review, i) in reviews" :key="i" class="flex items-start gap-3 mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-1">
            <Star v-for="n in review.stars" :key="n" class="w-3 h-3 fill-yellow-400" />
            <Star v-for="n in (5 - review.stars)" :key="'empty'+n" class="w-3 h-3 fill-gray-600" />
          </div>
          <p class="mt-1 text-sm leading-relaxed">{{ review.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Star from '@/components/icons/Star.vue'

defineProps({
  id: Number,
  image: String,
  name: String,
  genre: String,
  year: Number,
  platform: String,
  reviews: Array
})
</script>

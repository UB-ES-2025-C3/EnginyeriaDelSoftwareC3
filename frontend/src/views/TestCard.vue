<!-- src/views/TestCard.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4l font-bold text-white text-center mb-5">
        Exemple de GameCard
      </h1>

      <!-- LA TEVA CARD AQUÍ -->
      <GameCard
        :id="1"
        image="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/header.jpg?t=1750909504"
        name="God of War Ragnarök"
        genre="Acció"
        year="2022"
        platform="PS5"
        :reviews="reviews"
      />
    </div>
  </div>
</template>

<script setup>
import GameCard from '@/views/GameCard.vue'

const reviews = [
  { stars: 5, text: 'Una gran seqüela que millora en gairebé tots aspectes. Molt recomanable.' },
  { stars: 4, text: 'Excel·lent combat i narració. Els gràfics són impressionants!' },
  { stars: 3, text: 'Increïble experiència de joc, tot i que una mica massa continuista.' }
]
</script>

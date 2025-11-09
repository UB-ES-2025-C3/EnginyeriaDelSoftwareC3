<!-- src/views/Cataleg.vue -->
<template>
  <div class="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 text-white">
    <!-- FONS AMB IMATGE GRAN (com a la targeta) -->
    <div class="relative h-96 overflow-hidden">
      <img
        src="https://images.igdb.com/igdb/image/upload/t_1080p_2x/co5vmg.jpg"
        alt="God of War Ragnarök"
        class="w-full h-full object-cover opacity-30"
      />
      <div class="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent"></div>

      <!-- TÍTOL SUPERPOSAT -->
      <div class="absolute bottom-0 left-0 right-0 p-8 text-center">
        <h1 class="text-5xl md:text-7xl font-black tracking-tight drop-shadow-2xl bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Catàleg de Jocs
        </h1>
        <p class="mt-4 text-lg md:text-xl opacity-90">Descobreix els millors títols de la comunitat</p>
      </div>
    </div>

    <!-- GRID DE TARGETES -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <GameCard
          v-for="game in games"
          :key="game.id"
          :id="game.id"
          :image="game.image"
          :name="game.name"
          :genre="game.genre"
          :year="game.year"
          :platform="game.platform"
          :reviews="game.reviews"
        />
      </div>

      <!-- Missatge si no hi ha jocs -->
      <div v-if="games.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg">No s'han trobat jocs. Prova més tard!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted  } from 'vue'
import GameCard from '@/views/GameCardMini.vue'
import { api } from '@/services/api'

// Array pels jocs
const games = ref([])

onMounted(async () => {
  try {
    const data = await api.getGames()
    console.log('Jocs obtinguts del backend:', data)

    // 🔹 Adaptar el format del backend al del component GameCard
    games.value = data.map(g => ({
      id: g._id,                 // backend usa "_id"
      image: g.image,
      name: g.name,
      genre: g.genre,
      year: Number(g.year),      // per si ve com string
      platform: g.platform,
      reviews: g.reviews || []
    }))
  } catch (err) {
    console.error('Error carregant jocs del backend:', err)
  }
})
</script>

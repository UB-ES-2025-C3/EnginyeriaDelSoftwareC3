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
import { ref } from 'vue'
import GameCard from '@/views/GameCardMini.vue'

// DADES REALS (amb imatges verificades)
const games = ref([
  {
    id: 1,
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/header.jpg?t=1750909504',
    name: 'God of War Ragnarök',
    genre: 'Acció',
    year: 2022,
    platform: 'PS5',
    reviews: [
      { stars: 5, text: 'Una obra mestra. Millor que l\'original en tots els sentits.' },
      { stars: 4, text: 'Combat fluid i història captivadora. Gràfics de nova generació.' }
    ]
  },
  {
    id: 2,
    image: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1wzo.jpg',
    name: 'The Legend of Zelda: Breath of the Wild',
    genre: 'Aventura',
    year: 2017,
    platform: 'Switch',
    reviews: [
      { stars: 5, text: 'El millor joc open-world de la història. Llibertat total.' },
      { stars: 5, text: 'Una experiència màgica que redefineix el gènere.' }
    ]
  },
  {
    id: 3,
    image: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co4b7v.jpg',
    name: 'Hades',
    genre: 'Roguelike',
    year: 2020,
    platform: 'PC',
    reviews: [
      { stars: 5, text: 'Addictiu, divertit i amb una història sorprenent.' },
      { stars: 4, text: 'El millor roguelike modern. Música i art espectaculars.' }
    ]
  },
  {
    id: 4,
    image: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1wyy.jpg',
    name: 'Cyberpunk 2077',
    genre: 'RPG',
    year: 2020,
    platform: 'PC',
    reviews: [
      { stars: 4, text: 'Un món increïble. La història principal és brutal.' },
      { stars: 3, text: 'Tècnicament millorable, però l\'ambient és únic.' }
    ]
  }
])
</script>

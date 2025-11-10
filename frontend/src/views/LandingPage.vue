<template>
  <section
    class="min-h-screen flex flex-col text-white px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 relative overflow-hidden"
    style="background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%), linear-gradient(to bottom, #18181b, #000);"
  >
    <!-- CAPTION TEXT - Top Left -->
    <div class="mb-8 sm:mb-12 md:mb-auto">
      <p class="text-xs sm:text-sm md:text-base text-white font-bold uppercase tracking-wide">
        Checkpoint
      </p>
    </div>

    <!-- MAIN CONTENT - Centered -->
    <div class="flex flex-col md:flex-row items-center justify-between flex-1 gap-6 sm:gap-8 md:gap-12 lg:gap-16 max-w-7xl mx-auto w-full">
      <!-- LEFT TEXT -->
      <div class="flex-1 space-y-4 sm:space-y-6 md:space-y-8 text-center md:text-left">
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight">
          El teu món<br />
          <span class="text-gray-300">gamer comença!</span>
        </h1>

        <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-lg mx-auto md:mx-0">
          El teu espai per descobrir, compartir i viure el gaming.
        </p>
      </div>

      <!-- RIGHT IMAGE -->
      <div class="flex-1 flex justify-center md:justify-end">
        <img
          :src="marioImage"
          alt="Pixel Mario"
          class="w-48 sm:w-64 md:w-80 lg:w-96 xl:w-[450px] md:mr-0 lg:mr-[-50px]"
        />
      </div>
    </div>

    <!-- BUTTONS - Bottom Right -->
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8 justify-center md:justify-end mt-8 sm:mt-12 md:mt-auto relative left-0 top-0 sm:left-0 sm:top-0 md:-left-10 md:-top-[60px] lg:-left-[67px] lg:-top-[84px]">
        <button
          @click="$router.push('/login')"
          class="px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 text-sm sm:text-base border-2 border-gray-600 rounded-xl hover:bg-gray-800 transition-all font-semibold uppercase tracking-wide whitespace-nowrap"
        >
          Iniciar sessió/Registrar-se
        </button>
        <button
          @click="$router.push('/Cataleg')"
          class="px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 text-sm sm:text-base border-2 border-gray-600 rounded-xl hover:bg-gray-800 transition-all font-semibold uppercase tracking-wide whitespace-nowrap"
        >
          Accedeix com a convidat
        </button>
    </div>
  </section>
</template>

<script setup>
import marioImage from '@/assets/rotatingmario.gif';
</script>

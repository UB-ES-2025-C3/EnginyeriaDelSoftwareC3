<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :class="props.fill">
    <path d="M12 .587l3.668 7.431 8.332 1.209-6 5.85 1.416 8.262L12 19.897l-7.416 3.896L6 15.527l-6-5.85 8.332-1.209L12 .587z"/>
  </svg>
</template>
<script setup>
const props = defineProps({ fill: String })
</script>

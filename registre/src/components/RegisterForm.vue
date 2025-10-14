<script setup>
import { ref } from 'vue'
import InputField from './InputField.vue'

const name = ref('')
const email = ref('')

const emailError = ref('')
const successMessage = ref('')

const validateEmail = (value) => /\S+@\S+\.\S+/.test(value)

async function register() {
  // Reset errors i missatge d’èxit
  emailError.value = ''
  successMessage.value = ''

  let valid = true

  // Validació local
  if (!validateEmail(email.value)) {
    emailError.value = 'Correu electrònic no vàlid'
    email.value = ''
    valid = false
  }

  // Si hi ha errors → esborrem els camps i sortim
  if (!valid) {
    name.value = ''
    email.value = ''
    return
  }

  // Registre exitós
  successMessage.value = 'Compte creat correctament! 🎉'

  name.value = ''
  email.value = ''
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-900">
    <form @submit.prevent="register" class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
      <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Registre d'usuari</h2>

      <InputField v-model="name" label="Nom complet" />
      <InputField v-model="email" label="Correu electrònic" type="email" :error="emailError" />

      <button type="submit"
        class="bg-blue-600 text-white w-full py-3 mt-6 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 shadow-lg">
        Registrar-se
      </button>

      <p v-if="successMessage" class="text-green-600 mt-4 text-center">{{ successMessage }}</p>
    </form>
  </div>
</template>

<style scoped>
form {
  background-color: rgba(255, 255, 255, 0.95);
}
</style>

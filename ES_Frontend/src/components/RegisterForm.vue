<script setup>
import { ref } from 'vue'
import axios from 'axios'
import InputField from './InputField.vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const emailError = ref('')
const passwordError = ref('')
const confirmError = ref('')
const successMessage = ref('')

const validateEmail = (value) => /\S+@\S+\.\S+/.test(value)

async function register() {
    // Reset errors i missatge d’èxit
    emailError.value = ''
    passwordError.value = ''
    confirmError.value = ''
    successMessage.value = ''

    let valid = true

    // Validació local
    if (!validateEmail(email.value)) {
        emailError.value = 'Correu electrònic no vàlid'
        valid = false
    }
    if (!password.value || password.value.length < 8) {
        passwordError.value = 'La contrasenya ha de tenir almenys 8 caràcters'
        valid = false
    }
    if (password.value !== confirmPassword.value) {
        confirmError.value = 'Les contrasenyes no coincideixen!'
        valid = false
    }
    if (!valid) return

    // Crida a l’API amb axios
    try {
        const response = await axios.post('/api/register', {
            name: name.value,
            email: email.value,
            password: password.value
        })

        // Registre exitós
        successMessage.value = 'Compte creat correctament! 🎉'

        // Netejar camps
        name.value = ''
        email.value = ''
        password.value = ''
        confirmPassword.value = ''
    } catch (err) {
        if (err.response?.data?.error === 'EMAIL_EXISTS') {
            emailError.value = 'Aquest correu ja està en ús'
        } else {
            alert('Error desconegut al registrar el compte')
        }
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-blue-900">
        <form @submit.prevent="register" class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
            <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Registre d'usuari</h2>

            <InputField v-model="name" label="Nom complet" />
            <InputField v-model="email" label="Correu electrònic" type="email" :error="emailError" />
            <InputField v-model="password" label="Contrasenya" type="password" :error="passwordError" />
            <InputField v-model="confirmPassword" label="Confirma la contrasenya" type="password"
                :error="confirmError" />

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

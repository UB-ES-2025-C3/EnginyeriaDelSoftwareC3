<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
    label: String,
    modelValue: String,
    type: {
        type: String,
        default: 'text'
    },
    error: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])

function onInput(event) {
    emit('update:modelValue', event.target.value)
}

// Genera un ID únic basat en el label
const inputId = computed(() => {
    return 'input-' + props.label.toLowerCase().replace(/\s+/g, '-')
})
</script>

<template>
    <div class="mb-3">
        <label :for="inputId" class="block mb-1 font-medium">{{ label }}</label>
        <input :id="inputId" :type="type" :value="modelValue" @input="onInput" class="border rounded px-3 py-2 w-full"
            :class="{ 'border-red-500': error }" />
        <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    </div>
</template>

<style scoped>
input {
    outline: none;
}

input.border-red-500 {
    border-color: #ef4444;
}
</style>

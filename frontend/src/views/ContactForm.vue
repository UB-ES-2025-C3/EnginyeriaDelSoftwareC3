<!-- src/views/ContactForm.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-t from-gray-900 to-black text-white">
    <header class="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg">
      <div class="w-full px-6 py-4">
        <div class="grid grid-cols-3 items-center gap-4">
          <!-- IZQUIERDA: Logo y navegación -->
          <div class="flex items-center gap-6">
            <router-link to="/cataleg" class="flex items-center gap-2">
              <div class="w-8 h-8 flex items-center justify-center">
                <img src="../assets/staticlogo.png" alt="Home" class="w-5 h-auto" />
              </div>
              <span class="font-bold text-xl hidden sm:block">CheckPoint</span>
            </router-link>

            <NavBarComponent />
          </div>

          <!-- CENTRO: Buscador -->
          <div class="relative">
            <div class="relative max-w-lg mx-auto">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input type="text" placeholder="Buscar jocs..." v-model="searchQuery" @input="handleSearch"
                @focus="showSearchDropdown = searchQuery.length > 0" @blur="hideDropdown"
                class="w-full bg-gray-800 border border-gray-700 rounded-full pl-12 pr-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-gray-750" />
            </div>

            <!-- Dropdown de búsqueda -->
            <div v-if="showSearchDropdown && filteredGames.length > 0"
              class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
              <router-link v-for="game in filteredGames" :key="game.id" :to="`/game/${game.id}`"
                class="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                @click="closeDropdown">
                <img :src="game.image" :alt="game.name" class="w-12 h-16 object-cover rounded" />
                <div class="flex-1">
                  <p class="font-semibold text-white">{{ game.name }}</p>
                  <p class="text-xs text-gray-400">{{ game.genre }} • {{ game.year }}</p>
                </div>
              </router-link>
            </div>

            <!-- Mensaje cuando no hay resultados -->
            <div v-if="showSearchDropdown && searchQuery && filteredGames.length === 0"
              class="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-lg mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 text-center text-gray-400 z-50">
              No s'han trobat jocs.
            </div>
          </div>

          <!-- DERECHA: User actions -->
          <div class="flex items-center justify-end gap-4">
            <!-- Avatar del usuario -->
            <router-link v-if="isLoggedIn" to="/perfil"
              class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors overflow-hidden border-2 border-gray-700 hover:border-purple-500"
              title="Veure perfil">
              <img v-if="userAvatar" :src="userAvatar" :alt="userName" class="w-full h-full object-cover" />
              <span v-else class="text-sm font-bold">{{ userInitials }}</span>
            </router-link>

            <!-- Si no está autenticado -->
            <router-link v-else to="/login"
              class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              title="Iniciar sessió">
              <span class="text-xl">👤</span>
            </router-link>

            <!-- Botón de configuración / logout -->
            <div class="relative" ref="menuRef">
              <button @click="showMenu = !showMenu"
                class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <span class="text-xl">⚙️</span>
              </button>

              <!-- Dropdown menu -->
              <div v-if="showMenu"
                class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-2 z-50">
                <router-link v-if="isLoggedIn" to="/perfil"
                  class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  @click="showMenu = false">
                  📝 Editar perfil
                </router-link>
                <button v-if="isLoggedIn" @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  🚪 Tancar sessió
                </button>
                <router-link v-else to="/login"
                  class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  @click="showMenu = false">
                  🔑 Iniciar sessió
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido principal: Formulario de contacto -->
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl p-8 md:p-12 border border-gray-800">
        <!-- Encabezado -->
        <div class="text-center mb-10">
          <h1
            class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Contacta amb nosaltres
          </h1>
          <p class="text-gray-400 text-lg">
            La teva opinió és important per millorar CheckPoint. Comparteix les teves queixes, suggeriments o
            comentaris.
          </p>
        </div>

        <!-- Mensaje de éxito -->
        <div v-if="showSuccess"
          class="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3 animate-fade-in">
          <span class="text-2xl">✅</span>
          <div>
            <p class="font-semibold text-green-400">Missatge enviat correctament!</p>
            <p class="text-sm text-gray-300">Gràcies per posar-te en contacte amb nosaltres.</p>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="showError"
          class="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3 animate-fade-in">
          <span class="text-2xl">❌</span>
          <div>
            <p class="font-semibold text-red-400">Error a l'enviar el missatge</p>
            <p class="text-sm text-gray-300">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nombre -->
          <div>
            <label for="nombre" class="block text-sm font-semibold mb-2 text-gray-300">
              Nom complet <span class="text-red-400">*</span>
            </label>
            <input type="text" id="nombre" v-model="formData.nombre" required minlength="2" maxlength="100"
              placeholder="El teu nom"
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.nombre }" />
            <p v-if="errors.nombre" class="text-red-400 text-sm mt-1">{{ errors.nombre }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-semibold mb-2 text-gray-300">
              Correu electrònic <span class="text-red-400">*</span>
            </label>
            <input type="email" id="email" v-model="formData.email" required placeholder="exemple@correu.com"
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.email }" />
            <p v-if="errors.email" class="text-red-400 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <!-- Tipo de solicitud -->
          <div>
            <label for="tipo" class="block text-sm font-semibold mb-2 text-gray-300">
              Tipus de missatge <span class="text-red-400">*</span>
            </label>
            <select id="tipo" v-model="formData.tipo" required
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer">
              <option value="comentario">💬 Comentari general</option>
              <option value="mejora">💡 Suggeriment de millora</option>
              <option value="queja">⚠️ Queixa o problema</option>
            </select>
          </div>

          <!-- Asunto -->
          <div>
            <label for="asunto" class="block text-sm font-semibold mb-2 text-gray-300">
              Assumpte <span class="text-red-400">*</span>
            </label>
            <input type="text" id="asunto" v-model="formData.asunto" required minlength="5" maxlength="150"
              placeholder="Resum breu del teu missatge"
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.asunto }" />
            <p v-if="errors.asunto" class="text-red-400 text-sm mt-1">{{ errors.asunto }}</p>
          </div>

          <!-- Mensaje -->
          <div>
            <label for="mensaje" class="block text-sm font-semibold mb-2 text-gray-300">
              Missatge <span class="text-red-400">*</span>
            </label>
            <textarea id="mensaje" v-model="formData.mensaje" required minlength="10" maxlength="1000" rows="6"
              placeholder="Escriu aquí el teu missatge..."
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              :class="{ 'border-red-500': errors.mensaje }"></textarea>
            <div class="flex justify-between items-center mt-1">
              <p v-if="errors.mensaje" class="text-red-400 text-sm">{{ errors.mensaje }}</p>
              <p class="text-gray-500 text-sm ml-auto">{{ formData.mensaje.length }}/1000</p>
            </div>
          </div>

          <!-- ⭐ NUEVO: Archivos adjuntos -->
          <div>
            <label class="block text-sm font-semibold mb-2 text-gray-300">
              Adjuntar arxius (opcional)
            </label>
            <div class="space-y-3">
              <!-- Botón para seleccionar archivos -->
              <div class="flex items-center gap-3">
                <button type="button" @click="triggerFileInput"
                  class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  :disabled="formData.archivos.length >= 5">
                  <span class="text-xl">📎</span>
                  <span class="text-sm">Afegir arxius</span>
                </button>
                <p class="text-xs text-gray-500">
                  Max 5 arxius • Imatges fins a 5 MB • Vídeos fins a 20 MB
                </p>
              </div>

              <!-- Input oculto -->
              <input ref="fileInput" type="file" multiple
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime"
                @change="handleFileChange" class="hidden" />

              <!-- Errores de archivos -->
              <div v-if="fileErrors.length > 0" class="space-y-1">
                <p v-for="(error, index) in fileErrors" :key="index"
                  class="text-red-400 text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{{ error }}</span>
                </p>
              </div>

              <!-- Lista de archivos seleccionados -->
              <div v-if="formData.archivos.length > 0" class="space-y-2">
                <div v-for="(file, index) in formData.archivos" :key="index"
                  class="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                  <!-- Preview -->
                  <div
                    class="flex-shrink-0 w-12 h-12 bg-gray-700 rounded flex items-center justify-center overflow-hidden">
                    <img v-if="file.type.startsWith('image/')" :src="getFilePreview(file)" :alt="file.name"
                      class="w-full h-full object-cover" />
                    <span v-else class="text-2xl">🎬</span>
                  </div>

                  <!-- Info del archivo -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-white truncate">{{ file.name }}</p>
                    <p class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</p>
                  </div>

                  <!-- Botón eliminar -->
                  <button type="button" @click="removeFile(index)"
                    class="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                    title="Eliminar arxiu">
                    <span class="text-red-400">✕</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón de envío -->
          <div class="pt-4">
            <button type="submit" :disabled="isSubmitting"
              class="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span v-if="isSubmitting"
                class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span v-else>📤</span>
              <span>{{ isSubmitting ? 'Enviant...' : 'Enviar missatge' }}</span>
            </button>
          </div>
        </form>

        <!-- Información adicional -->
        <div class="mt-10 pt-8 border-t border-gray-800">
          <div class="grid md:grid-cols-3 gap-6 text-center">
            <div class="bg-gray-800/50 rounded-lg p-4">
              <span class="text-3xl mb-2 block">⚡</span>
              <h3 class="font-semibold text-white mb-1">Resposta ràpida</h3>
              <p class="text-sm text-gray-400">Responent en menys de 48h</p>
            </div>
            <div class="bg-gray-800/50 rounded-lg p-4">
              <span class="text-3xl mb-2 block">🔒</span>
              <h3 class="font-semibold text-white mb-1">Privacitat total</h3>
              <p class="text-sm text-gray-400">Les teves dades estan segures</p>
            </div>
            <div class="bg-gray-800/50 rounded-lg p-4">
              <span class="text-3xl mb-2 block">💪</span>
              <h3 class="font-semibold text-white mb-1">Millora contínua</h3>
              <p class="text-sm text-gray-400">El teu feedback ens ajuda</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'
import { auth } from '@/services/auth'
import FooterComponent from '@/components/FooterComponent.vue'
import NavBarComponent from '@/components/NavBarComponent.vue'

// Tipos
interface GameSearchResult {
  id: string
  name: string
  genre: string
  year: number
  image: string
}

interface FormData {
  nombre: string
  email: string
  tipo: 'queja' | 'mejora' | 'comentario'
  asunto: string
  mensaje: string
  archivos: File[]
}

interface FormErrors {
  nombre?: string
  email?: string
  asunto?: string
  mensaje?: string
}

// Estados de autenticación
const isLoggedIn = computed(() => !!auth.state.token && !!auth.state.user)
const userName = computed(() => auth.state.user?.name || '')
const userAvatar = computed(() => auth.state.user?.avatarUrl || '')
const userInitials = computed(() => {
  if (!auth.state.user?.name) return '?'
  const names = auth.state.user.name.trim().split(' ')
  if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase()
  return names[0][0].toUpperCase()
})

// Estados del header
const searchQuery = ref('')
const showSearchDropdown = ref(false)
const filteredGames = ref<GameSearchResult[]>([])
const showMenu = ref(false)
const menuRef = ref<HTMLDivElement | null>(null)

// Estados del formulario
const formData = ref<FormData>({
  nombre: '',
  email: '',
  tipo: 'comentario',
  asunto: '',
  mensaje: '',
  archivos: []
})

const errors = ref<FormErrors>({})
const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')

// Estados para archivos
const fileInput = ref<HTMLInputElement | null>(null)
const fileErrors = ref<string[]>([])

const router = useRouter()

// Funciones del header
const handleSearch = () => {
  showSearchDropdown.value = searchQuery.value.length > 0
}

const hideDropdown = () => {
  setTimeout(() => {
    showSearchDropdown.value = false
  }, 200)
}

const closeDropdown = () => {
  showSearchDropdown.value = false
  searchQuery.value = ''
}

const handleLogout = () => {
  auth.logout()
  showMenu.value = false
  router.push('/login')
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (menuRef.value && !menuRef.value.contains(target)) {
    showMenu.value = false
  }
}

// ⭐ NUEVAS FUNCIONES PARA MANEJAR ARCHIVOS

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files || files.length === 0) return

  fileErrors.value = []

  // Validar número de archivos
  const totalFiles = formData.value.archivos.length + files.length
  if (totalFiles > 5) {
    fileErrors.value.push(`Només pots pujar un màxim de 5 arxius. Actualment tens ${formData.value.archivos.length}.`)
    return
  }

  // Validar cada archivo
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB
  const MAX_VIDEO_SIZE = 20 * 1024 * 1024 // 20 MB

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    // Validar tipo
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      fileErrors.value.push(`"${file.name}" no és un tipus d'arxiu vàlid.`)
      continue
    }

    // Validar tamaño
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      fileErrors.value.push(`La imatge "${file.name}" supera els 5 MB.`)
      continue
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      fileErrors.value.push(`El vídeo "${file.name}" supera els 20 MB.`)
      continue
    }

    // Añadir archivo válido
    formData.value.archivos.push(file)
  }

  // Limpiar input
  if (target) target.value = ''
}

const removeFile = (index: number) => {
  formData.value.archivos.splice(index, 1)
  fileErrors.value = []
}

const getFilePreview = (file: File): string => {
  return URL.createObjectURL(file)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Validación del formulario
const validateForm = (): boolean => {
  errors.value = {}

  if (formData.value.nombre.trim().length < 2) {
    errors.value.nombre = 'El nom ha de tenir almenys 2 caràcters'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email)) {
    errors.value.email = 'Introdueix un correu electrònic vàlid'
  }

  if (formData.value.asunto.trim().length < 5) {
    errors.value.asunto = "L'assumpte ha de tenir almenys 5 caràcters"
  }

  if (formData.value.mensaje.trim().length < 10) {
    errors.value.mensaje = 'El missatge ha de tenir almenys 10 caràcters'
  }

  return Object.keys(errors.value).length === 0
}

// Envío del formulario con archivos
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  showSuccess.value = false
  showError.value = false

  try {
    // Crear FormData para enviar archivos
    const submitData = new FormData()
    submitData.append('nombre', formData.value.nombre)
    submitData.append('email', formData.value.email)
    submitData.append('tipo', formData.value.tipo)
    submitData.append('asunto', formData.value.asunto)
    submitData.append('mensaje', formData.value.mensaje)

    // Añadir archivos
    formData.value.archivos.forEach((file) => {
      submitData.append('archivos', file)
    })

    // Llamada a la API
    await api.createSolicitudWithFiles(submitData)

    // Mostrar mensaje de éxito
    showSuccess.value = true

    // Limpiar formulario
    formData.value = {
      nombre: '',
      email: '',
      tipo: 'comentario',
      asunto: '',
      mensaje: '',
      archivos: []
    }
    fileErrors.value = []

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Ocultar mensaje de éxito después de 5 segundos
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)

  } catch (error: any) {
    console.error('Error al enviar solicitud:', error)
    showError.value = true
    errorMessage.value = error?.message || 'No s\'ha pogut enviar el missatge. Si us plau, intenta-ho de nou.'

    // Ocultar mensaje de error después de 5 segundos
    setTimeout(() => {
      showError.value = false
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // Pre-rellenar email si el usuario está autenticado
  if (auth.state.user?.email) {
    formData.value.email = auth.state.user.email
  }
  if (auth.state.user?.name) {
    formData.value.nombre = auth.state.user.name
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)

  // Limpiar URLs de preview
  formData.value.archivos.forEach(file => {
    URL.revokeObjectURL(getFilePreview(file))
  })
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>

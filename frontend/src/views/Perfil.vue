<template>
  <section
    class="min-h-screen text-white px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 relative overflow-hidden"
    style="background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%), linear-gradient(to bottom, #18181b, #000);"
  >
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8 sm:mb-12">
        <p class="text-xs sm:text-sm text-white font-bold uppercase tracking-wide mb-2">
          Checkpoint
        </p>
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-2">El Meu Perfil</h2>
        <p class="text-gray-400 text-sm sm:text-base">Personalitza la teva informació</p>
      </div>

      <form @submit.prevent="handleSave" class="space-y-8 sm:space-y-10">
        <!-- Banner -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-300 uppercase tracking-wide">Imatge de portada</label>

          <div class="h-40 sm:h-48 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center bg-gray-900/30 overflow-hidden">
            <img v-if="bannerPreview" :src="bannerPreview" alt="Previsualització portada" class="w-full h-full object-cover" />
            <span v-else class="text-gray-500 text-sm">Sense imatge de portada</span>
          </div>

          <input ref="bannerInput" type="file" accept="image/png,image/jpeg" class="hidden" @change="onSelectBanner" />
          <div class="flex gap-3">
            <button type="button" class="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-800 transition-all font-semibold uppercase tracking-wide" @click="bannerInput?.click()">Canviar portada</button>
            <button v-if="bannerPreview" type="button" class="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-800 transition-all font-semibold uppercase tracking-wide" @click="clearBanner">Treure</button>
          </div>
          <small class="text-xs text-gray-500">JPG/PNG, màx 2 MB</small>
        </div>

        <!-- Avatar -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-300 uppercase tracking-wide">Avatar</label>
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-gray-600 overflow-hidden flex items-center justify-center bg-gray-800">
              <img v-if="avatarPreview" :src="avatarPreview" alt="Previsualització avatar" class="w-full h-full object-cover" />
              <span v-else class="text-3xl sm:text-4xl font-bold">{{ name.charAt(0).toUpperCase() || 'P' }}</span>
            </div>

            <div class="flex gap-3">
              <input ref="avatarInput" type="file" accept="image/png,image/jpeg" class="hidden" @change="onSelectAvatar" />
              <button type="button" class="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-800 transition-all font-semibold uppercase tracking-wide" @click="avatarInput?.click()">Canviar avatar</button>
              <button v-if="avatarPreview" type="button" class="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-800 transition-all font-semibold uppercase tracking-wide" @click="clearAvatar">Treure</button>
            </div>
          </div>
          <small class="text-xs text-gray-500">JPG/PNG, màx 2 MB</small>
        </div>

        <!-- Basic Information -->
        <div class="space-y-6">
          <h3 class="text-2xl sm:text-3xl font-bold border-b border-gray-700 pb-3">Informació bàsica</h3>
          
          <div class="space-y-2">
            <label for="name" class="block text-sm font-semibold text-gray-300 uppercase tracking-wide">Nom d'usuari</label>
            <input
              id="name"
              v-model.trim="name"
              type="text"
              placeholder="El teu nom"
              :class="{ 'border-red-500': !!nameError }"
              class="w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-all"
              aria-describedby="name-help"
            />
            <small id="name-help" class="text-xs text-gray-500">El nom no pot estar buit (màx 60 caràcters).</small>
            <p v-if="nameError" class="text-red-400 text-sm" aria-live="assertive">{{ nameError }}</p>
          </div>

          <div class="space-y-2">
            <label for="bio" class="block text-sm font-semibold text-gray-300 uppercase tracking-wide">Biografia</label>
            <textarea
              id="bio"
              v-model="bio"
              placeholder="Explica'ns una mica sobre tu..."
              maxlength="250"
              class="w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-all min-h-[100px] resize-vertical"
            ></textarea>
            <div class="flex justify-end">
              <span :class="bio.length >= 240 ? 'text-yellow-400' : 'text-gray-500'" class="text-xs">
                {{ bio.length }}/250
              </span>
            </div>
          </div>

          <div class="space-y-2">
            <label for="email" class="block text-sm font-semibold text-gray-300 uppercase tracking-wide">Correu electrònic</label>
            <input
              id="email"
              v-model="email"
              type="email"
              disabled
              class="w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-xl text-gray-500 opacity-60 cursor-not-allowed"
            />
            <small class="text-xs text-gray-500">El correu no es pot modificar.</small>
          </div>
        </div>

        <!-- Gaming Links -->
        <div class="space-y-6">
          <h3 class="text-2xl sm:text-3xl font-bold border-b border-gray-700 pb-3">Enllaços de Gaming</h3>
          
          <div class="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div class="space-y-2">
              <label for="steam" class="block text-sm font-semibold text-gray-300 uppercase tracking-wide">Steam (URL)</label>
              <input
                id="steam"
                v-model="links.steam"
                type="url"
                placeholder="https://steamcommunity.com/..."
                class="w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>

            <div class="space-y-2">
              <label for="twitch" class="block text-sm font-semibold text-gray-300 uppercase tracking-wide">Twitch (URL)</label>
              <input
                id="twitch"
                v-model="links.twitch"
                type="url"
                placeholder="https://twitch.tv/..."
                class="w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>

            <div class="space-y-2">
              <label for="psn" class="block text-sm font-semibold text-gray-300 uppercase tracking-wide">PSN ID</label>
              <input
                id="psn"
                v-model="links.psn"
                type="text"
                placeholder="El teu ID de PSN"
                class="w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>

            <div class="space-y-2">
              <label for="xbox" class="block text-sm font-semibold text-gray-300 uppercase tracking-wide">Xbox Gamertag</label>
              <input
                id="xbox"
                v-model="links.xbox"
                type="text"
                placeholder="El teu Gamertag"
                class="w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-4 pt-6 border-t border-gray-700">
          <p v-if="error" class="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3 w-full sm:w-auto sm:mr-auto">
            {{ error }}
          </p>
          <p v-if="success" class="text-green-400 text-sm bg-green-900/20 border border-green-800 rounded-lg px-4 py-3 w-full sm:w-auto sm:mr-auto">
            Perfil desat correctament!
          </p>
          
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-3 text-base border border-gray-600 rounded-xl hover:bg-gray-800 transition-all font-semibold uppercase tracking-wide"
          >
            Cancel·lar
          </button>
          
          <button
            type="submit"
            :disabled="loading || !!nameError || !!bioError || (!isDirty && !hasImageChanges)"
            class="px-6 py-3 text-base border-2 border-gray-600 rounded-xl hover:bg-gray-800 transition-all font-semibold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Desant...' : 'Desar canvis' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from '@/services/api'; 
import { auth } from '@/services/auth';

type UserData = {
  name: string;
  email: string;
  bio: string;
  links: { [key: string]: string };
  avatarUrl?: string;
  bannerUrl?: string;
};
const originalData = ref<UserData | null>(null);

const name = ref('');
const email = ref('');
const bio = ref('');
const links = ref({
  steam: '',
  psn: '',
  xbox: '',
  nintendo: '',
  twitch: '',
  youtube: ''
});

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

const MAX_MB = 2;
const ALLOWED = ['image/jpeg','image/png'];

const avatarFile = ref<File | null>(null);
const bannerFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);
const bannerPreview = ref<string | null>(null);
const avatarInput = ref<HTMLInputElement | null>(null);
const bannerInput = ref<HTMLInputElement | null>(null);

const nameError = computed(() => {
  const n = (name.value || '').trim();
  if (n.length === 0) return 'El nom no pot estar buit';
  if (n.length > 60)  return 'Nom massa llarg (màx 60)';
  return '';
});

const bioError = computed(() => {
  return bio.value.length > 250 ? 'Bio massa llarga (màx 250)' : '';
});

const hasImageChanges = computed(() => !!avatarFile.value || !!bannerFile.value);

const normalize = (v: unknown) => (v ?? '') as string;
const normalizeLinks = (obj: Record<string,string> = {}) => {
  return {
    steam: normalize(obj.steam),
    psn: normalize(obj.psn),
    xbox: normalize(obj.xbox),
    nintendo: normalize(obj.nintendo),
    twitch: normalize(obj.twitch),
    youtube: normalize(obj.youtube),
  };
};

const isDirty = computed(() => {
  if (!originalData.value) return false;
  const sameName = normalize(name.value) === normalize(originalData.value.name);
  const sameBio  = normalize(bio.value)  === normalize(originalData.value.bio);
  const sameLinks = JSON.stringify(normalizeLinks(links.value)) ===
                    JSON.stringify(normalizeLinks(originalData.value.links || {}));
  return !(sameName && sameBio && sameLinks);
});

function resetForm() {
  if (!originalData.value) return;
  
  name.value = originalData.value.name;
  email.value = originalData.value.email;
  bio.value = originalData.value.bio || '';
  links.value = {
    ...links.value,
    ...originalData.value.links
  };
  
  avatarPreview.value = originalData.value.avatarUrl || null;
  bannerPreview.value = originalData.value.bannerUrl || null;

  avatarFile.value = null;
  bannerFile.value = null;
  if (avatarInput.value) avatarInput.value.value = '';
  if (bannerInput.value) bannerInput.value.value = '';

  error.value = null;
  success.value = false;
}

onMounted(async () => {
  if (!auth.state.token) return;
  loading.value = true;
  try {
    const userData = await api.getProfile(auth.state.token);
    originalData.value = JSON.parse(JSON.stringify(userData)); 
    resetForm();
  } catch (e) {
    error.value = 'No s\'ha pogut carregar el teu perfil';
  } finally {
    loading.value = false;
  }
});


function validateFile(file: File) {
  if (!ALLOWED.includes(file.type)) return 'UNSUPPORTED_FORMAT';
  if (file.size > MAX_MB * 1024 * 1024) return 'FILE_TOO_LARGE';
  return null;
}

function setPreview(kind:'avatar'|'banner', file: File) {
  const url = URL.createObjectURL(file);
  if (kind === 'avatar') { if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value); avatarPreview.value = url; avatarFile.value = file; }
  else { if (bannerPreview.value) URL.revokeObjectURL(bannerPreview.value); bannerPreview.value = url; bannerFile.value = file; }
}

function onSelectAvatar(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
  const err = validateFile(f); if (err) { error.value = err === 'FILE_TOO_LARGE' ? 'La imatge supera 2 MB' : 'Format no suportat (JPG/PNG)'; (e.target as HTMLInputElement).value=''; return; }
  error.value = null; setPreview('avatar', f);
}

function onSelectBanner(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
  const err = validateFile(f); if (err) { error.value = err === 'FILE_TOO_LARGE' ? 'La imatge supera 2 MB' : 'Format no suportat (JPG/PNG)'; (e.target as HTMLInputElement).value=''; return; }
  error.value = null; setPreview('banner', f);
}

function clearAvatar(){ if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value); avatarPreview.value=null; avatarFile.value=null; }
function clearBanner(){ if (bannerPreview.value) URL.revokeObjectURL(bannerPreview.value); bannerPreview.value=null; bannerFile.value=null; }

async function handleSave() {
  if (!auth.state.token) return;
  if (!isDirty.value && !avatarFile.value && !bannerFile.value) { error.value=null; success.value=false; return; }
  if (nameError.value || bioError.value) { error.value = nameError.value || bioError.value || 'Dades invàlides'; return; }

  loading.value = true; error.value = null; success.value = false;

  try {
    // Si hi ha fitxers es pujen
    let avatarUrl: string | undefined;
    let bannerUrl: string | undefined;
    if (avatarFile.value || bannerFile.value) {
      const fd = new FormData();
      if (avatarFile.value) fd.append('avatar', avatarFile.value);
      if (bannerFile.value) fd.append('banner', bannerFile.value);
      const media = await api.uploadProfileMedia(auth.state.token, fd);
      avatarUrl = media.avatarUrl;
      bannerUrl = media.bannerUrl;
    }

    // Desar canvis a la BBDD
    const cleanLinks = JSON.parse(JSON.stringify(links.value));
    delete cleanLinks._id;

    const payload: any = { name: name.value, bio: bio.value, links: cleanLinks };
    if (avatarUrl) payload.avatarUrl = avatarUrl;
    if (bannerUrl) payload.bannerUrl = bannerUrl;

    const updated = await api.updateProfile(auth.state.token, payload);

    originalData.value = JSON.parse(JSON.stringify(updated));
    success.value = true;

    avatarFile.value = null;
    bannerFile.value = null;
    if (avatarInput.value) avatarInput.value.value = '';
    if (bannerInput.value) bannerInput.value.value = '';

    avatarPreview.value = updated.avatarUrl || null;
    bannerPreview.value = updated.bannerUrl || null;

    setTimeout(() => (success.value = false), 2500);
  } catch (e: any) {
    error.value = e?.error || 'Error en desar el perfil';
  } finally {
    loading.value = false;
  }
}

</script>
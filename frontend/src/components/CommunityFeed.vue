<template>
  <div class="space-y-6">
    <!-- Create Post Form (Only if logged in) -->
    <div v-if="isLoggedIn" class="bg-gray-800/80 border border-gray-700 rounded-2xl p-4">
      <h3 class="text-lg font-bold mb-3">Comparteix amb la comunitat</h3>
      
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Missatge *</label>
          <textarea 
            v-model="newPostText" 
            rows="3" 
            maxlength="500"
            class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Què estàs jugant? Tens algun clip per compartir?">
          </textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">URL Multimèdia (YouTube) <span class="text-gray-500 text-xs">(Opcional)</span></label>
          <input 
            v-model="newPostUrl" 
            type="text" 
            class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div class="flex items-center justify-between">
          <p v-if="errorMsg" class="text-sm text-red-400">{{ errorMsg }}</p>
          <div v-else></div> <!-- Spacer -->
          
          <button 
            @click="submitPost" 
            :disabled="isSubmitting || !newPostText.trim()"
            class="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold transition-colors">
            {{ isSubmitting ? 'Publicant...' : 'Publicar' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="bg-gray-800/40 border border-gray-700 rounded-2xl p-6 text-center">
      <p class="text-gray-300 mb-2">Vols compartir els teus clips?</p>
      <router-link to="/login" class="text-purple-400 hover:text-purple-300 font-semibold hover:underline">
        Inicia sessió per publicar
      </router-link>
    </div>

    <!-- Posts Feed -->
    <div v-if="loading" class="text-center py-8 text-gray-400">
      Carregant publicacions...
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-8 text-gray-400">
      Encara no hi ha publicacions. Sigues el primer!
    </div>

    <div v-else class="space-y-4">
      <CommunityPost 
        v-for="post in posts" 
        :key="post._id" 
        :post="post" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api, type CommunityPost as ICommunityPost } from '@/services/api';
import { auth } from '@/services/auth';
import CommunityPost from './CommunityPost.vue';

const posts = ref<ICommunityPost[]>([]);
const loading = ref(true);
const isSubmitting = ref(false);
const newPostText = ref('');
const newPostUrl = ref('');
const errorMsg = ref('');

const isLoggedIn = computed(() => !!auth.state.token && !!auth.state.user);

async function loadPosts() {
  try {
    loading.value = true;
    const data = await api.getPosts();
    posts.value = data;
  } catch (e) {
    console.error('Error loading posts:', e);
  } finally {
    loading.value = false;
  }
}

async function submitPost() {
  if (!newPostText.value.trim()) return;
  
  errorMsg.value = '';
  isSubmitting.value = true;

  try {
    const token = auth.state.token;
    if (!token) throw new Error('Not authenticated');

    const res = await api.createPost(token, {
      text: newPostText.value.trim(),
      videoUrl: newPostUrl.value.trim() || undefined
    });

    if (res.success && res.post) {
      // Optimistic update: add to top
      posts.value = [res.post, ...posts.value];
      
      // Reset form
      newPostText.value = '';
      newPostUrl.value = '';
    }
  } catch (e) {
    console.error('Error creating post:', e);
    errorMsg.value = 'Error al publicar. Torna-ho a provar.';
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  loadPosts();
});
</script>

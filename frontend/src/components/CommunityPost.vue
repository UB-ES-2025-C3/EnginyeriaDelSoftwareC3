<template>
  <div class="bg-gray-800 border border-gray-700 rounded-2xl p-4 hover:border-gray-600 transition-colors">
    <!-- Header: Author & Time -->
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
        <img v-if="post.user.avatarUrl" :src="post.user.avatarUrl" :alt="post.user.name" class="w-full h-full object-cover" />
        <span v-else class="text-white font-bold">{{ post.user.name[0].toUpperCase() }}</span>
      </div>
      <div>
        <p class="font-semibold text-white">{{ post.user.name }}</p>
        <p class="text-xs text-gray-400">{{ formatDate(post.createdAt) }}</p>
      </div>
    </div>

    <!-- Content -->
    <div class="mb-4">
      <p class="text-gray-200 whitespace-pre-wrap mb-3">{{ post.text }}</p>

      <!-- Video Embed -->
      <div v-if="embedUrl" class="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-black">
        <iframe 
          :src="embedUrl" 
          class="absolute top-0 left-0 w-full h-full" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    </div>

    <!-- Actions / Comments Section -->
    <div class="border-t border-gray-700 pt-3">
      <button @click="showComments = !showComments" class="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2">
        💬 {{ post.comments?.length || 0 }} Comentaris
      </button>

      <!-- Comments List -->
      <div v-if="showComments" class="mt-4 space-y-4 pl-4 border-l-2 border-gray-700">
        <div v-for="comment in post.comments" :key="comment._id" class="flex gap-3">
          <div class="w-6 h-6 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
            <img v-if="comment.user.avatarUrl" :src="comment.user.avatarUrl" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-gray-300">{{ comment.user.name }}</span>
              <span class="text-[10px] text-gray-500">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="text-sm text-gray-400">{{ comment.text }}</p>
          </div>
        </div>

        <!-- Add Comment Form -->
        <div v-if="isLoggedIn" class="mt-3 flex gap-2">
          <input 
            v-model="newCommentText" 
            type="text" 
            placeholder="Escriu un comentari..." 
            class="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            @keyup.enter="submitComment"
          />
          <button 
            @click="submitComment" 
            :disabled="!newCommentText.trim() || isSubmitting"
            class="bg-purple-600 hover:bg-purple-500 text-white rounded-full p-2 disabled:opacity-50 transition-colors">
            ➤
          </button>
        </div>
        <p v-else class="text-xs text-gray-500 mt-2">Inicia sessió per comentar.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { type CommunityPost, api } from '@/services/api';
import { getYouTubeEmbedUrl } from '@/utils/youtube';
import { auth } from '@/services/auth';

const props = defineProps<{
  post: CommunityPost
}>();

const showComments = ref(false);
const newCommentText = ref('');
const isSubmitting = ref(false);

const isLoggedIn = computed(() => !!auth.state.token);

const embedUrl = computed(() => {
  if (!props.post.videoUrl) return null;
  return getYouTubeEmbedUrl(props.post.videoUrl);
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ca-ES', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });
}

async function submitComment() {
  if (!newCommentText.value.trim() || !auth.state.token) return;

  try {
    isSubmitting.value = true;
    const res = await api.addComment(auth.state.token, props.post._id, newCommentText.value);
    
    if (res.success && res.comment) {
      if (!props.post.comments) props.post.comments = [];
      props.post.comments.push(res.comment);
      newCommentText.value = '';
    }
  } catch (e) {
    console.error('Error adding comment:', e);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

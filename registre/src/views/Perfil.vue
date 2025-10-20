<template>
  <div class="wrapper">
    <form @submit.prevent="handleSave" class="form-container">
      <div class="header">
        <h2>El Meu Perfil</h2> 
        <p>Personalitza la teva informació</p>
      </div>

      <section class="form-section">
        <label>Imatge de portada</label>
        <div class="image-placeholder banner">
          <span>Sense imatge de portada</span>
          <button type="button" class="btn-secondary">Canviar portada</button>
        </div>

        <label>Avatar</label>
        <div class="avatar-upload">
          <div class="image-placeholder avatar">
            {{ name.charAt(0).toUpperCase() || 'P' }}
          </div>
          <button type="button" class="btn-secondary">Canviar avatar</button>
        </div>
      </section>

      <section class="form-section">
        <h3>Informació bàsica</h3>
        <label for="name">Nom d'usuari</label>
        <input id="name" v-model="name" type="text" placeholder="El teu nom" />

        <label for="bio">Biografia</label>
        <textarea id="bio" v-model="bio" placeholder="Explica'ns una mica sobre tu..."></textarea>

        <label for="email">Correu electrònic</label>
        <input id="email" v-model="email" type="email" disabled />
        <small>El correu no es pot modificar.</small>
      </section>

      <section class="form-section">
        <h3>Enllaços de Gaming</h3>
        <label for="steam">Steam (URL)</label>
        <input id="steam" v-model="links.steam" type="url" placeholder="https://steamcommunity.com/..." />
        
        <label for="twitch">Twitch (URL)</label>
        <input id="twitch" v-model="links.twitch" type="url" placeholder="https://twitch.tv/..." />
        
        <label for="psn">PSN ID</label>
        <input id="psn" v-model="links.psn" type="text" placeholder="El teu ID de PSN" />
        
        <label for="xbox">Xbox Gamertag</label>
        <input id="xbox" v-model="links.xbox" type="text" placeholder="El teu Gamertag" />
      </section>

      <div class="form-actions">
        <p v-if="error" class="err">{{ error }}</p>
        <p v-if="success" class="ok">Perfil desat correctament!</p>
        
        <button type="button" @click="resetForm" class="btn-cancel">Cancel·lar</button>
        
        <button type="submit" class="btn-save" :disabled="loading">
          {{ loading ? 'Desant...' : 'Desar canvis' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/services/api'; 
import { auth } from '@/services/auth';

// Tipus per a les dades originals
type UserData = {
  name: string;
  email: string;
  bio: string;
  links: { [key: string]: string };
};
const originalData = ref<UserData | null>(null);

// Refs per als camps del formulari
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

/**
 * Funció per restablir el formulari a les dades originals
 */
function resetForm() {
  if (!originalData.value) return;
  
  name.value = originalData.value.name;
  email.value = originalData.value.email;
  bio.value = originalData.value.bio || '';
  // Resetejem els links assegurant-nos que tots els camps existeixen
  links.value = {
    ...links.value,
    ...originalData.value.links
  };
  
  error.value = null;
  success.value = false;
}

// Quan el component es munta, carregar les dades de l'usuari
onMounted(async () => {
  if (!auth.state.token) return;
  loading.value = true;
  try {
    const userData = await api.getProfile(auth.state.token);
    // Desar les dades originals per poder fer "Cancel·lar"
    originalData.value = JSON.parse(JSON.stringify(userData)); 
    
    // Omplir el formulari per primer cop
    resetForm();

  } catch (e) {
    error.value = 'No s\'ha pogut carregar el teu perfil';
  } finally {
    loading.value = false;
  }
});

// Funció per desar els canvis
async function handleSave() {
  if (!auth.state.token) return;
  
  loading.value = true;
  error.value = null;
  success.value = false;

  try {
    const cleanLinks = JSON.parse(JSON.stringify(links.value));
    delete cleanLinks._id;
    const payload = {
      name: name.value,
      bio: bio.value,
      links: cleanLinks
    };
    // Enviar les dades actualitzades al backend
    const updatedUserData = await api.updateProfile(auth.state.token, payload);
    
    // Un cop desat, les noves dades passen a ser les "originals"
    originalData.value = JSON.parse(JSON.stringify(updatedUserData)); 

    success.value = true;
    
    // Amagar el missatge d'èxit després de 3 segons
    setTimeout(() => { success.value = false; }, 3000);
    console.log('Payload enviat:', payload);
  } catch (e: any) {
    error.value = e?.error || 'Error en desar el perfil';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.wrapper {
  padding: 2rem;
  min-height: calc(100vh - 4rem); 
}
.form-container {
  max-width: 1200px;
  margin: 0 auto; 
  display: grid;
  gap: 2rem;
}
.header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
}
.header h2 { margin: 0; }
.header p { margin: 0.25rem 0 0; color: var(--color-text-muted); }
.form-section {
  display: grid;
  gap: 0.75rem;
}
.form-section h3 {
  margin: 0;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
}
label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-muted);
}
input[type="text"],
input[type="email"],
input[type="url"],
textarea {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--color-text);
  font-size: 1rem;
  width: 100%; 
  box-sizing: border-box; 
}
input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
textarea {
  min-height: 100px;
  resize: vertical;
}
small {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: -0.5rem;
}
.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: 8px;
  color: var(--color-text-muted);
  gap: 1rem;
}
.image-placeholder.banner { height: 180px; }
.image-placeholder.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  font-size: 2.5rem;
  font-weight: bold;
}
.avatar-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.btn-secondary {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
.btn-secondary:hover { background-color: #3a3a5e; }
.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
}
.btn-save {
  background-color: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-cancel {
  background-color: transparent;
  color: var(--color-text-muted);
  border: 0;
  cursor: pointer;
}
.err { color: #e57373; margin-right: auto; }
.ok { color: #81c784; margin-right: auto; }

/* --- PART RESPONSIVE --- */
@media (max-width: 768px) {
  .wrapper {
    padding: 1rem;
    min-height: calc(100vh - 2rem);
  }
  .form-container {
    max-width: 100%;
  }
  .form-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
    align-items: stretch; 
  }
  .btn-save, .btn-cancel {
    width: 100%;
    text-align: center;
  }
  .btn-cancel {
    background-color: var(--color-surface);
    padding: 0.75rem;
    border-radius: 8px;
  }
  .err, .ok {
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
  }
}
</style>
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { auth } from './services/auth'; // ⭐ IMPORTAR auth

// ⭐ CAMBIO: Inicializar la sesión ANTES de crear la app
auth.init();

const app = createApp(App);
app.use(router).mount('#app');
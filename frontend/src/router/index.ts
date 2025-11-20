import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Perfil from '../views/Perfil.vue';
import LandingPage from '../views/LandingPage.vue'
import GameCard from '../views/GameCard.vue';
import CatalegJocs from '../views/CatalegJocs.vue';
import ContactForm from '../views/ContactForm.vue';

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/perfil', component: Perfil },
  { path: '/', component: LandingPage },
  { path: '/game/:id', component: GameCard, props: true },
  { path: '/cataleg', component: CatalegJocs },
  { path: '/contacte', component: ContactForm }
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

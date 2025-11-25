import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Perfil from '../views/Perfil.vue';
import LandingPage from '../views/LandingPage.vue'
import GameCard from '../views/GameCard.vue';
import CatalegJocs from '../views/CatalegJocs.vue';
import Reviews from '../views/Reviews.vue';
import ContactForm from '../views/ContactForm.vue';
import FAQS from '../views/FAQS.vue';
import PoliticaPrivacitat from '../views/PoliticaPrivacitat.vue';
import TermesUsu from '../views/TermesUsu.vue';

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/perfil', component: Perfil },
  { path: '/', component: LandingPage },
  { path: '/game/:id', component: GameCard, props: true },
  { path: '/cataleg', component: CatalegJocs },
  { path: '/reviews', component: Reviews },
  { path: '/contacte', component: ContactForm },
  { path: '/privacitat', name: 'Privacitat', component: PoliticaPrivacitat },
  { path: '/faqs', component: FAQS },
  { path: '/termes', name: 'TermesUsu', component: TermesUsu }
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
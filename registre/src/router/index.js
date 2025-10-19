import { createRouter, createWebHistory } from 'vue-router';

import Register from '../views/Register.vue';
import Login from '../views/Login.vue';

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' }   // simple por ahora
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

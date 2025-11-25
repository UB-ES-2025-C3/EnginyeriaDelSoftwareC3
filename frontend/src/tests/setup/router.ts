import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: { template: '<div />' } },
  { path: '/cataleg', name: 'cataleg', component: { template: '<div />' } },
  { path: '/faqs', name: 'faqs', component: { template: '<div />' } },
  { path: '/contacte', name: 'contacte', component: { template: '<div />' } },
  { path: '/termes', name: 'termes', component: { template: '<div />' } },
  { path: '/privacitat', name: 'privacitat', component: { template: '<div />' } },
  { path: '/login', name: 'login', component: { template: '<div />' } },
  { path: '/perfil', name: 'perfil', component: { template: '<div />' } },
  { path: '/game/:id', name: 'game', component: { template: '<div />' } },
  { path: '/reviews', name: 'reviews', component: { template: '<div />' } },
]

export const makeTestRouter = () =>
  createRouter({
    history: createWebHistory(),
    routes,
  })

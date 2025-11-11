import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LandingPage from '../views/LandingPage.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Mock del router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div></div>' } },
    { path: '/login', name: 'login', component: { template: '<div></div>' } },
    { path: '/register', name: 'register', component: { template: '<div></div>' } },
    { path: '/Cataleg', name: 'cataleg', component: { template: '<div></div>' } },
  ],
});

describe('LandingPage.vue', () => {
  it('renders the landing page correctly', async () => {
    // Asegurarse de que el router está listo
    await router.push('/');
    await router.isReady();

    const wrapper = mount(LandingPage, {
      global: {
        plugins: [router],
      }
    });

    // Comprueba que el título principal existe
    expect(wrapper.find('h1').text()).toContain('El teu món');
    expect(wrapper.find('h1').text()).toContain('gamer comença!');

    // Comprueba que los botones existen y tienen el texto correcto
    const loginRegisterButton = wrapper.findAll('button').find(b => b.text() === 'Iniciar sessió/Registrar-se');
    expect(loginRegisterButton).toBeTruthy();

    const guestButton = wrapper.findAll('button').find(b => b.text() === 'Accedeix com a convidat');
    expect(guestButton).toBeTruthy();

    // Comprueba que la imagen existe
    const marioImage = wrapper.find('img[alt="Pixel Mario"]');
    expect(marioImage.exists()).toBe(true);
  });
});

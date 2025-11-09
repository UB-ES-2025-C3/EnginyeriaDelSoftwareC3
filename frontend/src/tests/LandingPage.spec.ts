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
    const loginButton = wrapper.findAll('button').find(b => b.text() === 'Iniciar sessió');
    expect(loginButton).toBeTruthy();

    const registerButton = wrapper.findAll('button').find(b => b.text() === 'Registrar-se');
    expect(registerButton).toBeTruthy();

    // Comprueba que la imagen existe
    const marioImage = wrapper.find('img[alt="Pixel Mario"]');
    expect(marioImage.exists()).toBe(true);
    expect(marioImage.attributes('src')).toBe('/src/assets/rotatingmario.gif'); // Vite asset handling
  });
});

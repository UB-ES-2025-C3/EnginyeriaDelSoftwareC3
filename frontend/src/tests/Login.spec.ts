import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Login from '../views/Login.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Creamos un router real pero para el entorno de test
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div></div>' } },
    { path: '/register', name: 'register', component: { template: '<div></div>' } }
  ],
});

describe('Login.vue', () => {
  it('renders the login form correctly', async () => {
    // Hacemos push para asegurarnos que el router está listo
    await router.push('/');
    await router.isReady();

    const wrapper = mount(Login, {
      global: {
        plugins: [router], // Usamos plugins para inyectar el router para la Composition API
      }
    });

    // Comprueba que el título existe
    expect(wrapper.find('h2').text()).toBe('Iniciar sessió');

    // Comprueba que los inputs existen
    const emailInput = wrapper.find('input[type="email"]');
    expect(emailInput.exists()).toBe(true);

    const passwordInput = wrapper.find('input[type="password"]');
    expect(passwordInput.exists()).toBe(true);

    // Comprueba que el botón de submit existe y tiene el texto correcto
    // El botón no tiene type="submit", lo buscamos por su texto.
    const submitButton = wrapper.findAll('button').find(b => b.text() === 'Entrar');
    expect(submitButton).toBeTruthy(); // Usamos toBeTruthy para asegurar que el wrapper del botón fue encontrado
    expect(submitButton!.text()).toBe('Entrar');
  });
});
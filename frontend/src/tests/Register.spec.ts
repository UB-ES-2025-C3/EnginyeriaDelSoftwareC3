import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Register from '../views/Register.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Creamos un router real pero para el entorno de test
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div></div>' } },
    { path: '/login', name: 'login', component: { template: '<div></div>' } }
  ],
});

describe('Register.vue', () => {
  it('renders the registration form correctly', async () => {
    // Hacemos push para asegurarnos que el router está listo
    await router.push('/');
    await router.isReady();

    const wrapper = mount(Register, {
      global: {
        plugins: [router], // Usamos plugins para inyectar el router para la Composition API
      }
    });

    // Comprueba que el título existe
    expect(wrapper.find('h2').text()).toBe('Crear compte');

    // Comprueba que los inputs existen
    const nameInput = wrapper.find('input[type="text"]');
    expect(nameInput.exists()).toBe(true);

    const emailInput = wrapper.find('input[type="email"]');
    expect(emailInput.exists()).toBe(true);

    const passwordInput = wrapper.find('input[type="password"]');
    expect(passwordInput.exists()).toBe(true);

    // Comprueba que el botón de submit existe y tiene el texto correcto
    const submitButton = wrapper.findAll('button').find(b => b.text() === 'Registrar-me');
    expect(submitButton).toBeTruthy();
    expect(submitButton!.text()).toBe('Registrar-me');
  });
});

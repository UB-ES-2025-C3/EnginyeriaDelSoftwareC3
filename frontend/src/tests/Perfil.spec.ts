import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Perfil from '../views/Perfil.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Mock del router (aunque Perfil.vue no usa useRouter directamente, es buena práctica tenerlo)
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div></div>' } },
    { path: '/cataleg', name: 'cataleg', component: { template: '<div></div>' } }, // Added for /cataleg route
  ],
});

// Mock de los servicios API y Auth
vi.mock('@/services/api', () => ({
  api: {
    getProfile: vi.fn(() => Promise.resolve({
      name: 'Test User',
      email: 'test@example.com',
      bio: 'This is a test bio.',
      links: { steam: 'steam.com/test', twitch: 'twitch.tv/test' },
      avatarUrl: null,
      bannerUrl: null,
    })),
    uploadProfileMedia: vi.fn(() => Promise.resolve({})),
    updateProfile: vi.fn(() => Promise.resolve({})),
  },
}));

vi.mock('@/services/auth', () => ({
  auth: {
    state: {
      token: 'fake-token',
    },
  },
}));

describe('Perfil.vue', () => {
  it('renders the profile form correctly with initial data', async () => {
    // Asegurarse de que el router está listo
    await router.push('/');
    await router.isReady();

    const wrapper = mount(Perfil, {
      global: {
        plugins: [router],
      }
    });

    // Esperar a que el onMounted se complete y los datos se carguen en el formulario.
    // Lo hacemos esperando a que el input del nombre tenga el valor esperado.
    await vi.waitFor(() => {
      const nameInput = wrapper.find('#name') as any;
      expect(nameInput.element.value).toBe('Test User');
    });

    // Ahora que sabemos que los datos están cargados, podemos hacer el resto de comprobaciones.
    // Comprueba que el título existe
    expect(wrapper.find('h2').text()).toBe('El Meu Perfil');

    // Comprueba que los campos de entrada existen y tienen los valores iniciales
    const nameInput = wrapper.find('#name') as any;
    expect(nameInput.exists()).toBe(true);
    expect(nameInput.element.value).toBe('Test User');

    const emailInput = wrapper.find('#email') as any;
    expect(emailInput.exists()).toBe(true);
    expect(emailInput.element.value).toBe('test@example.com');
    expect(emailInput.attributes('disabled')).toBeDefined(); // Email should be disabled

    const bioTextarea = wrapper.find('#bio') as any;
    expect(bioTextarea.exists()).toBe(true);
    expect(bioTextarea.element.value).toBe('This is a test bio.');

    // Comprueba los campos de enlaces de gaming
    expect((wrapper.find('#steam') as any).element.value).toBe('steam.com/test');
    expect((wrapper.find('#twitch') as any).element.value).toBe('twitch.tv/test');
    expect(wrapper.find('#psn').exists()).toBe(true);
    expect(wrapper.find('#xbox').exists()).toBe(true);

    // Comprueba que el botón de guardar cambios existe
    const saveButton = wrapper.findAll('button').find(b => b.text() === 'Desar canvis');
    expect(saveButton).toBeTruthy();
    expect(saveButton!.attributes('disabled')).toBeDefined(); // Should be disabled initially if no changes

    // Comprueba que los mensajes de error/éxito no son visibles
    expect(wrapper.find('.text-red-400').exists()).toBe(false);
    expect(wrapper.find('.text-green-400').exists()).toBe(false);
  });
});

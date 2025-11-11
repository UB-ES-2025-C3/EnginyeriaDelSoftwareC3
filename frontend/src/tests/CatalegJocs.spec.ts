import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import CatalegJocs from '../views/CatalegJocs.vue';
import GameCardMini from '../views/GameCardMini.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { api } from '@/services/api';
import { auth } from '@/services/auth';
import { Game, Review } from '@/services/api'; // Import Game and Review types

// Mock de los servicios
vi.mock('@/services/api');
vi.mock('@/services/auth');

// Creamos un router de prueba
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div></div>' } },
    { path: '/cataleg', name: 'cataleg', component: { template: '<div></div>' } },
    { path: '/perfil', name: 'perfil', component: { template: '<div></div>' } },
    { path: '/login', name: 'login', component: { template: '<div></div>' } },
    { path: '/game/:id', name: 'game', component: { template: '<div></div>' } }, // Added for game detail links
  ],
});

// Datos de prueba
const mockGames: Game[] = [ // Typed as Game[]
  { _id: '1', name: 'The Witcher 3', genre: 'RPG', year: 2015, platform: 'PC', image: 'tw3.jpg', reviews: [] }, // Added reviews
  { _id: '2', name: 'Red Dead Redemption 2', genre: 'Action', year: 2018, platform: 'PS4', image: 'rdr2.jpg', reviews: [] }, // Added reviews
];

describe('CatalegJocs.vue', () => {
  beforeEach(() => {
    // Reseteamos los mocks antes de cada test
    vi.resetAllMocks();

    // Mock por defecto para el estado de autenticación (no logueado)
    auth.state = { token: null, user: null };
  });

  describe('Renderizado Inicial y Carga de Datos', () => {
    it('debería mostrar el estado de "Carregant jocs..." inicialmente', () => {
      // Hacemos que la promesa de la API nunca se resuelva para este test
      vi.mocked(api.getGames).mockImplementation(() => new Promise(() => {}));

      const wrapper = mount(CatalegJocs, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.text()).toContain('Carregant jocs...');
    });

    it('debería renderizar una lista de juegos cuando la API devuelve datos', async () => {
      // Mockeamos la API para que devuelva nuestros juegos de prueba
      vi.mocked(api.getGames).mockResolvedValue(mockGames);

      const wrapper = mount(CatalegJocs, {
        global: {
          plugins: [router],
        },
      });

      // Esperamos a que todas las promesas (onMounted) se resuelvan
      await flushPromises();

      // Comprobamos que el mensaje de carga ha desaparecido
      expect(wrapper.text()).not.toContain('Carregant jocs...');

      // Comprobamos que se renderizan los componentes GameCardMini
      const gameCards = wrapper.findAllComponents(GameCardMini);
      expect(gameCards.length).toBe(mockGames.length);

      // Comprobamos que las props se pasan correctamente al primer GameCardMini
      expect(gameCards[0].props('name')).toBe('The Witcher 3');
      expect(gameCards[0].props('genre')).toBe('RPG');
    });
  });

  describe('Estados Especiales', () => {
    it('debería mostrar un mensaje de "No s\'han trobat jocs" si la API devuelve una lista vacía', async () => {
      vi.mocked(api.getGames).mockResolvedValue([]); // API devuelve array vacío

      const wrapper = mount(CatalegJocs, {
        global: {
          plugins: [router],
        },
      });

      await flushPromises();

      expect(wrapper.text()).toContain('No s\'han trobat jocs. Torna aviat!');
      expect(wrapper.findAllComponents(GameCardMini).length).toBe(0);
    });

    it('debería registrar un error en la consola si la llamada a la API falla', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // Espiamos console.error
      const errorMessage = 'Error al cargar los juegos';
      vi.mocked(api.getGames).mockRejectedValue(new Error(errorMessage)); // API falla

      mount(CatalegJocs, {
        global: {
          plugins: [router],
        },
      });

      await flushPromises();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error carregant jocs del backend:', expect.any(Error));
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

      consoleErrorSpy.mockRestore(); // Restauramos console.error
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import PoliticaPrivacitat from '../views/PoliticaPrivacitat.vue';
import { makeTestRouter } from './setup/router';
import { auth } from '@/services/auth';
import { api } from '@/services/api';

vi.mock('@/services/auth');
vi.mock('@/services/api');

const PRIVACITAT_TITLE = 'Política de privacitat | CheckPoint';
const PRIVACITAT_DESCRIPTION = 'Coneix com CheckPoint gestiona les teves dades personals, les finalitats i els teus drets.';

describe('PoliticaPrivacitat.vue', () => {
  let router: ReturnType<typeof makeTestRouter>;

  beforeEach(async () => {
    document.title = 'Original Title';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'Original description');

    vi.resetAllMocks();
    auth.state = { token: null, user: null };
    vi.mocked(api.getGames).mockResolvedValue({
      items: [],
      page: 1,
      pageSize: 5,
      totalItems: 0,
      totalPages: 0,
      availableGenres: [],
      availablePlatforms: [],
    });

    router = makeTestRouter();
    await router.push('/privacitat');
    await router.isReady();
  });

  it('renderitza el títol i seccions principals', () => {
    const wrapper = mount(PoliticaPrivacitat, {
      global: { plugins: [router] },
    });

    expect(wrapper.get('h1').text()).toContain('Política de privacitat');
    const sectionTitles = wrapper.findAll('h2').map((node) => node.text());
    expect(sectionTitles).toEqual(expect.arrayContaining([
      'Qui som',
      'Dades que recollim',
      'Drets de l\'usuari',
      'Contacte',
    ]));
  });

  it('estableix i restaura els metadades del document en muntar/desmuntar', () => {
    const wrapper = mount(PoliticaPrivacitat, {
      global: { plugins: [router] },
    });

    const metaDescription = document.querySelector('meta[name="description"]');
    expect(document.title).toBe(PRIVACITAT_TITLE);
    expect(metaDescription?.getAttribute('content')).toBe(PRIVACITAT_DESCRIPTION);

    wrapper.unmount();

    const restoredMeta = document.querySelector('meta[name="description"]');
    expect(document.title).toBe('Original Title');
    expect(restoredMeta?.getAttribute('content')).toBe('Original description');
  });

  describe('Header Functionality', () => {
    it('redirects to catalog with search query on search submit', async () => {
      const wrapper = mount(PoliticaPrivacitat, {
        global: { plugins: [router] },
      });

      const searchInput = wrapper.find('input[type="text"]');
      await searchInput.setValue('my test search');
      await searchInput.trigger('keyup.enter');
      await flushPromises();

      expect(router.currentRoute.value.path).toBe('/cataleg');
      expect(router.currentRoute.value.query.q).toBe('my test search');
    });

    it('shows login button when user is not logged in', () => {
      const wrapper = mount(PoliticaPrivacitat, {
        global: { plugins: [router] },
      });
      expect(wrapper.find('a[title="Iniciar sessió"]').exists()).toBe(true);
      expect(wrapper.find('a[title="Veure perfil"]').exists()).toBe(false);
    });

    it('shows profile link and avatar when user is logged in', () => {
      auth.state = {
        token: 'fake-token',
        user: { _id: '1', name: 'Test User', email: 'test@test.com', avatarUrl: 'avatar.png' },
      };
      const wrapper = mount(PoliticaPrivacitat, {
        global: { plugins: [router] },
      });
      expect(wrapper.find('a[title="Veure perfil"]').exists()).toBe(true);
      expect(wrapper.find('img[alt="Test User"]').exists()).toBe(true);
    });

    it('handles logout correctly', async () => {
      auth.state = {
        token: 'fake-token',
        user: { _id: '1', name: 'Test User', email: 'test@test.com' },
      };
      const wrapper = mount(PoliticaPrivacitat, {
        global: { plugins: [router] },
      });

      await wrapper.find('button.w-10.h-10').trigger('click'); // Open menu
      await wrapper.find('button.w-full.text-left').trigger('click'); // Click logout
      await flushPromises();

      expect(auth.logout).toHaveBeenCalled();
      expect(router.currentRoute.value.path).toBe('/login');
    });
  });
});

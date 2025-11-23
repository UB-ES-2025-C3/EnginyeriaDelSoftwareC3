import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import CatalegJocs from '../views/CatalegJocs.vue';
import { api, PaginatedGamesResponse, GameSummary } from '@/services/api';
import { auth } from '@/services/auth';
import { makeTestRouter } from './setup/router';

vi.mock('@/services/api');
vi.mock('@/services/auth');

const mockGames: GameSummary[] = [
  { _id: '1', name: 'Halo Infinite', genre: 'Shooter', year: 2021, platform: 'PC', image: 'halo.jpg', averageRating: 4.4, reviewCount: 40 },
  { _id: '2', name: 'Zelda TOTK', genre: 'Adventure', year: 2023, platform: 'Switch', image: 'zelda.jpg', averageRating: 4.9, reviewCount: 120 },
];

const createResponse = (overrides?: Partial<PaginatedGamesResponse>): PaginatedGamesResponse => ({
  items: mockGames,
  page: 1,
  pageSize: 12,
  totalItems: mockGames.length,
  totalPages: 1,
  availableGenres: ['Shooter', 'Adventure'],
  availablePlatforms: ['PC', 'Switch'],
  ...overrides,
});

describe('CatalegJocs.vue - Search suggestions', () => {
  let router: ReturnType<typeof makeTestRouter>;

  beforeEach(async () => {
    vi.resetAllMocks();
    auth.state = { token: null, user: null };
    vi.mocked(api.getGames).mockResolvedValue(createResponse());

    router = makeTestRouter();
    await router.push('/cataleg');
    await router.isReady();
  });

  it('mostra suggeriments, els tanca en perdre focus i actualitza la query en prémer Enter', async () => {
    vi.useFakeTimers();
    const wrapper = mount(CatalegJocs, {
      global: { plugins: [router] },
    });
    await flushPromises();

    const searchInput = wrapper.get('input[type="text"][placeholder="Buscar jocs..."]');

    await searchInput.setValue('Halo');
    vi.advanceTimersByTime(260);
    await flushPromises();

    expect(api.getGames).toHaveBeenCalledWith(expect.objectContaining({ q: 'Halo', limit: 5 }));
    const suggestions = wrapper.findAll('a.flex.items-center.gap-3.p-3');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].text()).toContain('Halo Infinite');

    await searchInput.trigger('blur');
    vi.advanceTimersByTime(200);
    await flushPromises();
    expect(wrapper.find('a.flex.items-center.gap-3.p-3').exists()).toBe(false);

    await searchInput.setValue('Metroid');
    await searchInput.trigger('keyup.enter');
    await flushPromises();

    expect(router.currentRoute.value.query.q).toBe('Metroid');
    vi.useRealTimers();
  });
});

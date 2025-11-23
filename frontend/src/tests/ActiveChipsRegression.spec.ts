import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import CatalegJocs from '../views/CatalegJocs.vue';
import { api, PaginatedGamesResponse, GameSummary } from '@/services/api';
import { auth } from '@/services/auth';
import { makeTestRouter } from './setup/router';

vi.mock('@/services/api');
vi.mock('@/services/auth');

const mockGames: GameSummary[] = [
  { _id: '1', name: 'The Witcher 3', genre: 'RPG', year: 2015, platform: 'PC', image: 'tw3.jpg', averageRating: 4.8, reviewCount: 120 },
];

const createResponse = (overrides?: Partial<PaginatedGamesResponse>): PaginatedGamesResponse => ({
  items: mockGames,
  page: 1,
  pageSize: 12,
  totalItems: mockGames.length,
  totalPages: 1,
  availableGenres: ['RPG', 'Action'],
  availablePlatforms: ['PC', 'PS5'],
  ...overrides,
});

describe('CatalegJocs.vue - Active filter chips regression', () => {
  let router: ReturnType<typeof makeTestRouter>;

  beforeEach(async () => {
    vi.resetAllMocks();
    auth.state = { token: null, user: null };
    vi.mocked(api.getGames).mockResolvedValue(createResponse());

    router = makeTestRouter();
    await router.push('/cataleg');
    await router.isReady();
  });

  it('mostra tres xips quan hi ha dos gèneres i una plataforma, i elimina correctament un xip', async () => {
    const wrapper = mount(CatalegJocs, {
      global: { plugins: [router] },
    });
    await flushPromises();

    await wrapper.get('button[aria-label="Obrir filtres"]').trigger('click');
    await flushPromises();

    await wrapper.get('input[type="checkbox"][value="RPG"]').setValue(true);
    await wrapper.get('input[type="checkbox"][value="Action"]').setValue(true);
    await wrapper.get('input[type="checkbox"][value="PC"]').setValue(true);
    await flushPromises();

    expect(wrapper.vm.activeFilters).toHaveLength(3);
    expect(router.currentRoute.value.query.genres).toBe('RPG,Action');
    expect(router.currentRoute.value.query.platforms).toBe('PC');

    const chipContainer = wrapper.get('div.flex.flex-wrap.gap-2');
    expect(chipContainer.text()).toContain('Gènere: RPG');
    expect(chipContainer.text()).toContain('Gènere: Action');
    expect(chipContainer.text()).toContain('Plataforma: PC');

    const genreChip = chipContainer.findAll('button.inline-flex.items-center').find((chip) =>
      chip.text().includes('Gènere: RPG')
    );
    expect(genreChip).toBeDefined();
    await genreChip?.trigger('click');
    await flushPromises();

    expect(wrapper.vm.selectedGenres).toEqual(['Action']);
    expect(wrapper.vm.activeFilters).toHaveLength(2);
    expect(router.currentRoute.value.query.genres).toBe('Action');
  });
});

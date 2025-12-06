import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import CatalegJocs from '../views/CatalegJocs.vue';
import { api, type GameSummary, type PaginatedGamesResponse } from '@/services/api';
import { auth } from '@/services/auth';
import { makeTestRouter } from './setup/router';

vi.mock('@/services/api');
vi.mock('@/services/auth');

const mockGames: GameSummary[] = [
  { _id: '1', name: 'Mock Game', genre: 'Acció / Aventura', year: 2024, platform: 'PC / Nintendo Switch', image: 'mock.jpg', averageRating: 4.5, reviewCount: 10 },
];

const createResponse = (overrides?: Partial<PaginatedGamesResponse>): PaginatedGamesResponse => ({
  items: mockGames,
  page: 1,
  pageSize: 12,
  totalItems: mockGames.length,
  totalPages: 1,
  availableGenres: ['Acció / Aventura', 'RPG / Acció', 'Puzzle'],
  availablePlatforms: ['PC / Nintendo Switch', 'Xbox'],
  ...overrides,
});

describe('Facet normalization', () => {
  let router: ReturnType<typeof makeTestRouter>;

  beforeEach(async () => {
    vi.resetAllMocks();
    auth.state = { token: null, user: null };
    vi.mocked(api.getGames).mockResolvedValue(createResponse());
    vi.mocked(api.getGameReviews).mockResolvedValue({ reviews: [] });
    router = makeTestRouter();
    await router.push('/cataleg');
    await router.isReady();
  });

  it('expands canonical selections to raw values while keeping chips and URL canonical', async () => {
    const wrapper = mount(CatalegJocs, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();

    await wrapper.find('button[aria-label="Obrir filtres"]').trigger('click');
    await flushPromises();

    const accioCheckbox = wrapper.find('input[type="checkbox"][value="Acció"]');
    const pcCheckbox = wrapper.find('input[type="checkbox"][value="PC"]');

    expect(accioCheckbox.exists()).toBe(true);
    expect(pcCheckbox.exists()).toBe(true);

    await accioCheckbox.setValue(true);
    await pcCheckbox.setValue(true);
    await flushPromises();

    const lastCall = vi.mocked(api.getGames).mock.calls.at(-1)?.[0];
    expect(lastCall?.genres).toEqual(expect.arrayContaining(['Acció / Aventura', 'RPG / Acció']));
    expect(lastCall?.platforms).toEqual(expect.arrayContaining(['PC / Nintendo Switch']));
    expect(router.currentRoute.value.query.genres).toBe('Acció');

    const chipTexts = wrapper.findAll('button.inline-flex.items-center').map((chip) => chip.text());
    expect(chipTexts.some((text) => text.includes('Gènere: Acció'))).toBe(true);
  });

  it('renders one chip per canonical facet and stores them in the query', async () => {
    const wrapper = mount(CatalegJocs, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();

    await wrapper.find('button[aria-label="Obrir filtres"]').trigger('click');
    await flushPromises();

    const accioCheckbox = wrapper.find('input[type="checkbox"][value="Acció"]');
    const puzzleCheckbox = wrapper.find('input[type="checkbox"][value="Puzzle"]');
    const pcCheckbox = wrapper.find('input[type="checkbox"][value="PC"]');

    await accioCheckbox.setValue(true);
    await puzzleCheckbox.setValue(true);
    await pcCheckbox.setValue(true);
    await flushPromises();

    expect(wrapper.vm.activeFilters.length).toBe(3);
    const genresQuery = (router.currentRoute.value.query.genres as string | undefined)?.split(',') ?? [];
    expect(genresQuery).toEqual(expect.arrayContaining(['Acció', 'Puzzle']));
    expect(router.currentRoute.value.query.platforms).toBe('PC');

    const lastCall = vi.mocked(api.getGames).mock.calls.at(-1)?.[0];
    expect(lastCall?.genres).toEqual(expect.arrayContaining(['Acció / Aventura', 'RPG / Acció', 'Puzzle']));
    expect(lastCall?.platforms).toEqual(expect.arrayContaining(['PC / Nintendo Switch']));
  });
});

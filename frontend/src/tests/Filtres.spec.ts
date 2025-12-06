import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import CatalegJocs from '../views/CatalegJocs.vue';
import { api, PaginatedGamesResponse, GameSummary } from '@/services/api';
import { auth } from '@/services/auth';
import { makeTestRouter } from './setup/router';

// Mock de los servicios
vi.mock('@/services/api');
vi.mock('@/services/auth');

// Datos de prueba
const mockGames: GameSummary[] = [
  { _id: '1', name: 'The Witcher 3', genre: 'RPG', year: 2015, platform: 'PC', image: 'tw3.jpg', averageRating: 4.8, reviewCount: 120 },
  { _id: '2', name: 'Red Dead Redemption 2', genre: 'Action', year: 2018, platform: 'PS4', image: 'rdr2.jpg', averageRating: 4.9, reviewCount: 200 },
];

const createResponse = (overrides?: Partial<PaginatedGamesResponse>): PaginatedGamesResponse => ({
  items: mockGames,
  page: 1,
  pageSize: 12,
  totalItems: mockGames.length,
  totalPages: 1,
  availableGenres: ['RPG', 'Action', 'Adventure'],
  availablePlatforms: ['PC', 'PS4', 'Xbox One'],
  ...overrides,
});

describe('CatalegJocs.vue - Filter Functionality', () => {
  let router: ReturnType<typeof makeTestRouter>;

  beforeEach(async () => {
    vi.resetAllMocks();
    auth.state = { token: null, user: null };
    vi.mocked(api.getGames).mockResolvedValue(createResponse());
    vi.mocked(api.getGameReviews).mockResolvedValue({ reviews: [] });
    router = makeTestRouter();
    // Reset router to a known state before each test
    await router.push('/cataleg');
    await router.isReady();
  });

  it('should initialize with default filters if no query parameters are present', async () => {
    mount(CatalegJocs, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();

    expect(router.currentRoute.value.query).toEqual({});
    expect(api.getGames).toHaveBeenCalledWith(expect.objectContaining({
      sort: 'best',
      genres: [],
      platforms: [],
    }));
  });

  it('should initialize filters from URL query parameters', async () => {
    await router.push('/cataleg?q=test&genres=RPG,Action&platforms=PC&sort=year');
    const wrapper = mount(CatalegJocs, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();

    // Open filter panel to make the select element visible
    await wrapper.find('button[aria-label="Obrir filtres"]').trigger('click');
    await flushPromises();

    expect((wrapper.get('input[type="text"]').element as HTMLInputElement).value).toBe('test');
    expect((wrapper.get('select').element as HTMLSelectElement).value).toBe('year');

    const calls = vi.mocked(api.getGames).mock.calls;
    const args = (calls[1] ?? calls[0])?.[0];
    expect(args).toEqual(expect.objectContaining({
      q: 'test',
      sort: 'year',
      genres: expect.arrayContaining(['RPG', 'Action']),
      platforms: expect.arrayContaining(['PC']),
    }));
  });

  it('should open and close the filter panel', async () => {
    const wrapper = mount(CatalegJocs, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();

    const filterButton = wrapper.find('button[aria-label="Obrir filtres"]');
    expect(filterButton.exists()).toBe(true);
    expect(wrapper.find('.max-w-md.bg-gray-900').exists()).toBe(false);

    await filterButton.trigger('click');
    expect(wrapper.find('.max-w-md.bg-gray-900').exists()).toBe(true);

    const closeButton = wrapper.find('button[aria-label="Tancar filtres"]');
    expect(closeButton.exists()).toBe(true);
    await closeButton.trigger('click');
    await flushPromises();
    expect(wrapper.find('.max-w-md.bg-gray-900').exists()).toBe(false);
  });

  it('should update searchQuery and trigger search suggestions on input', async () => {
    vi.useFakeTimers();
    const wrapper = mount(CatalegJocs, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();

    const searchInput = wrapper.find('input[type="text"][placeholder="Buscar jocs..."]');
    expect(searchInput.exists()).toBe(true);

    await searchInput.setValue('witcher');
    expect((searchInput.element as HTMLInputElement).value).toBe('witcher');
    expect(api.getGames).not.toHaveBeenCalledWith(expect.objectContaining({ q: 'witcher' }));

    vi.advanceTimersByTime(250);
    await flushPromises();

    expect(api.getGames).toHaveBeenCalledWith(expect.objectContaining({ q: 'witcher', limit: 5 }));
    vi.useRealTimers();
  });

  it('should show suggestions, hide them on blur, and apply the query on Enter', async () => {
    vi.useFakeTimers();
    const wrapper = mount(CatalegJocs, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();

    const searchInput = wrapper.get('input[type="text"][placeholder="Buscar jocs..."]');

    await searchInput.setValue('witcher');
    vi.advanceTimersByTime(260);
    await flushPromises();

    expect(api.getGames).toHaveBeenCalledWith(expect.objectContaining({ q: 'witcher', limit: 5 }));
    expect(wrapper.findAll('a.flex.items-center.gap-3.p-3').length).toBeGreaterThan(0);

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

  it('should select and deselect genres and update the URL', async () => {
    const wrapper = mount(CatalegJocs, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();

    await wrapper.find('button[aria-label="Obrir filtres"]').trigger('click');
    await flushPromises();

    const rpgCheckbox = wrapper.find('input[type="checkbox"][value="RPG"]');
    expect(rpgCheckbox.exists()).toBe(true);
    expect((rpgCheckbox.element as HTMLInputElement).checked).toBe(false);

    await rpgCheckbox.setValue(true);
    await flushPromises();

    expect(router.currentRoute.value.query.genres).toBe('RPG');
    expect(api.getGames).toHaveBeenCalledWith(expect.objectContaining({ genres: expect.arrayContaining(['RPG']) }));

    await rpgCheckbox.setValue(false);
    await flushPromises();

    expect(router.currentRoute.value.query.genres).toBeUndefined();
    expect(api.getGames).toHaveBeenCalledWith(expect.objectContaining({ genres: [] }));
  });

  it('should select and deselect platforms and update the URL', async () => {
    const wrapper = mount(CatalegJocs, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();

    await wrapper.find('button[aria-label="Obrir filtres"]').trigger('click');
    await flushPromises();

    const pcCheckbox = wrapper.find('input[type="checkbox"][value="PC"]');
    expect(pcCheckbox.exists()).toBe(true);
    expect((pcCheckbox.element as HTMLInputElement).checked).toBe(false);

    await pcCheckbox.setValue(true);
    await flushPromises();

    expect(router.currentRoute.value.query.platforms).toBe('PC');
    expect(api.getGames).toHaveBeenCalledWith(expect.objectContaining({ platforms: expect.arrayContaining(['PC']) }));

    await pcCheckbox.setValue(false);
    await flushPromises();

    expect(router.currentRoute.value.query.platforms).toBeUndefined();
    expect(api.getGames).toHaveBeenCalledWith(expect.objectContaining({ platforms: [] }));
  });

  it('should change sort option and update the URL', async () => {
    const wrapper = mount(CatalegJocs, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();

    await wrapper.find('button[aria-label="Obrir filtres"]').trigger('click');
    await flushPromises();

    const sortSelect = wrapper.find('select');
    expect(sortSelect.exists()).toBe(true);

    await sortSelect.setValue('year');
    await flushPromises();

    expect(router.currentRoute.value.query.sort).toBe('year');
    expect(api.getGames).toHaveBeenCalledWith(expect.objectContaining({ sort: 'year' }));

    await sortSelect.setValue('best');
    await flushPromises();

    expect(router.currentRoute.value.query.sort).toBe('best');
    expect(api.getGames).toHaveBeenCalledWith(expect.objectContaining({ sort: 'best' }));
  });

  it('should display multiple active filter chips and keep remaining selections when one is removed', async () => {
    const wrapper = mount(CatalegJocs, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();
  
    await wrapper.get('button[aria-label="Obrir filtres"]').trigger('click');
    await flushPromises();
  
    await wrapper.get('input[type="checkbox"][value="RPG"]').setValue(true);
    await wrapper.get('input[type="checkbox"][value="Acció"]').setValue(true);
    await wrapper.get('input[type="checkbox"][value="PC"]').setValue(true);
    await flushPromises();
  
    const chipContainer = wrapper.get('div.flex.flex-wrap.gap-2');
    expect(chipContainer.findAll('button.inline-flex.items-center.border').length).toBe(3); // Changed selector
    expect(router.currentRoute.value.query.genres).toBe('RPG,Acció');
    expect(router.currentRoute.value.query.platforms).toBe('PC');
  
    const genreChip = chipContainer.findAll('button.inline-flex.items-center.border').find((chip) => // Changed selector
      chip.text().includes('Gènere: RPG')
    );
    expect(genreChip).toBeDefined();
    await genreChip?.trigger('click');
    await flushPromises();
  
    expect(chipContainer.findAll('button.inline-flex.items-center.border').length).toBe(2); // Changed selector
    expect(router.currentRoute.value.query.genres).toBe('Acció');
  });

  it('should remove an individual active filter chip', async () => {
    await router.push('/cataleg?q=test&genres=RPG&platforms=PC');
    const wrapper = mount(CatalegJocs, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();

    const getChips = () => wrapper.findAll('button.inline-flex.items-center.border'); // Changed selector
    expect(getChips().length).toBe(3);

    const searchChip = getChips().find(c => c.text().includes('Cerca: test'));
    expect(searchChip).toBeDefined();
    await searchChip!.trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.query.q).toBeUndefined();
    expect(getChips().length).toBe(2);

    const genreChip = getChips().find(c => c.text().includes('Gènere: RPG'));
    expect(genreChip).toBeDefined();
    await genreChip!.trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.query.genres).toBeUndefined();
    expect(getChips().length).toBe(1);

    const platformChip = getChips().find(c => c.text().includes('Plataforma: PC'));
    expect(platformChip).toBeDefined();
    await platformChip!.trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.query.platforms).toBeUndefined();
    expect(getChips().length).toBe(0);
  });

  it('should clear all filters', async () => {
    await router.push('/cataleg?q=test&genres=RPG&platforms=PC&sort=year');
    const wrapper = mount(CatalegJocs, {
      global: {
        plugins: [router],
      },
    });
    await flushPromises();

    expect(wrapper.findAll('button.inline-flex.items-center.border').length).toBe(3); // Changed selector

    const clearFiltersButton = wrapper.find('button.text-xs.uppercase.tracking-wide');
    expect(clearFiltersButton.exists()).toBe(true);
    await clearFiltersButton.trigger('click');
    await flushPromises();

    expect(wrapper.findAll('button.inline-flex.items-center.border').length).toBe(0); // Changed selector
    expect(router.currentRoute.value.query).toEqual({ sort: 'best' });

    const lastCall = vi.mocked(api.getGames).mock.calls.at(-1)?.[0];
    expect(lastCall).toEqual(expect.objectContaining({
      q: undefined,
      sort: 'best',
      genres: [],
      platforms: [],
    }));
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, API_BASE } from '@/services/api';

// Mockear fetch globalmente
const mockResponse = (body: any, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response);

const mockFetch = vi.fn();

describe('services/api.ts', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    mockFetch.mockReset();
  });

  describe('buildQueryString (helper)', () => {
    it('should create a valid query string from parameters', () => {
      mockFetch.mockReturnValue(mockResponse({ items: [] }));
      const params = {
        q: 'test',
        sort: 'year',
        page: 2,
        limit: 10,
        genres: ['RPG', 'Action'],
        platforms: ['PC'],
      };
      api.getGames(params);
      const expectedQuery = 'q=test&sort=year&page=2&limit=10&genres=RPG%2CAction&platforms=PC';
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE}/api/games?${expectedQuery}`,
        expect.any(Object)
      );
    });

    it('should return an empty string if no parameters are provided', () => {
        mockFetch.mockReturnValue(mockResponse({ items: [] }));
        api.getGames();
        expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/games`, expect.any(Object));
    });
  });

  describe('http (helper)', () => {
    it('should handle successful responses', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockReturnValue(mockResponse(mockData));

      const result = await api.getGame('1');
      expect(result).toEqual(mockData);
    });

    it('should handle failed responses', async () => {
      const errorResponse = { error: 'Not Found' };
      mockFetch.mockReturnValue(mockResponse(errorResponse, false, 404));

      await expect(api.getGame('1')).rejects.toEqual(errorResponse);
    });
  });

  describe('api methods', () => {
    it('getGames: should fetch games with correct parameters', async () => {
        const mockData = { items: [{ name: 'Game 1' }] };
        mockFetch.mockReturnValue(mockResponse(mockData));
        
        const result = await api.getGames({ q: 'test' });
        
        expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/games?q=test`, expect.any(Object));
        expect(result).toEqual(mockData);
    });

    it('getGame: should fetch a single game', async () => {
        const mockData = { _id: '1', name: 'Game 1' };
        mockFetch.mockReturnValue(mockResponse(mockData));

        const result = await api.getGame('1');

        expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/games/1`, expect.any(Object));
        expect(result).toEqual(mockData);
    });

    it('register: should send registration data', async () => {
        const payload = { name: 'user', email: 'test@test.com', password: 'password' };
        const mockData = { token: '123', user: { id: '1', name: 'user', email: 'test@test.com' } };
        mockFetch.mockReturnValue(mockResponse(mockData));

        const result = await api.register(payload);

        expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
        });
        expect(result).toEqual(mockData);
    });

    it('login: should send login credentials', async () => {
        const payload = { email: 'test@test.com', password: 'password' };
        const mockData = { token: '123', user: { id: '1', name: 'user', email: 'test@test.com' } };
        mockFetch.mockReturnValue(mockResponse(mockData));

        const result = await api.login(payload);

        expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
        });
        expect(result).toEqual(mockData);
    });

    it('me: should request user data with token', async () => {
        const mockData = { user: { id: '1', name: 'user', email: 'test@test.com' } };
        mockFetch.mockReturnValue(mockResponse(mockData));

        const result = await api.me('token123');

        expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/auth/me`, {
            headers: { Authorization: 'Bearer token123' },
        });
        expect(result).toEqual(mockData);
    });

    it('uploadProfileMedia: should send FormData', async () => {
        const mockData = { avatarUrl: 'new-avatar.jpg' };
        mockFetch.mockReturnValue(mockResponse(mockData));
        const formData = new FormData();
        formData.append('avatar', 'file');

        const result = await api.uploadProfileMedia('token123', formData);

        expect(mockFetch).toHaveBeenCalledWith(`${API_BASE}/api/profile/me/media`, {
            method: 'POST',
            headers: { Authorization: 'Bearer token123' },
            body: formData,
        });
        expect(result).toEqual(mockData);
    });

    it('uploadProfileMedia: should handle upload failure', async () => {
        const errorResponse = { error: 'Upload failed' };
        mockFetch.mockReturnValue(mockResponse(errorResponse, false, 500));
        const formData = new FormData();
        formData.append('avatar', 'file');

        await expect(api.uploadProfileMedia('token123', formData)).rejects.toEqual(errorResponse);
    });
  });
});

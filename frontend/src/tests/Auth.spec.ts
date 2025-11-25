import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { auth } from '@/services/auth';
import { api } from '@/services/api';

// Mockear el módulo api
vi.mock('@/services/api');

// Mockear localStorage
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

describe('services/auth.ts', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  const mockUser = { id: '1', name: 'Test User', email: 'test@test.com' };

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal('localStorage', localStorageMock);
    
    // Resetear el estado de auth antes de cada test
    auth.state.token = null;
    auth.state.user = null;
    
    // Resetear mocks de la api
    vi.mocked(api.me).mockClear();
    vi.mocked(api.login).mockClear();
    vi.mocked(api.register).mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('init', () => {
    it('should do nothing if no token is in localStorage', async () => {
      await auth.init();
      expect(api.me).not.toHaveBeenCalled();
      expect(auth.state.user).toBeNull();
    });

    it('should fetch user and update state if token exists and api.me succeeds', async () => {
      localStorageMock.setItem('token', 'token123');
      auth.state.token = 'token123'; // Simular estado inicial
      vi.mocked(api.me).mockResolvedValue({ user: mockUser });

      await auth.init();

      expect(api.me).toHaveBeenCalledWith('token123');
      expect(auth.state.user).toEqual(mockUser);
      expect(JSON.parse(localStorageMock.getItem('user')!)).toEqual(mockUser);
    });

    it('should call logout if token exists but api.me fails', async () => {
      localStorageMock.setItem('token', 'invalidtoken');
      auth.state.token = 'invalidtoken'; // Simular estado inicial
      vi.mocked(api.me).mockRejectedValue(new Error('Invalid token'));

      const logoutSpy = vi.spyOn(auth, 'logout');

      await auth.init();

      expect(api.me).toHaveBeenCalledWith('invalidtoken');
      expect(logoutSpy).toHaveBeenCalled();
      logoutSpy.mockRestore();
    });
  });

  describe('register', () => {
    it('should call api.register and update state on success', async () => {
      const registerData = { name: 'New User', email: 'new@test.com', password: 'password' };
      const response = { token: 'newtoken', user: { ...mockUser, ...registerData } };
      vi.mocked(api.register).mockResolvedValue(response);

      const user = await auth.register(registerData);

      expect(api.register).toHaveBeenCalledWith(registerData);
      expect(auth.state.token).toBe('newtoken');
      expect(auth.state.user).toEqual(response.user);
      expect(localStorageMock.getItem('token')).toBe('newtoken');
      expect(JSON.parse(localStorageMock.getItem('user')!)).toEqual(response.user);
      expect(user).toEqual(response.user);
    });
  });

  describe('login', () => {
    it('should call api.login and update state on success', async () => {
      const loginData = { email: 'test@test.com', password: 'password' };
      const response = { token: 'logintoken', user: mockUser };
      vi.mocked(api.login).mockResolvedValue(response);

      const user = await auth.login(loginData);

      expect(api.login).toHaveBeenCalledWith(loginData);
      expect(auth.state.token).toBe('logintoken');
      expect(auth.state.user).toEqual(mockUser);
      expect(localStorageMock.getItem('token')).toBe('logintoken');
      expect(JSON.parse(localStorageMock.getItem('user')!)).toEqual(mockUser);
      expect(user).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update the user in state and localStorage', () => {
      auth.state.user = mockUser;
      const updates = { name: 'Updated User', bio: 'New bio' };

      auth.updateUser(updates);

      const expectedUser = { ...mockUser, ...updates };
      expect(auth.state.user).toEqual(expectedUser);
      expect(JSON.parse(localStorageMock.getItem('user')!)).toEqual(expectedUser);
    });

    it('should not do anything if there is no user in state', () => {
      auth.state.user = null;
      auth.updateUser({ name: 'Updated User' });
      expect(localStorageMock.getItem('user')).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear state and localStorage', () => {
      auth.state.token = 'sometoken';
      auth.state.user = mockUser;
      localStorageMock.setItem('token', 'sometoken');
      localStorageMock.setItem('user', JSON.stringify(mockUser));
      
      auth.logout();

      expect(auth.state.token).toBeNull();
      expect(auth.state.user).toBeNull();
      expect(localStorageMock.getItem('token')).toBeNull();
      expect(localStorageMock.getItem('user')).toBeNull();
    });
  });
});

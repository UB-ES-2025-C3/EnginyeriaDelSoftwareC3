import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Login from '../views/Login.vue';
import { auth } from '@/services/auth';
import { makeTestRouter } from './setup/router';

// Mockear el servicio de autenticación
vi.mock('@/services/auth');

describe('Login.vue', () => {
  let router;

  beforeEach(async () => {
    // Resetear mocks antes de cada test
    vi.mocked(auth.login).mockClear();

    // Crear un nuevo router para cada test para aislar el estado de navegación
    router = makeTestRouter();
    await router.push('/login');
    await router.isReady();
  });

  it('renders the login form correctly', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find('h2').text()).toBe('Iniciar sessió');
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button.w-full').text()).toBe('Entrar');
  });

  it('should call auth.login and navigate on successful submission', async () => {
    let resolveLogin;
    const loginPromise = new Promise(resolve => {
      resolveLogin = resolve;
    });
    vi.mocked(auth.login).mockReturnValue(loginPromise);

    const routerPushSpy = vi.spyOn(router, 'push');

    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    });

    // Simular la entrada del usuario
    await wrapper.find('input[type="email"]').setValue('test@test.com');
    await wrapper.find('input[type="password"]').setValue('password123');

    // Enviar el formulario
    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();

    // 1. Comprobar que el botón muestra el estado de carga
    expect(wrapper.find('button.w-full').text()).toBe('Entrant...');
    expect(wrapper.find('button.w-full').attributes('disabled')).toBeDefined();

    // 2. Resolver la promesa de login
    resolveLogin({ id: '1', name: 'Test User', email: 'test@test.com' });
    await flushPromises();

    // 3. Comprobar que se llamó a auth.login
    expect(auth.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    });

    // 4. Comprobar que se redirigió al usuario
    expect(routerPushSpy).toHaveBeenCalledWith('/cataleg');
  });

  it('should display an error message on failed login', async () => {
    const error = { error: 'Credencials invàlides' };
    vi.mocked(auth.login).mockRejectedValue(error);
    const routerPushSpy = vi.spyOn(router, 'push');

    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    });
    
    await wrapper.find('input[type="email"]').setValue('wrong@test.com');
    await wrapper.find('input[type="password"]').setValue('wrongpassword');
    
    await wrapper.find('form').trigger('submit');
    
    await flushPromises();
    
    // Comprobar que no se ha navegado
    expect(routerPushSpy).not.toHaveBeenCalled();
    
    // Comprobar que el mensaje de error se muestra
    const errorParagraph = wrapper.find('p.text-red-400');
    expect(errorParagraph.exists()).toBe(true);
    expect(errorParagraph.text()).toBe('Credencials invàlides');
    
    // Comprobar que el botón ya no está en estado de carga
    expect(wrapper.find('button.w-full').text()).toBe('Entrar');
  });

  it('toggles password visibility when the "Veure"/"Ocultar" button is clicked', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    });

    const passwordInput = wrapper.find('input[type="password"]');
    const toggleButton = wrapper.find('button[type="button"]');
    
    // Inicialmente es de tipo password y el botón dice "Veure"
    expect(passwordInput.attributes('type')).toBe('password');
    expect(toggleButton.text()).toBe('Veure');

    // Al hacer click, el tipo cambia a text y el botón a "Ocultar"
    await toggleButton.trigger('click');
    expect(passwordInput.attributes('type')).toBe('text');
    expect(toggleButton.text()).toBe('Ocultar');
    
    // Al volver a hacer click, vuelve al estado inicial
    await toggleButton.trigger('click');
    expect(passwordInput.attributes('type')).toBe('password');
    expect(toggleButton.text()).toBe('Veure');
  });
});
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Register from '../views/Register.vue';
import { auth } from '@/services/auth';
import { makeTestRouter } from './setup/router';

// Mockear el servicio de autenticación
vi.mock('@/services/auth');

describe('Register.vue', () => {
  let router;

  beforeEach(async () => {
    // Resetear mocks
    vi.mocked(auth.register).mockClear();
    vi.mocked(auth.login).mockClear();

    // Crear y preparar el router
    router = makeTestRouter();
    await router.push('/register');
    await router.isReady();
  });

  it('renders the registration form correctly', () => {
    const wrapper = mount(Register, {
      global: {
        plugins: [router],
      },
    });
    expect(wrapper.find('h2').text()).toBe('Crear compte');
    expect(wrapper.find('input[placeholder="El teu nom"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="tucorreo@mail.com"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Mínim 8 caràcters (Aa0...)"]').exists()).toBe(true);
    expect(wrapper.find('button.w-full').text()).toBe('Registrar-me');
  });

  it('shows validation error for invalid email', async () => {
    const wrapper = mount(Register, { global: { plugins: [router] } });
    
    await wrapper.find('input[placeholder="El teu nom"]').setValue('Test User');
    await wrapper.find('input[placeholder="tucorreo@mail.com"]').setValue('not-an-email');
    await wrapper.find('input[placeholder="Mínim 8 caràcters (Aa0...)"]').setValue('Password123');

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(auth.register).not.toHaveBeenCalled();
    expect(wrapper.find('.text-red-400').text()).toBe('El correu electrònic no és vàlid.');
  });

  it('shows validation error for weak password', async () => {
    const wrapper = mount(Register, { global: { plugins: [router] } });
    
    await wrapper.find('input[placeholder="El teu nom"]').setValue('Test User');
    await wrapper.find('input[placeholder="tucorreo@mail.com"]').setValue('test@test.com');
    await wrapper.find('input[placeholder="Mínim 8 caràcters (Aa0...)"]').setValue('weak');

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(auth.register).not.toHaveBeenCalled();
    expect(wrapper.find('.text-red-400').text()).toBe('La contrasenya ha de tenir almenys 8 caràcters, una majúscula, una minúscula i un número.');
  });

  it('calls auth.register and auth.login on successful submission and navigates', async () => {
    let resolveRegister;
    const registerPromise = new Promise(resolve => {
      resolveRegister = resolve;
    });
    vi.mocked(auth.register).mockReturnValue(registerPromise);
    vi.mocked(auth.login).mockResolvedValue({ id: '1', name: 'Test User', email: 'test@test.com' });
    
    const routerPushSpy = vi.spyOn(router, 'push');
    
    const wrapper = mount(Register, { global: { plugins: [router] } });

    const name = 'Test User';
    const email = 'test@test.com';
    const password = 'Password123';

    await wrapper.find('input[placeholder="El teu nom"]').setValue(name);
    await wrapper.find('input[placeholder="tucorreo@mail.com"]').setValue(email);
    await wrapper.find('input[placeholder="Mínim 8 caràcters (Aa0...)"]').setValue(password);
    
    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();

    // 1. Comprobar estado de carga
    expect(wrapper.find('button.w-full').text()).toBe('Creant...');

    // 2. Resolver la promesa de registro
    resolveRegister({ id: '1', name: 'Test User', email: 'test@test.com' });
    await flushPromises();

    // 3. Comprobar llamadas a la API y navegación
    expect(auth.register).toHaveBeenCalledWith({ name, email, password });
    expect(auth.login).toHaveBeenCalledWith({ email, password });
    expect(routerPushSpy).toHaveBeenCalledWith('/Cataleg');

    // 4. Comprobar mensaje de éxito
    expect(wrapper.find('.text-green-400').exists()).toBe(true);
    expect(wrapper.find('.text-green-400').text()).toContain('Registre correcte!');
  });

  it('handles API error for email already in use', async () => {
    const error = { code: 'auth/email-already-in-use' };
    vi.mocked(auth.register).mockRejectedValue(error);
    
    const wrapper = mount(Register, { global: { plugins: [router] } });

    await wrapper.find('input[placeholder="El teu nom"]').setValue('Test User');
    await wrapper.find('input[placeholder="tucorreo@mail.com"]').setValue('test@test.com');
    await wrapper.find('input[placeholder="Mínim 8 caràcters (Aa0...)"]').setValue('Password123');
    
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.find('.text-red-400').text()).toBe('Aquest correu ja està registrat.');
  });

  it('handles a generic API error', async () => {
    const error = { message: 'Error genèric de la API' };
    vi.mocked(auth.register).mockRejectedValue(error);
    
    const wrapper = mount(Register, { global: { plugins: [router] } });

    await wrapper.find('input[placeholder="El teu nom"]').setValue('Test User');
    await wrapper.find('input[placeholder="tucorreo@mail.com"]').setValue('test@test.com');
    await wrapper.find('input[placeholder="Mínim 8 caràcters (Aa0...)"]').setValue('Password123');
    
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.find('.text-red-400').text()).toBe('Error genèric de la API');
  });

  it('toggles password visibility', async () => {
    const wrapper = mount(Register, { global: { plugins: [router] } });
    const passwordInput = wrapper.find('input[placeholder="Mínim 8 caràcters (Aa0...)"]');
    const toggleButton = wrapper.findAll('button[type="button"]').find(b => b.text().match(/Veure|Ocultar/));

    expect(passwordInput.attributes('type')).toBe('password');
    expect(toggleButton.text()).toBe('Veure');

    await toggleButton.trigger('click');
    expect(passwordInput.attributes('type')).toBe('text');
    expect(toggleButton.text()).toBe('Ocultar');
  });
});

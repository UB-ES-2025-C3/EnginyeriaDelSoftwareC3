import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LandingPage from '../views/LandingPage.vue';
import { makeTestRouter } from './setup/router';

describe('LandingPage.vue', () => {
  let router;

  beforeEach(async () => {
    router = makeTestRouter();
    await router.push('/');
    await router.isReady();
  });

  it('renders the landing page correctly', () => {
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [router],
      },
    });

    // Check h1 text content, ignoring newline differences
    const h1Text = wrapper.find('h1').text();
    expect(h1Text).toContain('El teu món');
    expect(h1Text).toContain('gamer comença!');

    // Find buttons by their text content
    expect(wrapper.findAll('button').find(b => b.text() === 'Iniciar sessió/Registrar-se')?.exists()).toBe(true);
    expect(wrapper.findAll('button').find(b => b.text() === 'Accedeix com a convidat')?.exists()).toBe(true);
    
    expect(wrapper.find('img[alt="Pixel Mario"]').exists()).toBe(true);
  });

  it('navigates to /login when login/register button is clicked', async () => {
    const routerPushSpy = vi.spyOn(router, 'push');
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [router],
      },
    });

    // Find button by text and trigger click
    const loginButton = wrapper.findAll('button').find(b => b.text() === 'Iniciar sessió/Registrar-se');
    expect(loginButton?.exists()).toBe(true);
    await loginButton!.trigger('click');

    expect(routerPushSpy).toHaveBeenCalledWith('/login');
  });

  it('navigates to /Cataleg when guest button is clicked', async () => {
    const routerPushSpy = vi.spyOn(router, 'push');
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [router],
      },
    });
    
    // Find button by text and trigger click
    const guestButton = wrapper.findAll('button').find(b => b.text() === 'Accedeix com a convidat');
    expect(guestButton?.exists()).toBe(true);
    await guestButton!.trigger('click');

    expect(routerPushSpy).toHaveBeenCalledWith('/Cataleg');
  });
});

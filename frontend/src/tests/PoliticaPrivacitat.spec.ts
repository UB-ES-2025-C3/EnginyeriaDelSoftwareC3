import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PoliticaPrivacitat from '../views/PoliticaPrivacitat.vue';
import { makeTestRouter } from './setup/router';

const PRIVACITAT_TITLE = 'Política de privacitat | CheckPoint';
const PRIVACITAT_DESCRIPTION = 'Coneix com CheckPoint gestiona les teves dades personals, les finalitats i els teus drets.';

describe('PoliticaPrivacitat.vue', () => {
  beforeEach(() => {
    document.title = 'Original Title';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'Original description');
  });

  it('renderitza el títol i seccions principals', async () => {
    const router = makeTestRouter();
    await router.push('/privacitat');
    await router.isReady();

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

  it('estableix i restaura els metadades del document en muntar/desmuntar', async () => {
    const router = makeTestRouter();
    await router.push('/privacitat');
    await router.isReady();

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
});

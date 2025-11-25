import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TermesUsu from '../views/TermesUsu.vue';
import { makeTestRouter } from './setup/router';

const TERMES_TITLE = "Termes d'ús | CheckPoint";
const TERMES_DESCRIPTION = 'Consulta les condicions de CheckPoint sobre acceptació del servei, normes d’ús i responsabilitats.';

describe('TermesUsu.vue', () => {
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

  it('mostra el títol i les seccions legals clau', async () => {
    const router = makeTestRouter();
    await router.push('/termes');
    await router.isReady();

    const wrapper = mount(TermesUsu, {
      global: { plugins: [router] },
    });

    expect(wrapper.get('h1').text()).toContain("Termes d'ús");
    const headings = wrapper.findAll('h2').map((node) => node.text());
    expect(headings).toEqual(expect.arrayContaining([
      'Acceptació dels Termes',
      'Compte d\'usuari i seguretat',
      'Normes d\'ús',
      'Limitació de responsabilitat',
    ]));
  });

  it('configura i restaura <title> i la descripció meta', async () => {
    const router = makeTestRouter();
    await router.push('/termes');
    await router.isReady();

    const wrapper = mount(TermesUsu, {
      global: { plugins: [router] },
    });

    const metaDescription = document.querySelector('meta[name="description"]');
    expect(document.title).toBe(TERMES_TITLE);
    expect(metaDescription?.getAttribute('content')).toBe(TERMES_DESCRIPTION);

    wrapper.unmount();

    const restoredMeta = document.querySelector('meta[name="description"]');
    expect(document.title).toBe('Original Title');
    expect(restoredMeta?.getAttribute('content')).toBe('Original description');
  });
});

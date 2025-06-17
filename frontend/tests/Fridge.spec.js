import { mount, flushPromises } from '@vue/test-utils';
import FridgeView from '../src/components/Fridge.vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/api', () => {
  return {
    authFetch: vi.fn(),
  };
});

const { authFetch } = await import('@/api');

describe('FridgeView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('wyświetla składniki w lodówce', async () => {
    authFetch.mockImplementation((url) => {
      if (url.includes('/fridge/current')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, name: 'Pomidor' },
            { id: 2, name: 'Ser feta' },
          ]),
        });
      }
      if (url.includes('/ingredients')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, name: 'Pomidor' },
            { id: 2, name: 'Ser feta' },
            { id: 3, name: 'Czosnek' },
          ]),
        });
      }
    });

    const wrapper = mount(FridgeView);
    await flushPromises();

    expect(wrapper.findAll('.fridge-item')).toHaveLength(2);
    expect(wrapper.text()).toContain('Pomidor');
    expect(wrapper.text()).toContain('Ser feta');
  });

  it('wyświetla wiadomość jeśli lodówka jest pusta', async () => {
    authFetch.mockImplementation((url) => {
      if (url.includes('/fridge/current')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      if (url.includes('/ingredients')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, name: 'Pomidor' },
          ]),
        });
      }
    });

    const wrapper = mount(FridgeView);
    await flushPromises();

    expect(wrapper.find('.empty-msg').exists()).toBe(true);
    expect(wrapper.text()).toContain('Lodówka jest pusta');
  });

  it('dodaje składnik do lodówki', async () => {
    authFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]), // fridge
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'Pomidor' }]), // ingredients
      })
      .mockResolvedValueOnce({ ok: true }) // PATCH
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'Pomidor' }]), // updated fridge
      });

    const wrapper = mount(FridgeView);
    await flushPromises();

    // Wybór składnika
    await wrapper.find('select').setValue('1');
    await wrapper.find('button.add-btn').trigger('click');
    await flushPromises();

    expect(authFetch).toHaveBeenCalledWith(expect.stringContaining('/api/fridge'), expect.objectContaining({
      method: 'PATCH',
    }));
    expect(wrapper.findAll('.fridge-item')).toHaveLength(1);
    expect(wrapper.text()).toContain('Pomidor');
  });

  it('usuwa składnik z lodówki', async () => {
    authFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'Pomidor' }]),
      }) // fridge
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'Pomidor' }]),
      }) // ingredients
      .mockResolvedValueOnce({ ok: true }) // PATCH
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      }); // updated fridge

    const wrapper = mount(FridgeView);
    await flushPromises();

    await wrapper.find('button.remove-btn').trigger('click');
    await flushPromises();

    expect(authFetch).toHaveBeenCalledWith(expect.stringContaining('/api/fridge'), expect.objectContaining({
      method: 'PATCH',
    }));
    expect(wrapper.find('.empty-msg').exists()).toBe(true);
  });
});

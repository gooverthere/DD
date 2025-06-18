import { mount, flushPromises } from '@vue/test-utils';
import Calendar from '../src/components/Calendar.vue';
import { vi } from 'vitest';

vi.mock('../src/api', () => ({
  authFetch: vi.fn((url) => {
    if (url.includes('/api/calendar')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }
    if (url.includes('/api/meals')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 1, name: 'Sałatka grecka' },
            { id: 2, name: 'Kurczak z ryżem' },
          ]),
      });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  }),
}));

describe('Calendar.vue', () => {
  it('renderuje nagłówek kalendarza', () => {
    const wrapper = mount(Calendar);
    expect(wrapper.text()).toContain('Kalendarz posiłków');
  });

  it('renderuje input do wyboru daty', () => {
    const wrapper = mount(Calendar);
    const dateInput = wrapper.find('input[type="date"]');
    expect(dateInput.exists()).toBe(true);
  });

  it('renderuje przycisk dodawania posiłku', async () => {
    const wrapper = mount(Calendar);
    await flushPromises();
    const addButton = wrapper.find('button.add-btn');
    expect(addButton.exists()).toBe(true);
    expect(addButton.element.disabled).toBe(true);
  });

  it('aktywizuje przycisk po wybraniu daty i posiłku', async () => {
    const wrapper = mount(Calendar);
    await flushPromises();

    const dateInput = wrapper.find('input[type="date"]');
    await dateInput.setValue('2025-06-17');

    const select = wrapper.find('select');
    await select.setValue('1');

    await flushPromises();

    const addButton = wrapper.find('button.add-btn');
    expect(addButton.element.disabled).toBe(false);
  });
});

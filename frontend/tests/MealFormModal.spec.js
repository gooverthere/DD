import { mount, flushPromises } from '@vue/test-utils';
import MealFormModal from '@/components/MealFormModal.vue';

vi.mock('@/api', () => ({
  authFetch: vi.fn((url) => {
    if (url.includes('/ingredients')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, name: 'Jajko' },
          { id: 2, name: 'Ser' }
        ])
      });
    }
    if (url.includes('/meals/add')) {
      return Promise.resolve({ ok: true });
    }
    return Promise.resolve({ ok: false });
  })
}));

describe('MealFormModal.vue', () => {
  it('renderuje formularz, gdy modelValue = true', async () => {
    const wrapper = mount(MealFormModal, {
      props: { modelValue: true }
    });

    await flushPromises();

    expect(wrapper.find('.modal').exists()).toBe(true);
    expect(wrapper.text()).toContain('Dodaj nowy posiłek');
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(2); // składniki
  });

  it('wysyła formularz i emituje "meal-added"', async () => {
    const wrapper = mount(MealFormModal, {
      props: { modelValue: true }
    });

    await flushPromises();

    await wrapper.find('#name').setValue('Testowy posiłek');
    await wrapper.find('#description').setValue('Opis');
    await wrapper.find('#calories').setValue(300);
    await wrapper.find('input[type="checkbox"]').setChecked();

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(wrapper.emitted('meal-added')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });

  it('zamyka modal po kliknięciu tła', async () => {
    const wrapper = mount(MealFormModal, {
      props: { modelValue: true }
    });

    await flushPromises();

    await wrapper.find('.modal-overlay').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });

  it('zamyka modal po kliknięciu Anuluj', async () => {
    const wrapper = mount(MealFormModal, {
      props: { modelValue: true }
    });

    await flushPromises();

    await wrapper.find('button.btn-secondary').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });
});

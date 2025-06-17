import { mount, flushPromises } from '@vue/test-utils';
import MealList from '@/components/MealList.vue';
import MealCard from '@/components/MealCard.vue';
import MealFormModal from '@/components/MealFormModal.vue';

vi.mock('@/api', () => ({
  authFetch: vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 1,
          name: 'Kurczak z ryżem',
          calories: 550,
          description: 'Pieczony kurczak z ryżem i warzywami.',
          ingredients: [{ name: 'Kurczak' }, { name: 'Ryż' }],
        },
      ]),
    })
  )
}));

describe('MealList.vue', () => {
  it('renderuje listę posiłków', async () => {
    const wrapper = mount(MealList);
    await flushPromises();

    expect(wrapper.findComponent(MealCard).exists()).toBe(true);
    expect(wrapper.text()).toContain('Kurczak z ryżem');
  });


  it('pokazuje modal po kliknięciu przycisku', async () => {
    const wrapper = mount(MealList);
    await flushPromises();

    await wrapper.find('button.btn-primary').trigger('click');
    expect(wrapper.findComponent(MealFormModal).props('modelValue')).toBe(true);
  });

  it('obsługuje zdarzenie meal-added i odświeża listę', async () => {
    const wrapper = mount(MealList);
    await flushPromises();

    wrapper.findComponent(MealFormModal).vm.$emit('meal-added');
    await flushPromises();

    expect(wrapper.text()).toContain('Posiłek dodany pomyślnie!');
  });
});

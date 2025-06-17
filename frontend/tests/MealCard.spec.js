import { mount } from '@vue/test-utils';
import MealCard from '@/components/MealCard.vue';

describe('MealCard.vue', () => {
  it('renderuje poprawnie dane posiłku', () => {
    const meal = {
      name: 'Sałatka grecka',
      calories: 250,
      description: 'Klasyczna sałatka z fetą',
      ingredients: [{ name: 'Pomidor' }, { name: 'Ogórek' }, { name: 'Ser feta' }],
    };

    const wrapper = mount(MealCard, {
      props: { meal },
    });

    expect(wrapper.text()).toContain('Sałatka grecka');
    expect(wrapper.text()).toContain('250 kcal');
    expect(wrapper.text()).toContain('Klasyczna sałatka z fetą');
    expect(wrapper.text()).toContain('Pomidor, Ogórek, Ser feta');
  });

  it('obsługuje brak opisu i kalorii', () => {
    const meal = {
      name: 'Zupa warzywna',
      calories: null,
      ingredients: [],
    };

    const wrapper = mount(MealCard, {
      props: { meal },
    });

    expect(wrapper.text()).toContain('Zupa warzywna');
    expect(wrapper.text()).toContain('brak kcal');
    expect(wrapper.text()).toContain('Składniki: Brak');
  });

  it('nie renderuje opisu jeśli jest pusty', () => {
    const meal = {
      name: 'Omlet',
      calories: 400,
      description: '',
      ingredients: [{ name: 'Jajka' }],
    };

    const wrapper = mount(MealCard, {
      props: { meal },
    });

    expect(wrapper.find('.meal-description').exists()).toBe(false);
  });
});

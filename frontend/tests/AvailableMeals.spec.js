import { describe, it, expect, vi, beforeEach } from 'vitest';

import { mount } from '@vue/test-utils';
import AvailableMeals from '../src/components/AvailableMeals.vue';
import { nextTick } from 'vue';

vi.mock('@/api', () => ({
    authFetch: vi.fn(() =>
        Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve([]),
        })
    ),
}));

describe('AvailableMeals.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows empty message when no meals are available', async () => {
        const { authFetch } = await import('@/api');
        authFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([]),
        });

        const wrapper = mount(AvailableMeals);
        await nextTick();

        expect(wrapper.find('.empty-msg').exists()).toBe(true);
        expect(wrapper.text()).toContain('Brak posiłków do wyświetlenia.');
    });
});

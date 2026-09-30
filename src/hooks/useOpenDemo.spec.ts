import { act, renderHook, waitFor } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { createWrapper } from '../../test-utils/createWrapper';
import { startDemo } from '../mocks/browser';
import { useOpenDemo } from './useOpenDemo';

// Service worker в jsdom не поднять: подменяем только его запуск, запросы по-прежнему отвечает MSW.
vi.mock('../mocks/browser', () => ({ startDemo: vi.fn() }));

const renderOpenDemo = (route = '/') => {
    const { wrapper } = createWrapper({ route });
    return renderHook(() => ({ demo: useOpenDemo(), location: useLocation() }), { wrapper });
};

describe('useOpenDemo', () => {
    it('открывает демо и уводит в чаты', async () => {
        const { result } = renderOpenDemo();

        await act(() => result.current.demo.open());

        expect(result.current.location.pathname).toBe('/chat');
        expect(result.current.demo.status).toBe('idle');
    });

    it('берёт сценарий из ?demo и открывает его сам', async () => {
        const { result } = renderOpenDemo('/?demo=offline');

        expect(result.current.demo.scenario).toBe('offline');
        await waitFor(() => expect(result.current.location.pathname).toBe('/chat'));
        expect(startDemo).toHaveBeenCalledWith('offline');
    });

    it('если воркер не встал — статус failed и остаёмся на входе', async () => {
        vi.mocked(startDemo).mockImplementation(async () => {
            throw new Error('no service worker');
        });
        const { result } = renderOpenDemo();

        await act(() => result.current.demo.open());

        expect(result.current.demo.status).toBe('failed');
        expect(result.current.location.pathname).toBe('/');
    });
});

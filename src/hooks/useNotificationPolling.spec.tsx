import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { beforeEach, expect, it, vi } from 'vitest';
import { createStore } from '@/app/store/store';
import { setCredentials } from '@/app/api/httpClient';
import { incomingMessage } from '@/mocks/fixtures';
import { mockInstance } from '@/mocks/mockInstance';
import { DEMO_CREDENTIALS } from '@/app/config';
import { useNotificationPolling } from './useNotificationPolling';

beforeEach(() => setCredentials(DEMO_CREDENTIALS));

it('кладёт входящие в стор и перестаёт опрашивать после размонтирования', async () => {
    const store = createStore();
    const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
    mockInstance.push(
        incomingMessage({ idMessage: 'in-1', chatId: '10000000', text: 'Привет', senderName: 'Иван' }),
    );

    const { unmount } = renderHook(() => useNotificationPolling(DEMO_CREDENTIALS.idInstance), { wrapper });

    await vi.waitFor(() =>
        expect(store.getState().chat.chats['10000000']).toMatchObject({ title: 'Иван', unread: 1 }),
    );
    unmount();

    mockInstance.push(incomingMessage({ idMessage: 'in-2', chatId: '10000000', text: 'Ещё одно' }));
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(store.getState().chat.messages['10000000']).toHaveLength(1);
    expect(mockInstance.queue).toHaveLength(1);
});

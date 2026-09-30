import { act, renderHook } from '@testing-library/react';
import { expect, it } from 'vitest';
import { createWrapper } from '../../test-utils/createWrapper';
import { sessionActions } from '../app/store/slices/session/sessionSlice';
import { useLogout } from './useLogout';

it('выход чистит стор и хранилища', () => {
    const { wrapper, store } = createWrapper();
    store.dispatch(
        sessionActions.sessionStarted({
            idInstance: '1101000001',
            mode: 'live',
            remember: true,
            scenario: null,
        }),
    );
    localStorage.setItem('green-api-chat:session', '{}');
    sessionStorage.setItem('green-api-chat:chats:1101000001', '{}');
    const { result } = renderHook(() => useLogout(), { wrapper });

    act(() => {
        result.current();
    });

    expect(store.getState().session.current).toBeNull();
    expect(localStorage.length + sessionStorage.length).toBe(0);
});

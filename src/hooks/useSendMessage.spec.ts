import { act, renderHook, waitFor } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { createWrapper } from '../../test-utils/createWrapper';
import { setCredentials } from '../app/api/httpClient';
import { DEMO_CREDENTIALS } from '../app/config';
import { useSendMessage } from './useSendMessage';

const chatId = '901234567';
const typeText = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLTextAreaElement>;
const submitEvent = { preventDefault: () => {} } as FormEvent;

describe('useSendMessage', () => {
    beforeEach(() => setCredentials(DEMO_CREDENTIALS));

    it('отправляет текст, очищает поле, а сообщение получает idMessage', async () => {
        const { wrapper, store } = createWrapper();
        const { result } = renderHook(() => useSendMessage(chatId), { wrapper });

        act(() => result.current.onChange(typeText('Привет')));
        act(() => result.current.onSubmit(submitEvent));

        expect(result.current.text).toBe('');
        await waitFor(() => expect(store.getState().chat.messages[chatId][0].status).toBe('sent'));
    });

    it('слишком длинное сообщение не отправляет и показывает счётчик', () => {
        const { wrapper, store } = createWrapper();
        const { result } = renderHook(() => useSendMessage(chatId), { wrapper });

        act(() => result.current.onChange(typeText('я'.repeat(4097))));
        act(() => result.current.onSubmit(submitEvent));

        expect(result.current).toMatchObject({ tooLong: true, canSend: false, showCounter: true });
        expect(store.getState().chat.messages[chatId]).toBeUndefined();
    });
});

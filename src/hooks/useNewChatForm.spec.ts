import { act, renderHook, waitFor } from '@testing-library/react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createWrapper } from '../../test-utils/createWrapper';
import { setCredentials } from '../app/api/httpClient';
import { DEMO_CREDENTIALS } from '../app/config';
import { NEW_CHAT_TEXTS } from '../shared/constants/texts';
import { useNewChatForm } from './useNewChatForm';

const typePhone = (phoneField: UseFormRegisterReturn, value: string) =>
    phoneField.onChange({ target: { name: 'phone', value }, type: 'change' });

describe('useNewChatForm', () => {
    beforeEach(() => setCredentials(DEMO_CREDENTIALS));

    it('находит номер через checkAccount и отдаёт chatId', async () => {
        const onCreated = vi.fn();
        const { wrapper, store } = createWrapper();
        const { result } = renderHook(() => useNewChatForm(onCreated), { wrapper });

        await act(() => typePhone(result.current.phoneField, '+7 (900) 123-45-67'));
        await act(() => result.current.submit());

        await waitFor(() => expect(onCreated).toHaveBeenCalledWith('001234567'));
        expect(store.getState().chat.chats['001234567']).toMatchObject({ phone: '79001234567' });
    });

    it('текст ошибки thunk попадает в root-ошибку формы', async () => {
        const onCreated = vi.fn();
        const { wrapper } = createWrapper();
        const { result } = renderHook(() => useNewChatForm(onCreated), { wrapper });

        await act(() => typePhone(result.current.phoneField, '+7 900 000-00-00'));
        await act(() => result.current.submit());

        await waitFor(() => expect(result.current.errors.root?.message).toBe(NEW_CHAT_TEXTS.notFound));
        expect(onCreated).not.toHaveBeenCalled();
    });
});

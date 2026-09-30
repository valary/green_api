import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setCredentials } from '../../app/api/httpClient';
import { server } from '../../mocks/node';
import { DEMO_CREDENTIALS } from '../../app/config';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { NewChatDialog } from './NewChatDialog';
import { ERROR_TEXTS, NEW_CHAT_TEXTS } from '../../shared/constants/texts';

const countCheckAccount = () => {
    const calls = { count: 0 };
    server.events.on('request:start', ({ request }) => {
        if (request.url.includes('/checkAccount/')) calls.count++;
    });
    return calls;
};

const submitPhone = async (phone: string) => {
    const user = userEvent.setup();
    const field = screen.getByLabelText(NEW_CHAT_TEXTS.phoneLabel);
    await user.clear(field);
    await user.type(field, phone);
    await user.click(screen.getByRole('button', { name: NEW_CHAT_TEXTS.submit }));
};

describe('NewChatDialog', () => {
    beforeEach(() => {
        setCredentials(DEMO_CREDENTIALS);
        server.events.removeAllListeners();
    });

    it('короткий номер не уходит в checkAccount', async () => {
        const calls = countCheckAccount();
        renderWithProviders(<NewChatDialog onClose={vi.fn()} onCreated={vi.fn()} />);

        await submitPhone('12345');

        expect(await screen.findByText(NEW_CHAT_TEXTS.phoneFormat)).toBeInTheDocument();
        expect(calls.count).toBe(0);
    });

    it('один номер в разных записях — один чат и один запрос', async () => {
        const calls = countCheckAccount();
        const onCreated = vi.fn();
        const { store } = renderWithProviders(<NewChatDialog onClose={vi.fn()} onCreated={onCreated} />);

        await submitPhone('+7 (900) 123-45-67');
        await submitPhone('89001234567');

        await vi.waitFor(() => expect(onCreated).toHaveBeenCalledTimes(2));
        expect(onCreated.mock.calls[0][0]).toBe(onCreated.mock.calls[1][0]);
        expect(Object.values(store.getState().chat.chats)).toEqual([
            expect.objectContaining({ title: NEW_CHAT_TEXTS.phonePlaceholder, phone: '79001234567' }),
        ]);
        expect(calls.count).toBe(1);
    });

    it.each([
        ['+7 900 000-00-00', NEW_CHAT_TEXTS.notFound],
        ['+7 900 000-04-66', ERROR_TEXTS.quota],
    ])('%s → понятная ошибка, чат не создан', async (phone, text) => {
        const { store } = renderWithProviders(<NewChatDialog onClose={vi.fn()} onCreated={vi.fn()} />);

        await submitPhone(phone);

        expect(await screen.findByRole('alert')).toHaveTextContent(text);
        expect(store.getState().chat.chats).toEqual({});
    });
});

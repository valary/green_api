import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setCredentials } from '@/shared/api';
import { DEMO_CREDENTIALS } from '@/shared/config';
import { renderWithProviders } from '@/test/renderWithProviders';
import { Composer } from './Composer';

const chatId = '901234567';
const sentTexts = (store: ReturnType<typeof renderWithProviders>['store']) =>
    (store.getState().chat.messages[chatId] ?? []).map((message) => message.text);

describe('Composer', () => {
    beforeEach(() => setCredentials(DEMO_CREDENTIALS));

    it('пустое сообщение и одни пробелы не отправляются', async () => {
        const user = userEvent.setup();
        const { store } = renderWithProviders(<Composer chatId={chatId} />);

        await user.type(screen.getByLabelText('Сообщение'), '   {Enter}');
        await user.click(screen.getByRole('button', { name: 'Отправить' }));

        expect(sentTexts(store)).toEqual([]);
        expect(screen.getByRole('button', { name: 'Отправить' })).toHaveAttribute('aria-disabled', 'true');
    });

    it('Shift+Enter переносит строку, Enter отправляет и очищает поле', async () => {
        const user = userEvent.setup();
        const { store } = renderWithProviders(<Composer chatId={chatId} />);
        const field = screen.getByLabelText('Сообщение');

        await user.type(field, 'Строка 1{Shift>}{Enter}{/Shift}Строка 2');
        expect(field).toHaveValue('Строка 1\nСтрока 2');

        await user.keyboard('{Enter}');
        expect(field).toHaveValue('');
        expect(sentTexts(store)).toEqual(['Строка 1\nСтрока 2']);
        await vi.waitFor(() => expect(store.getState().chat.messages[chatId][0].status).toBe('sent'));
    });

    it('больше 4096 символов — счётчик и отправка недоступна', async () => {
        const user = userEvent.setup();
        const { store } = renderWithProviders(<Composer chatId={chatId} />);

        await user.click(screen.getByLabelText('Сообщение'));
        await user.paste('я'.repeat(4097));
        await user.keyboard('{Enter}');

        expect(screen.getByText('4 097 / 4 096')).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Сообщение длиннее 4 096 символов');
        expect(screen.getByRole('button', { name: 'Отправить' })).toHaveAttribute('aria-disabled', 'true');
        expect(sentTexts(store)).toEqual([]);
    });
});

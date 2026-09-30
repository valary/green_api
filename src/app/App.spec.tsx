import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { expect, it, vi } from 'vitest';
import { mockInstance } from '../mocks/mockInstance';
import { DEMO_CREDENTIALS } from './config';
import { lightTheme } from '../theme/theme';
import { routes } from './router';
import { createStore } from './store/store';
import {
    CHAT_LIST_TEXTS,
    COMPOSER_TEXTS,
    LOGIN_TEXTS,
    MESSAGE_STATUS_TEXTS,
    NEW_CHAT_TEXTS,
} from '../shared/constants/texts';

const renderApp = () => {
    const router = createMemoryRouter(routes);
    render(
        <Provider store={createStore()}>
            <ThemeProvider theme={lightTheme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>,
    );
    return router;
};

it('вход → новый чат → отправка → ответ приходит в тот же чат → выход', async () => {
    const user = userEvent.setup();
    const router = renderApp();

    await user.type(screen.getByLabelText(LOGIN_TEXTS.idInstanceLabel), DEMO_CREDENTIALS.idInstance);
    await user.type(screen.getByLabelText(LOGIN_TEXTS.tokenLabel), DEMO_CREDENTIALS.apiTokenInstance);
    await user.clear(screen.getByLabelText(LOGIN_TEXTS.apiUrlLabel));
    await user.type(screen.getByLabelText(LOGIN_TEXTS.apiUrlLabel), DEMO_CREDENTIALS.apiUrl);
    await user.click(screen.getByRole('button', { name: LOGIN_TEXTS.submit }));

    // страница чата приезжает отдельным чанком
    expect(await screen.findByText(CHAT_LIST_TEXTS.emptyTitle, {}, { timeout: 5000 })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: CHAT_LIST_TEXTS.newChat }));
    await user.type(screen.getByLabelText(NEW_CHAT_TEXTS.phoneLabel), '+7 (900) 123-45-67{Enter}');
    expect(await screen.findByRole('heading', { name: NEW_CHAT_TEXTS.phonePlaceholder })).toBeInTheDocument();

    await user.type(screen.getByLabelText(COMPOSER_TEXTS.label), 'Тест{Enter}');
    const feed = screen.getByRole('log');
    expect(within(feed).getByText('Тест')).toBeInTheDocument();
    expect(
        await within(feed).findByText('Привет! Сообщение пришло, отвечаю из Telegram'),
    ).toBeInTheDocument();
    expect(await within(feed).findByLabelText(MESSAGE_STATUS_TEXTS.read)).toBeInTheDocument();
    await vi.waitFor(() => expect(mockInstance.queue).toHaveLength(0));

    await user.click(screen.getByRole('button', { name: CHAT_LIST_TEXTS.logout }));
    expect(await screen.findByRole('heading', { name: LOGIN_TEXTS.title })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
    expect(sessionStorage.length + localStorage.length).toBe(0);
}, 15_000);

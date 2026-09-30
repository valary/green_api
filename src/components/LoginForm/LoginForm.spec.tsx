import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '@/mocks/node';
import { renderWithProviders } from 'test-utils/renderWithProviders';
import { LoginForm } from './LoginForm';

const apiUrl = 'https://1101.api.green-api.com';

function answerState(response: () => Response) {
    const methods: string[] = [];
    server.use(
        http.all(`${apiUrl}/*`, ({ request }) => {
            methods.push(new URL(request.url).pathname.split('/')[2]);
            return response();
        }),
    );
    return methods;
}

async function fillAndSubmit() {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('idInstance'), '1101000001');
    await user.type(screen.getByLabelText('apiTokenInstance'), 'some-token');
    await user.click(screen.getByRole('button', { name: 'Войти' }));
    return user;
}

describe('LoginForm', () => {
    it('подставляет apiUrl по idInstance, пока его не правили руками', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginForm />);
        const apiUrlField = screen.getByLabelText('apiUrl');

        await user.type(screen.getByLabelText('idInstance'), '1101000001');
        expect(apiUrlField).toHaveValue(apiUrl);

        await user.clear(apiUrlField);
        await user.type(apiUrlField, 'https://custom.example.com');
        await user.type(screen.getByLabelText('idInstance'), '2');
        expect(apiUrlField).toHaveValue('https://custom.example.com');
    });

    it('показывает ошибку поля после ухода с него', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginForm />);

        await user.click(screen.getByLabelText('apiTokenInstance'));
        await user.tab();

        expect(await screen.findByText('Введите apiTokenInstance')).toBeInTheDocument();
    });

    it('неверный токен — текст про apiTokenInstance, сессия не начинается', async () => {
        answerState(() => new HttpResponse(null, { status: 401 }));
        const { store } = renderWithProviders(<LoginForm />);

        await fillAndSubmit();

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Неверный apiTokenInstance. Проверьте токен в личном кабинете GREEN-API',
        );
        expect(store.getState().session.current).toBeNull();
    });

    it('неавторизованный инстанс — подсказка про QR и больше никаких запросов', async () => {
        const methods = answerState(() => HttpResponse.json({ stateInstance: 'notAuthorized' }));
        renderWithProviders(<LoginForm />);

        await fillAndSubmit();

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Инстанс не авторизован в Telegram (статус: notAuthorized). Откройте личный кабинет GREEN-API и подключите аккаунт по QR-коду',
        );
        expect(methods).toEqual(['getStateInstance']);
    });

    it('без «Запомнить» токен лежит только в sessionStorage', async () => {
        answerState(() =>
            HttpResponse.json({
                stateInstance: 'authorized',
                webhookUrl: '',
                incomingWebhook: 'yes',
                outgoingWebhook: 'yes',
            }),
        );
        const { store } = renderWithProviders(<LoginForm />);

        await fillAndSubmit();

        await vi.waitFor(() => expect(store.getState().session.current?.idInstance).toBe('1101000001'));
        expect(sessionStorage.getItem('green-api-chat:session')).toContain('some-token');
        expect(localStorage.length).toBe(0);
    });
});

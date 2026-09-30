import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../mocks/node';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { LoginForm } from './LoginForm';
import { ERROR_TEXTS, LOGIN_TEXTS } from '../../shared/constants/texts';

const apiUrl = LOGIN_TEXTS.apiUrlPlaceholder;

const answerState = (response: () => Response) => {
    const methods: string[] = [];
    server.use(
        http.all(`${apiUrl}/*`, ({ request }) => {
            methods.push(new URL(request.url).pathname.split('/')[2]);
            return response();
        }),
    );
    return methods;
};

const fillAndSubmit = async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(LOGIN_TEXTS.idInstanceLabel), LOGIN_TEXTS.idInstancePlaceholder);
    await user.type(screen.getByLabelText(LOGIN_TEXTS.tokenLabel), 'some-token');
    await user.click(screen.getByRole('button', { name: LOGIN_TEXTS.submit }));
    return user;
};

describe('LoginForm', () => {
    it('подставляет apiUrl по idInstance, пока его не правили руками', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginForm />);
        const apiUrlField = screen.getByLabelText(LOGIN_TEXTS.apiUrlLabel);

        await user.type(
            screen.getByLabelText(LOGIN_TEXTS.idInstanceLabel),
            LOGIN_TEXTS.idInstancePlaceholder,
        );
        expect(apiUrlField).toHaveValue(apiUrl);

        await user.clear(apiUrlField);
        await user.type(apiUrlField, 'https://custom.example.com');
        await user.type(screen.getByLabelText(LOGIN_TEXTS.idInstanceLabel), '2');
        expect(apiUrlField).toHaveValue('https://custom.example.com');
    });

    it('показывает ошибку поля после ухода с него', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginForm />);

        await user.click(screen.getByLabelText(LOGIN_TEXTS.tokenLabel));
        await user.tab();

        expect(await screen.findByText(LOGIN_TEXTS.tokenRequired)).toBeInTheDocument();
    });

    it('неверный токен — текст про apiTokenInstance, сессия не начинается', async () => {
        answerState(() => new HttpResponse(null, { status: 401 }));
        const { store } = renderWithProviders(<LoginForm />);

        await fillAndSubmit();

        expect(await screen.findByRole('alert')).toHaveTextContent(ERROR_TEXTS.unauthorized);
        expect(store.getState().session.current).toBeNull();
    });

    it('неавторизованный инстанс — подсказка про QR и больше никаких запросов', async () => {
        const methods = answerState(() => HttpResponse.json({ stateInstance: 'notAuthorized' }));
        renderWithProviders(<LoginForm />);

        await fillAndSubmit();

        expect(await screen.findByRole('alert')).toHaveTextContent(
            ERROR_TEXTS.notAuthorized('notAuthorized'),
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

        await vi.waitFor(() =>
            expect(store.getState().session.current?.idInstance).toBe(LOGIN_TEXTS.idInstancePlaceholder),
        );
        expect(sessionStorage.getItem('green-api-chat:session')).toContain('some-token');
        expect(localStorage.length).toBe(0);
    });
});

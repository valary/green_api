import type { ReceivedEvent } from '../../types/chat';
import { delay, http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setCredentials } from './httpClient';
import { incomingMessage, outgoingStatus } from '../../mocks/fixtures';
import { mockInstance } from '../../mocks/mockInstance';
import { server } from '../../mocks/node';
import { DEMO_CREDENTIALS } from '../config';

import { pollNotifications } from './pollNotifications';
import { ERROR_TEXTS } from '../../shared/constants/texts';

const receiveUrl = `${DEMO_CREDENTIALS.apiUrl}/:instance/receiveNotification/:token`;

let controller: AbortController;

const startPolling = (overrides: Partial<Parameters<typeof pollNotifications>[0]> = {}) => {
    const events: ReceivedEvent[] = [];
    const options = {
        signal: controller.signal,
        onEvent: (event: ReceivedEvent) => events.push(event),
        onNetworkChange: vi.fn(),
        onFatal: vi.fn(),
        onProblem: vi.fn(),
        ...overrides,
    };
    return { events, options, done: pollNotifications(options) };
};

describe('pollNotifications', () => {
    beforeEach(() => {
        setCredentials(DEMO_CREDENTIALS);
        controller = new AbortController();
    });
    afterEach(() => controller.abort());

    it('удаляет каждое уведомление, даже неизвестное, и показывает только текст', async () => {
        mockInstance.push(
            incomingMessage({ idMessage: 'in-1', chatId: '10000000', text: 'Привет', senderName: 'Иван' }),
        );
        mockInstance.push({ typeWebhook: 'somethingNew' });
        mockInstance.push(outgoingStatus('10000000', 'out-1', 'delivered'));

        const { events } = startPolling();

        await vi.waitFor(() => expect(mockInstance.queue).toHaveLength(0));
        expect(events.map((event) => event.kind)).toEqual(['incoming', 'ignored', 'status']);
    });

    it('держит в полёте не больше одного receive', async () => {
        let inFlight = 0;
        let maxInFlight = 0;
        let requests = 0;
        server.use(
            http.get(receiveUrl, async () => {
                requests++;
                maxInFlight = Math.max(maxInFlight, ++inFlight);
                await new Promise((resolve) => setTimeout(resolve, 2));
                inFlight--;
                return HttpResponse.json(null);
            }),
        );

        startPolling();

        await vi.waitFor(() => expect(requests).toBeGreaterThan(30));
        expect(maxInFlight).toBe(1);
    });

    it('при ошибках сервера ждёт 1, 2, 4… 30 секунд и один раз сообщает о потере связи', async () => {
        server.use(http.get(receiveUrl, () => new HttpResponse(null, { status: 502 })));
        const delays: number[] = [];
        const sleep = vi.fn(async (ms: number) => {
            delays.push(ms);
            if (delays.length === 7) controller.abort();
        });

        const { options, done } = startPolling({ sleep });
        await done;

        expect(delays).toEqual([1_000, 2_000, 4_000, 8_000, 16_000, 30_000, 30_000]);
        expect(options.onNetworkChange).toHaveBeenCalledTimes(1);
        expect(options.onNetworkChange).toHaveBeenCalledWith(false);
    });

    it('после восстановления связи сбрасывает паузу и снимает баннер', async () => {
        let failures = 2;
        server.use(
            http.get(receiveUrl, async () => {
                if (failures-- > 0) return HttpResponse.error();
                await delay(5);
                return HttpResponse.json(null);
            }),
        );
        const delays: number[] = [];

        const { options } = startPolling({ sleep: async (ms) => void delays.push(ms) });

        await vi.waitFor(() => expect(options.onNetworkChange).toHaveBeenLastCalledWith(true));
        expect(delays).toEqual([1_000, 2_000]);
    });

    it('401 останавливает приём и отдаёт текст ошибки', async () => {
        server.use(http.get(receiveUrl, () => new HttpResponse(null, { status: 401 })));

        const { options, done } = startPolling();
        await done;

        expect(options.onFatal).toHaveBeenCalledWith(ERROR_TEXTS.unauthorized);
    });

    it('постоянная ошибка приёма видна баннером и уходит, когда инстанс ожил', async () => {
        let failures = 2;
        server.use(
            http.get(receiveUrl, async () => {
                if (failures-- > 0)
                    return HttpResponse.json({ message: 'Instance not authorized' }, { status: 400 });
                await delay(5);
                return HttpResponse.json(null);
            }),
        );

        const { options } = startPolling({ sleep: async () => {} });

        await vi.waitFor(() => expect(options.onProblem).toHaveBeenLastCalledWith(null));
        expect(options.onProblem).toHaveBeenCalledWith(ERROR_TEXTS.notAuthorized('notAuthorized'));
        expect(options.onNetworkChange).not.toHaveBeenCalled();
    });

    it('на лимит частоты сразу ждёт 30 секунд', async () => {
        server.use(http.get(receiveUrl, () => new HttpResponse(null, { status: 429 })));
        const sleep = vi.fn(async () => controller.abort());

        const { done } = startPolling({ sleep });
        await done;

        expect(sleep).toHaveBeenCalledWith(30_000, controller.signal);
    });

    it('если delete отвечает 4xx, не зацикливается на нём и возвращается к приёму', async () => {
        let receives = 0;
        mockInstance.push(incomingMessage({ idMessage: 'in-1', chatId: '10000000', text: 'Привет' }));
        server.use(
            http.get(receiveUrl, async () => {
                receives++;
                await delay(5);
                return HttpResponse.json(mockInstance.queue[0]);
            }),
            http.delete(
                `${DEMO_CREDENTIALS.apiUrl}/:instance/deleteNotification/:token/:receiptId`,
                async () => {
                    await delay(5);
                    return HttpResponse.json({ message: 'Validation failed' }, { status: 400 });
                },
            ),
        );

        const { options } = startPolling({ sleep: async () => {} });

        await vi.waitFor(() => expect(receives).toBeGreaterThan(2));
        expect(options.onProblem).toHaveBeenCalledWith(expect.stringContaining(ERROR_TEXTS.rejected('')));
    });
});

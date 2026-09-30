import { delay, http, HttpResponse } from 'msw';
import type { HttpResponseResolver } from 'msw';
import { DEMO_CREDENTIALS } from '@/app/config';
import { quotaExceededBody, settingsOk, settingsWithWebhook } from './fixtures';
import { mockInstance } from './mockInstance';

const base = `${DEMO_CREDENTIALS.apiUrl}/waInstance:idInstance`;

// В сценарии offline через 5 с после входа все запросы на 20 с «теряют сеть».
const online =
    (resolver: HttpResponseResolver): HttpResponseResolver =>
    async (info) => {
        if (mockInstance.isOffline()) return HttpResponse.error();
        return resolver(info);
    };

const answer = async () => delay(mockInstance.timings.latencyMs);

export const handlers = [
    http.get(
        `${base}/getStateInstance/:token`,
        online(async () => {
            await answer();
            return HttpResponse.json({ stateInstance: 'authorized' });
        }),
    ),

    http.get(
        `${base}/getSettings/:token`,
        online(async () => {
            await answer();
            if (mockInstance.scenario === 'newChat') mockInstance.scheduleStranger();
            return HttpResponse.json(mockInstance.scenario === 'settings' ? settingsWithWebhook : settingsOk);
        }),
    ),

    // Номера на …0000 «не находятся», на …0466 упираются в лимит тарифа — удобно показать ошибки.
    http.post(
        `${base}/checkAccount/:token`,
        online(async ({ request }) => {
            await answer();
            const { phoneNumber } = (await request.json()) as { phoneNumber: number };
            const phone = String(phoneNumber);
            if (phone.endsWith('0466')) return HttpResponse.json(quotaExceededBody, { status: 466 });
            if (phone.endsWith('0000')) return HttpResponse.json({ exist: false, chatId: '' });
            return HttpResponse.json({ exist: true, chatId: phone.slice(-9) });
        }),
    ),

    http.post(
        `${base}/sendMessage/:token`,
        online(async ({ request }) => {
            await answer();
            const { chatId, message } = (await request.json()) as { chatId: string; message: string };
            if (mockInstance.failsThisSend()) return new HttpResponse(null, { status: 500 });
            return HttpResponse.json({ idMessage: mockInstance.send(chatId, message) });
        }),
    ),

    http.get(
        `${base}/receiveNotification/:token`,
        online(async ({ request }) => HttpResponse.json(await mockInstance.receive(request.signal))),
    ),

    http.delete(
        `${base}/deleteNotification/:token/:receiptId`,
        online(({ params }) => HttpResponse.json({ result: mockInstance.remove(Number(params.receiptId)) })),
    ),
];

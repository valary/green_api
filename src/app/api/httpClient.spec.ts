import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/mocks/node';
import {
    deleteNotificationApi,
    getSettingsApi,
    getStateInstanceApi,
    receiveNotificationApi,
    sendMessageApi,
} from './requests';
import { setCredentials } from './httpClient';

const apiUrl = 'https://1101.api.green-api.com';
const token = 'test-token-0123456789';

beforeEach(() => setCredentials({ apiUrl, idInstance: '1101000001', apiTokenInstance: token }));

describe('httpClient', () => {
    it('кладёт idInstance и токен в путь, как требует GREEN-API', async () => {
        const urls: string[] = [];
        server.use(
            http.all(`${apiUrl}/*`, ({ request }) => {
                urls.push(request.url);
                return HttpResponse.json({ result: true, stateInstance: 'authorized' });
            }),
        );

        await getStateInstanceApi();
        await deleteNotificationApi(42);

        expect(urls).toEqual([
            `${apiUrl}/waInstance1101000001/getStateInstance/${token}`,
            `${apiUrl}/waInstance1101000001/deleteNotification/${token}/42`,
        ]);
    });

    it.each([
        [401, '', 'unauthorized', 'Неверный apiTokenInstance. Проверьте токен в личном кабинете GREEN-API'],
        [403, '', 'forbidden', 'Неверный idInstance или apiUrl'],
        [
            466,
            '',
            'quota',
            'Исчерпан лимит чатов тарифа (Developer — 3 чата в месяц). Лимит обновится 1-го числа',
        ],
        [469, '', 'rateLimit', 'Слишком много запросов. Подождите минуту и повторите'],
        [400, 'Instance not authorized', 'notAuthorized', expect.stringContaining('статус: notAuthorized')],
        [400, 'custom webhook url is set', 'webhookSet', expect.stringContaining('очистите webhookUrl')],
        [502, '', 'server', expect.any(String)],
    ])('HTTP %i → %s', async (status, body, kind, message) => {
        server.use(http.get(`${apiUrl}/*`, () => new HttpResponse(body, { status })));

        await expect(getStateInstanceApi()).rejects.toEqual({ kind, message, status });
    });

    it('обрыв сети превращает в понятную ошибку', async () => {
        server.use(http.get(`${apiUrl}/*`, () => HttpResponse.error()));

        await expect(getSettingsApi()).rejects.toMatchObject({ kind: 'network' });
    });

    it('вычищает токен из текста ошибки', async () => {
        server.use(
            http.post(`${apiUrl}/*`, () =>
                HttpResponse.json({ message: `bad path .../${token}` }, { status: 400 }),
            ),
        );

        const error = await sendMessageApi('10000000', 'hi').catch((e: unknown) => e);
        expect(JSON.stringify(error)).not.toContain(token);
    });

    it('пустая очередь — null', async () => {
        server.use(http.get(`${apiUrl}/*`, () => new HttpResponse('null')));

        const { data } = await receiveNotificationApi();
        expect(data).toBeNull();
    });
});

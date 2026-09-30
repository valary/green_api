import axios from 'axios';

export type ApiErrorKind =
    | 'unauthorized'
    | 'forbidden'
    | 'quota'
    | 'rateLimit'
    | 'notAuthorized'
    | 'webhookSet'
    | 'validation'
    | 'server'
    | 'network'
    | 'aborted';

export interface ApiError {
    kind: ApiErrorKind;
    message: string;
    status?: number;
}

export const ERROR_TEXT = {
    unauthorized: 'Неверный apiTokenInstance. Проверьте токен в личном кабинете GREEN-API',
    forbidden: 'Неверный idInstance или apiUrl',
    quota: 'Исчерпан лимит чатов тарифа (Developer — 3 чата в месяц). Лимит обновится 1-го числа',
    rateLimit: 'Слишком много запросов. Подождите минуту и повторите',
    webhookSet:
        'Входящие сообщения не будут приходить: в настройках инстанса очистите webhookUrl. Изменения применяются до 5 минут.',
    server: 'Сервер GREEN-API временно недоступен. Повторяем…',
    network: 'Нет связи с GREEN-API. Переподключаемся…',
};

export const notAuthorizedText = (state: string) =>
    `Инстанс не авторизован в Telegram (статус: ${state}). Откройте личный кабинет GREEN-API и подключите аккаунт по QR-коду`;

export const isApiError = (e: unknown): e is ApiError =>
    typeof e === 'object' && e !== null && 'kind' in e && 'message' in e;

export const isFatal = (e: ApiError) => e.kind === 'unauthorized' || e.kind === 'forbidden';
export const isTransient = (e: ApiError) => e.kind === 'network' || e.kind === 'server';

const apiError = (
    kind: ApiErrorKind,
    status?: number,
    message: string = ERROR_TEXT[kind as keyof typeof ERROR_TEXT],
) => ({
    kind,
    message,
    status,
});

function fromResponse(status: number, data: unknown): ApiError {
    const body = typeof data === 'string' ? data : JSON.stringify(data ?? '');
    const lower = body.toLowerCase();

    if (status === 401) return apiError('unauthorized', status);
    if (status === 403) return apiError('forbidden', status);
    if (status === 466) return apiError('quota', status);
    if (status === 429 || status === 469 || lower.includes('rate_limit_exceeded'))
        return apiError('rateLimit', status);
    if (status === 499 || status >= 500) return apiError('server', status);

    // Проблемы с инстансом GREEN-API отдаёт как 400 с текстом в теле.
    if (lower.includes('custom webhook url is set')) return apiError('webhookSet', status);
    if (lower.includes('not authorized') || lower.includes('starting')) {
        return apiError(
            'notAuthorized',
            status,
            notAuthorizedText(lower.includes('starting') ? 'starting' : 'notAuthorized'),
        );
    }
    const details = typeof data === 'object' && data && 'message' in data ? String(data.message) : '';
    return apiError(
        'validation',
        status,
        `Запрос отклонён GREEN-API${details ? `: ${details.slice(0, 200)}` : ` (код ${status})`}`,
    );
}

export function toApiError(error: unknown): ApiError {
    if (isApiError(error)) return error;
    if (axios.isCancel(error)) return apiError('aborted', undefined, '');
    if (axios.isAxiosError(error) && error.response)
        return fromResponse(error.response.status, error.response.data);
    return apiError('network');
}

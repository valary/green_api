import type { ApiError } from '@/types/greenApi';
import type { ReceivedEvent } from '@/types/chat';
import { greenApi } from './requests';
import { isFatal, isTransient, toApiError } from './apiError';
import { wait } from '@/shared/utils/wait';
import { parseNotification } from '@/shared/utils/parseNotification';

export const BACKOFF_MS = [1_000, 2_000, 4_000, 8_000, 16_000, 30_000];

interface PollOptions {
    signal: AbortSignal;
    onEvent: (event: ReceivedEvent) => void;
    onNetworkChange: (online: boolean) => void;
    onFatal: (message: string) => void;
    onProblem: (message: string | null) => void;
    sleep?: typeof wait;
}

// Строго последовательно: receive → обработка → delete → следующий receive. Никаких setInterval —
// иначе запросы наслаиваются, а без delete очередь GREEN-API встаёт на одном уведомлении навсегда.
export async function pollNotifications({
    signal,
    onEvent,
    onNetworkChange,
    onFatal,
    onProblem,
    sleep = wait,
}: PollOptions) {
    let failures = 0;
    let offline = false;
    let problem = false;

    const succeeded = () => {
        failures = 0;
        if (offline) {
            offline = false;
            onNetworkChange(true);
        }
        if (problem) {
            problem = false;
            onProblem(null);
        }
    };

    const backOff = async (error: ApiError) => {
        if (signal.aborted || error.kind === 'aborted') return false;
        if (isFatal(error)) {
            onFatal(error.message);
            return false;
        }
        if (!isTransient(error)) {
            // Инстанс разлогинен, стоит вебхук, кончилась квота — само не пройдёт, говорим пользователю.
            problem = true;
            onProblem(error.message);
        } else if (!offline) {
            offline = true;
            onNetworkChange(false);
        }
        if (error.kind === 'rateLimit') failures = BACKOFF_MS.length - 1;
        await sleep(BACKOFF_MS[Math.min(failures++, BACKOFF_MS.length - 1)], signal);
        return !signal.aborted;
    };

    const remove = async (receiptId: number) => {
        while (!signal.aborted) {
            try {
                await greenApi.deleteNotification(receiptId);
                succeeded();
                return;
            } catch (e) {
                const error = toApiError(e);
                if (!(await backOff(error))) return;
                // 4xx на delete повторять бесполезно: уведомление вернётся следующим receive, дубль отсечёт дедуп.
                if (!isTransient(error)) return;
            }
        }
    };

    while (!signal.aborted) {
        let notification;
        try {
            notification = await greenApi.receiveNotification(signal);
            succeeded();
        } catch (e) {
            if (await backOff(toApiError(e))) continue;
            return;
        }
        if (!notification) continue;

        try {
            onEvent(parseNotification(notification.body));
        } catch {
            // сломанное уведомление всё равно удаляем, иначе оно будет приходить вечно
        }
        await remove(notification.receiptId);
    }
}

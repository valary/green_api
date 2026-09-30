import type { DemoScenario } from '../types/session';
import type { QueuedNotification } from '../types/greenApi';
import {
    demoReplies,
    incomingMessage,
    outgoingApiMessage,
    outgoingStatus,
    stateInstanceChanged,
} from './fixtures';

const defaultTimings = {
    latencyMs: 250,
    holdMs: 1_000,
    replyDelayMs: [1_000, 3_000] as [number, number],
    statusStepMs: 400,
};

const OFFLINE_AFTER_MS = 5_000;
const OFFLINE_FOR_MS = 20_000;

// Инстанс в памяти вкладки. Очередь ведёт себя как настоящая: receive отдаёт голову
// и не двигается дальше, пока её не удалят через deleteNotification.
const createMockInstance = () => {
    let scenario: DemoScenario = 'default';
    let timings = { ...defaultTimings };
    let queue: QueuedNotification[] = [];
    let nextReceiptId = 1;
    let nextMessageId = 1;
    let sentCount = 0;
    let sendErrorShown = false;
    let startedAt: number | null = null;
    let waiters: Array<() => void> = [];
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const later = (ms: number, run: () => void) => {
        const timer = setTimeout(() => {
            timers.delete(timer);
            run();
        }, ms);
        timers.add(timer);
    };

    const push = (body: unknown) => {
        queue.push({ receiptId: nextReceiptId++, body });
        waiters.forEach((wake) => wake());
        waiters = [];
    };

    const messageId = () => `${Date.now()}${String(nextMessageId++).padStart(3, '0')}`;

    const scheduleReply = (chatId: string) => {
        const [from, to] = timings.replyDelayMs;
        const text = demoReplies[(sentCount - 1) % demoReplies.length];
        later(from + Math.random() * (to - from), () =>
            push(incomingMessage({ idMessage: messageId(), chatId, text, senderName: 'Собеседник' })),
        );
    };

    return {
        get scenario() {
            return scenario;
        },
        get timings() {
            return timings;
        },
        get queue(): readonly QueuedNotification[] {
            return queue;
        },

        start(next: DemoScenario) {
            scenario = next;
            startedAt = Date.now();
        },

        setTimings(next: Partial<typeof defaultTimings>) {
            timings = { ...timings, ...next };
        },

        reset() {
            timers.forEach(clearTimeout);
            timers.clear();
            queue = [];
            waiters = [];
            sentCount = 0;
            sendErrorShown = false;
            startedAt = null;
            scenario = 'default';
            timings = { ...defaultTimings };
        },

        push,

        isOffline() {
            if (scenario !== 'offline' || startedAt === null) return false;
            const since = Date.now() - startedAt;
            return since >= OFFLINE_AFTER_MS && since < OFFLINE_AFTER_MS + OFFLINE_FOR_MS;
        },

        receive(signal: AbortSignal) {
            return new Promise<QueuedNotification | null>((resolve) => {
                if (queue.length > 0) return resolve(queue[0]);
                const wake = () => {
                    clearTimeout(timer);
                    resolve(queue[0] ?? null);
                };
                const timer = setTimeout(wake, timings.holdMs);
                waiters.push(wake);
                signal.addEventListener('abort', () => resolve(null), { once: true });
            });
        },

        remove(receiptId: number) {
            const before = queue.length;
            queue = queue.filter((item) => item.receiptId !== receiptId);
            return queue.length < before;
        },

        scheduleStranger() {
            later(3_000, () =>
                push(
                    incomingMessage({
                        idMessage: messageId(),
                        chatId: '2000000001',
                        text: 'Здравствуйте! Мне дали этот контакт — это демо GREEN-API?',
                        senderName: 'Мария Соколова',
                    }),
                ),
            );
        },

        // Возвращает idMessage, как sendMessage, и раскладывает в очередь то, что прислал бы Telegram.
        send(chatId: string, text: string) {
            sentCount++;
            const idMessage = messageId();
            const { statusStepMs: step } = timings;

            // Эхо иногда приходит раньше ответа на sendMessage — так бывает и у живого API.
            const echo = outgoingApiMessage({ idMessage, chatId, text });
            if (Math.random() < 0.3) push(echo);
            else later(step / 4, () => push(echo));

            later(step, () => push(outgoingStatus(chatId, idMessage, 'sent')));
            later(step * 2, () => push(outgoingStatus(chatId, idMessage, 'delivered')));
            later(step * 3, () => push(outgoingStatus(chatId, idMessage, 'read')));
            if (sentCount % 3 === 0) later(step, () => push(stateInstanceChanged()));

            scheduleReply(chatId);
            return idMessage;
        },

        // Сценарий sendError роняет только первую отправку, чтобы «Повторить» прошла.
        failsThisSend() {
            if (scenario !== 'sendError' || sendErrorShown) return false;
            sendErrorShown = true;
            return true;
        },
    };
};

export const mockInstance = createMockInstance();

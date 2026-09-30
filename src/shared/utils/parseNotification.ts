import type { ReceivedEvent } from '../../types/chat';
import type { MessageWebhook, StatusWebhook } from '../../types/greenApi';

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const isMessageWebhook = (body: Record<string, unknown>): body is MessageWebhook & Record<string, unknown> =>
    (body.typeWebhook === 'incomingMessageReceived' || body.typeWebhook === 'outgoingAPIMessageReceived') &&
    typeof body.idMessage === 'string' &&
    isObject(body.senderData) &&
    isObject(body.messageData);

const isStatusWebhook = (body: Record<string, unknown>): body is StatusWebhook & Record<string, unknown> =>
    body.typeWebhook === 'outgoingMessageStatus' &&
    typeof body.idMessage === 'string' &&
    typeof body.chatId === 'string';

// Медиа и прочие типы не показываем: в чате только текст.
const textOf = ({ typeMessage, textMessageData, extendedTextMessageData }: MessageWebhook['messageData']) => {
    if (typeMessage === 'textMessage') return textMessageData?.textMessage;
    if (typeMessage === 'extendedTextMessage') return extendedTextMessageData?.text;
};

export const parseNotification = (body: unknown): ReceivedEvent => {
    if (!isObject(body)) return { kind: 'ignored' };

    if (isStatusWebhook(body)) {
        const { chatId, idMessage, status, description } = body;
        return { kind: 'status', update: { chatId, idMessage, status, description } };
    }
    if (!isMessageWebhook(body)) return { kind: 'ignored' };

    const text = textOf(body.messageData);
    const { chatId, senderContactName, senderName, chatName } = body.senderData;
    // Отрицательный chatId — группа, а группы мы не поддерживаем.
    if (typeof text !== 'string' || !chatId || chatId.startsWith('-')) return { kind: 'ignored' };

    const message = { chatId, idMessage: body.idMessage, text, timestamp: body.timestamp * 1000 };
    if (body.typeWebhook === 'outgoingAPIMessageReceived') return { kind: 'echo', message };
    return {
        kind: 'incoming',
        message: { ...message, senderName: senderContactName || senderName || chatName || chatId },
    };
};

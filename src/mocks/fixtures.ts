// Тела уведомлений в том виде, в каком их присылает GREEN-API для Telegram.
const instanceData = { idInstance: 1100000000, wid: '', typeInstance: 'telegram' };

interface MessageArgs {
    idMessage: string;
    chatId: string;
    text: string;
    senderName?: string;
}

const now = () => Math.floor(Date.now() / 1000);

function messageData(text: string) {
    if (!text.includes('https://')) {
        return { typeMessage: 'textMessage', textMessageData: { textMessage: text, isForwarded: false } };
    }
    return {
        typeMessage: 'extendedTextMessage',
        extendedTextMessageData: {
            text,
            description: '',
            title: '',
            previewType: 'None',
            isForwarded: false,
        },
    };
}

export function incomingMessage({ idMessage, chatId, text, senderName = '' }: MessageArgs) {
    return {
        typeWebhook: 'incomingMessageReceived',
        instanceData,
        timestamp: now(),
        idMessage,
        senderData: {
            chatId,
            chatType: 'user',
            sender: chatId,
            chatName: senderName,
            senderName,
            senderContactName: '',
        },
        messageData: messageData(text),
    };
}

export function outgoingApiMessage(args: MessageArgs) {
    return { ...incomingMessage(args), typeWebhook: 'outgoingAPIMessageReceived' };
}

export function outgoingStatus(chatId: string, idMessage: string, status: string, description?: string) {
    return {
        typeWebhook: 'outgoingMessageStatus',
        instanceData,
        timestamp: now(),
        chatId,
        idMessage,
        status,
        sendByApi: true,
        ...(description && { description }),
    };
}

export const stateInstanceChanged = () => ({
    typeWebhook: 'stateInstanceChanged',
    instanceData,
    timestamp: now(),
    stateInstance: 'authorized',
});

export const settingsOk = {
    webhookUrl: '',
    incomingWebhook: 'yes',
    outgoingWebhook: 'yes',
    outgoingAPIMessageWebhook: 'yes',
    stateWebhook: 'no',
};

export const settingsWithWebhook = {
    ...settingsOk,
    webhookUrl: 'https://example.com/green-api-hook',
    outgoingWebhook: 'no',
};

export const quotaExceededBody = {
    invokeStatus: { status: 'QUOTE_EXCEEDED', description: 'Monthly quota has been exceeded' },
    correspondentsStatus: { status: 'QUOTE_EXCEEDED', used: 3, total: 3 },
};

export const demoReplies = [
    'Привет! Сообщение пришло, отвечаю из Telegram',
    'Про приём уведомлений: https://green-api.com/telegram/docs/api/receiving/technology-http-api/',
    'Вижу, всё работает. Что ещё проверим?',
];

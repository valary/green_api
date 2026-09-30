import type { DeliveryStatus } from './chat';

export interface Credentials {
    apiUrl: string;
    idInstance: string;
    apiTokenInstance: string;
}

export type StateInstance =
    'authorized' | 'notAuthorized' | 'blocked' | 'suspended' | 'starting' | 'pendingPassword';

export interface InstanceSettings {
    webhookUrl: string;
    incomingWebhook: string;
    outgoingWebhook: string;
}

export interface CheckAccountResponse {
    exist: boolean;
    chatId: string;
}

export interface QueuedNotification {
    receiptId: number;
    body: unknown;
}

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

export interface MessageWebhook {
    typeWebhook: 'incomingMessageReceived' | 'outgoingAPIMessageReceived';
    idMessage: string;
    timestamp: number;
    senderData: { chatId: string; chatName?: string; senderName?: string; senderContactName?: string };
    messageData: {
        typeMessage: string;
        textMessageData?: { textMessage: string };
        extendedTextMessageData?: { text: string };
    };
}

export interface StatusWebhook {
    typeWebhook: 'outgoingMessageStatus';
    chatId: string;
    idMessage: string;
    status: DeliveryStatus;
    description?: string;
}

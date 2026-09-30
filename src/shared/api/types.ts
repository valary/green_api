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

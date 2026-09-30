export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error';

export interface Message {
    // До ответа sendMessage у исходящего нет idMessage, поэтому ключ свой.
    localId: string;
    idMessage?: string;
    chatId: string;
    direction: 'in' | 'out';
    text: string;
    timestamp: number;
    status?: MessageStatus;
    error?: string;
}

export type TextPart = { text: string; href?: string };

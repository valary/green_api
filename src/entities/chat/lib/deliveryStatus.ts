import type { Message, MessageStatus } from '@/entities/message';
import type { DeliveryUpdate } from '../model/types';

const rank: Record<MessageStatus, number> = { error: -1, sending: 0, sent: 1, delivered: 2, read: 3 };

// Статусы приходят вразнобой, поэтому только повышаем: read не откатится в delivered.
export function raiseStatus(message: Message, status: Exclude<MessageStatus, 'error'>) {
    if (rank[status] > rank[message.status ?? 'sending'] || message.status === 'error')
        message.status = status;
}

export function applyDelivery(message: Message, update: DeliveryUpdate) {
    if (update.status === 'failed' || update.status === 'noAccount') {
        message.status = 'error';
        message.error =
            update.status === 'noAccount' ? 'получатель не найден' : update.description || 'ошибка доставки';
        return;
    }
    raiseStatus(message, update.status);
}

import type { Message, MessageStatus } from '../../../../types/message';
import type { DeliveryUpdate } from '../../../../types/chat';
import { ERROR_TEXTS } from '../../../../shared/constants/texts';

const rank: Record<MessageStatus, number> = { error: -1, sending: 0, sent: 1, delivered: 2, read: 3 };

// Статусы приходят вразнобой, поэтому только повышаем: read не откатится в delivered.
export const raiseStatus = (message: Message, status: Exclude<MessageStatus, 'error'>) => {
    if (rank[status] > rank[message.status ?? 'sending'] || message.status === 'error')
        message.status = status;
};

export const applyDelivery = (message: Message, update: DeliveryUpdate) => {
    if (update.status === 'failed' || update.status === 'noAccount') {
        message.status = 'error';
        message.error =
            update.status === 'noAccount'
                ? ERROR_TEXTS.noAccount
                : update.description || ERROR_TEXTS.deliveryFailed;
        return;
    }
    raiseStatus(message, update.status);
};

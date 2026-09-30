import type { InstanceSettings } from '@/types/greenApi';

export const settingsWarning = ({ webhookUrl, incomingWebhook, outgoingWebhook }: InstanceSettings) => {
    const fixes = [
        webhookUrl?.trim() && 'очистите webhookUrl',
        incomingWebhook !== 'yes' && 'включите incomingWebhook',
    ].filter(Boolean);
    const noStatuses = outgoingWebhook !== 'yes';

    if (fixes.length === 0) {
        return noStatuses
            ? 'Статусы ✓✓ показываться не будут: в настройках инстанса включите outgoingWebhook. Изменения применяются до 5 минут.'
            : null;
    }
    const text = `Входящие сообщения не будут приходить: в настройках инстанса ${fixes.join(' и ')}. Изменения применяются до 5 минут.`;
    return noStatuses ? `${text} Статусы ✓✓ тоже не появятся: включите outgoingWebhook` : text;
};

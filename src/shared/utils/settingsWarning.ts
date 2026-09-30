import type { InstanceSettings } from '../../types/greenApi';
import { SETTINGS_TEXTS } from '../constants/texts';

export const settingsWarning = ({ webhookUrl, incomingWebhook, outgoingWebhook }: InstanceSettings) => {
    const fixes = [
        webhookUrl?.trim() && SETTINGS_TEXTS.clearWebhook,
        incomingWebhook !== 'yes' && SETTINGS_TEXTS.enableIncoming,
    ].filter(Boolean);
    const noStatuses = outgoingWebhook !== 'yes';

    if (fixes.length === 0) return noStatuses ? SETTINGS_TEXTS.onlyStatuses : null;

    const text = SETTINGS_TEXTS.incomingBroken(fixes.join(' и '));
    return noStatuses ? `${text} ${SETTINGS_TEXTS.noStatuses}` : text;
};

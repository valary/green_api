import { expect, it } from 'vitest';
import { settingsWarning } from './settingsWarning';
import { SETTINGS_TEXTS } from '../constants/texts';

const good = { webhookUrl: '', incomingWebhook: 'yes', outgoingWebhook: 'yes' };

it('при правильных настройках молчит', () => {
    expect(settingsWarning(good)).toBeNull();
});

it('подсказывает, что поменять, если входящие не придут', () => {
    expect(settingsWarning({ ...good, webhookUrl: 'https://example.com/hook', incomingWebhook: 'no' })).toBe(
        SETTINGS_TEXTS.incomingBroken(`${SETTINGS_TEXTS.clearWebhook} и ${SETTINGS_TEXTS.enableIncoming}`),
    );
});

it('отдельно предупреждает про статусы ✓✓', () => {
    expect(settingsWarning({ ...good, outgoingWebhook: 'no' })).toBe(SETTINGS_TEXTS.onlyStatuses);
});

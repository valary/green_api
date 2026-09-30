import { DEMO_SCENARIOS, type DemoScenario } from '@/shared/config';

export const demoScenarioHints: Record<DemoScenario, string> = {
    default: 'Всё работает на имитации: сообщения никуда не уходят',
    settings: 'Сценарий: у инстанса задан webhookUrl — появится предупреждение',
    offline: 'Сценарий: через 5 секунд пропадёт связь на 20 секунд',
    sendError: 'Сценарий: первая отправка упадёт, «Повторить» пройдёт',
    newChat: 'Сценарий: через 3 секунды напишет незнакомый человек',
};

export function parseDemoScenario(value: string | null): DemoScenario {
    return DEMO_SCENARIOS.find((scenario) => scenario === value) ?? 'default';
}

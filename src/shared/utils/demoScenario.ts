import type { DemoScenario } from '../../types/session';
import { DEMO_SCENARIOS } from '../../app/config';
import { DEMO_TEXTS } from '../constants/texts';

export const demoScenarioHints: Record<DemoScenario, string> = {
    default: DEMO_TEXTS.hints.default,
    settings: DEMO_TEXTS.hints.settings,
    offline: DEMO_TEXTS.hints.offline,
    sendError: DEMO_TEXTS.hints.sendError,
    newChat: DEMO_TEXTS.hints.newChat,
};

export const parseDemoScenario = (value: string | null): DemoScenario => {
    return DEMO_SCENARIOS.find((scenario) => scenario === value) ?? 'default';
};

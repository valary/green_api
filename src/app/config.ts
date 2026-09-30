import type { DemoScenario } from '@/types/session';

// Сервер держит long polling до N секунд и отвечает сразу, как только есть уведомление.
export const RECEIVE_TIMEOUT_SEC = 20;
export const MAX_MESSAGE_LENGTH = 4096;

// .invalid не резолвится никогда: в демо запросы перехватывает MSW, в сеть ничего не уходит.
export const DEMO_CREDENTIALS = {
    apiUrl: 'https://demo.invalid',
    idInstance: '1100000000',
    apiTokenInstance: 'demo',
};

export const DEMO_SCENARIOS: DemoScenario[] = ['default', 'settings', 'offline', 'sendError', 'newChat'];

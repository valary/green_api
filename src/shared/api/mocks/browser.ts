import { setupWorker } from 'msw/browser';
import type { DemoScenario } from '@/shared/config';
import { handlers } from './handlers';
import { mockInstance } from './mockInstance';

const worker = setupWorker(...handlers);
let started: Promise<unknown> | undefined;

export async function startDemo(scenario: DemoScenario) {
    started ??= worker.start({
        serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
        onUnhandledRequest: 'bypass',
        quiet: true,
    });
    await started;
    mockInstance.start(scenario);
}

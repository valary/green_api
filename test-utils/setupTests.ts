import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { mockInstance } from '@/mocks/mockInstance';
import { server } from '@/mocks/node';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => {
    mockInstance.setTimings({ latencyMs: 0, holdMs: 20, replyDelayMs: [30, 30], statusStepMs: 5 });
});
afterEach(() => {
    cleanup();
    server.resetHandlers();
    mockInstance.reset();
    sessionStorage.clear();
    localStorage.clear();
});
afterAll(() => server.close());

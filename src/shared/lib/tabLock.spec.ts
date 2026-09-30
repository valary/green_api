import { afterEach, describe, expect, it, vi } from 'vitest';
import { runInSingleTab } from './tabLock';

// Минимальный LockManager: один держатель, остальные в очереди.
function stubLocks() {
    let held = false;
    const queue: Array<() => void> = [];
    const request = async (
        _name: string,
        options: LockOptions,
        callback: (lock: Lock | null) => Promise<unknown>,
    ) => {
        if (held && options.ifAvailable) return callback(null);
        if (held) await new Promise<void>((resolve) => queue.push(resolve));
        held = true;
        try {
            return await callback({ name: 'lock', mode: 'exclusive' });
        } finally {
            held = false;
            queue.shift()?.();
        }
    };
    vi.stubGlobal('navigator', { ...navigator, locks: { request } });
}

describe('runInSingleTab', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('вторая вкладка ждёт и подхватывает приём, когда первая закрылась', async () => {
        stubLocks();
        let closeFirstTab = () => {};
        const first = new Promise<void>((resolve) => (closeFirstTab = resolve));
        const secondTask = vi.fn(async () => {});
        const onWaiting = vi.fn();

        void runInSingleTab('poller', new AbortController().signal, vi.fn(), () => first);
        const second = runInSingleTab('poller', new AbortController().signal, onWaiting, secondTask);

        await vi.waitFor(() => expect(onWaiting).toHaveBeenCalledWith(true));
        expect(secondTask).not.toHaveBeenCalled();

        closeFirstTab();
        await second;
        expect(onWaiting).toHaveBeenLastCalledWith(false);
        expect(secondTask).toHaveBeenCalledOnce();
    });
});

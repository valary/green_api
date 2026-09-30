// Пауза, которая заканчивается сразу, если цикл остановили.
export const wait = (ms: number, signal: AbortSignal) => {
    return new Promise<void>((resolve) => {
        if (signal.aborted) return resolve();
        const timer = setTimeout(resolve, ms);
        signal.addEventListener(
            'abort',
            () => {
                clearTimeout(timer);
                resolve();
            },
            { once: true },
        );
    });
};

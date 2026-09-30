// Без «Запомнить» всё живёт в sessionStorage и умирает вместе с вкладкой.
const PREFIX = 'green-api-chat:';

const area = (persistent: boolean): Storage | null => {
    try {
        return persistent ? window.localStorage : window.sessionStorage;
    } catch {
        return null;
    }
};

export const storageKey = (key: string) => PREFIX + key;

export const readJson = <T>(key: string, persistent: boolean): T | null => {
    try {
        const raw = area(persistent)?.getItem(storageKey(key));
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
};

export const writeJson = (key: string, value: unknown, persistent: boolean) => {
    try {
        area(persistent)?.setItem(storageKey(key), JSON.stringify(value));
    } catch {
        // переполнено или запрещено — работаем без сохранения
    }
};

export const removeItem = (key: string, persistent: boolean) => {
    area(persistent)?.removeItem(storageKey(key));
};

export const clearAppStorage = () => {
    for (const storage of [area(false), area(true)]) {
        if (!storage) continue;
        Object.keys(storage)
            .filter((key) => key.startsWith(PREFIX))
            .forEach((key) => storage.removeItem(key));
    }
};

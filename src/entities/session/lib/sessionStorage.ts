import type { Credentials } from '@/shared/api';
import type { DemoScenario } from '@/shared/config';
import { clearAppStorage, readJson, removeItem, storageKey, writeJson } from '@/shared/lib/storage';
import type { SessionMode } from '../model/types';

export interface StoredSession {
    credentials: Credentials;
    mode: SessionMode;
    remember: boolean;
    scenario: DemoScenario | null;
}

const KEY = 'session';
export const SESSION_STORAGE_KEY = storageKey(KEY);

const isStoredSession = (value: unknown): value is StoredSession =>
    typeof value === 'object' &&
    value !== null &&
    'credentials' in value &&
    typeof (value as StoredSession).credentials?.apiTokenInstance === 'string';

export function loadStoredSession(): StoredSession | null {
    const saved = readJson<unknown>(KEY, false) ?? readJson<unknown>(KEY, true);
    return isStoredSession(saved) ? saved : null;
}

export function storeSession(session: StoredSession) {
    removeItem(KEY, !session.remember);
    writeJson(KEY, session, session.remember);
}

export const forgetSession = clearAppStorage;

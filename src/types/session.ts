import type { Credentials } from './greenApi';

export type DemoScenario = 'default' | 'settings' | 'offline' | 'sendError' | 'newChat';

export type SessionMode = 'live' | 'demo';

export interface SessionInfo {
    idInstance: string;
    mode: SessionMode;
    remember: boolean;
    scenario: DemoScenario | null;
}

export type DemoStatus = 'idle' | 'loading' | 'failed';

export interface SessionState {
    current: SessionInfo | null;
    demoStatus: DemoStatus;
}

export interface ConnectionState {
    online: boolean;
    fatalError: string | null;
    problem: string | null;
    settingsWarning: string | null;
    receivingElsewhere: boolean;
}

export interface StoredSession {
    credentials: Credentials;
    mode: SessionMode;
    remember: boolean;
    scenario: DemoScenario | null;
}

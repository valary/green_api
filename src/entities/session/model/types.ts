import type { DemoScenario } from '@/shared/config';

export type SessionMode = 'live' | 'demo';

export interface SessionInfo {
    idInstance: string;
    mode: SessionMode;
    remember: boolean;
    scenario: DemoScenario | null;
}

export interface SessionState {
    current: SessionInfo | null;
}

export interface ConnectionState {
    online: boolean;
    fatalError: string | null;
    problem: string | null;
    settingsWarning: string | null;
    receivingElsewhere: boolean;
}

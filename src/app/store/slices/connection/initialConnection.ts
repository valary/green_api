import type { ConnectionState } from '../../../../types/session';

export const initialConnection: ConnectionState = {
    online: true,
    fatalError: null,
    problem: null,
    settingsWarning: null,
    receivingElsewhere: false,
};

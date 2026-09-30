import type { ConnectionState, SessionState } from './types';

type State = { session: SessionState; connection: ConnectionState };

export const selectSession = (state: State) => state.session.current;
export const selectIsDemo = (state: State) => state.session.current?.mode === 'demo';
export const selectConnection = (state: State) => state.connection;

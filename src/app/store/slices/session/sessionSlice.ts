import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { initialSession } from './initialSession';
import type { SessionInfo } from '../../../../types/session';

export const sessionSlice = createSlice({
    name: 'session',
    initialState: initialSession,
    reducers: {
        sessionStarted(state, { payload }: PayloadAction<SessionInfo>) {
            state.current = payload;
        },
        // Сбрасывает весь стор — см. rootReducer в app/store.
        loggedOut() {
            return initialSession;
        },
    },
});

export const sessionActions = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;

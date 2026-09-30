import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SessionInfo } from '../../../../types/session';
import { initialSession } from './initialSession';
import { openDemo } from './thunks';

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
    extraReducers: (builder) => {
        builder
            .addCase(openDemo.pending, (state) => {
                state.demoStatus = 'loading';
            })
            .addCase(openDemo.fulfilled, (state) => {
                state.demoStatus = 'idle';
            })
            .addCase(openDemo.rejected, (state) => {
                state.demoStatus = 'failed';
            });
    },
});

export const sessionActions = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;

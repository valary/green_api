import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { initialConnection } from './initialConnection';

export const connectionSlice = createSlice({
    name: 'connection',
    initialState: initialConnection,
    reducers: {
        networkChanged(state, { payload }: PayloadAction<boolean>) {
            state.online = payload;
        },
        problemChanged(state, { payload }: PayloadAction<string | null>) {
            state.problem = payload;
        },
        fatalErrorOccurred(state, { payload }: PayloadAction<string>) {
            state.fatalError = payload;
            state.online = true;
        },
        settingsChecked(state, { payload }: PayloadAction<string | null>) {
            state.settingsWarning = payload;
        },
        settingsWarningDismissed(state) {
            state.settingsWarning = null;
        },
        receivingElsewhereChanged(state, { payload }: PayloadAction<boolean>) {
            state.receivingElsewhere = payload;
        },
    },
});

export const {
    networkChanged,
    problemChanged,
    fatalErrorOccurred,
    settingsChecked,
    settingsWarningDismissed,
    receivingElsewhereChanged,
} = connectionSlice.actions;

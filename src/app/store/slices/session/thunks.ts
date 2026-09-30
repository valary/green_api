import type { DemoScenario, StoredSession } from '@/types/session';
import { connectionActions } from '@/app/store/slices/connection/connectionSlice';
import { getSettingsApi, getStateInstanceApi } from '@/app/api/requests';
import { isFatal, notAuthorizedText, toApiError } from '@/app/api/apiError';
import { createAppAsyncThunk } from '@/app/store/createAppAsyncThunk';
import { settingsWarning } from '@/shared/utils/settingsWarning';
import { chatActions } from '@/app/store/slices/chat/chatSlice';
import { loadChats } from '@/shared/utils/chatStorage';
import { sessionActions } from './sessionSlice';
import { forgetSession, storeSession } from '@/shared/utils/sessionStorage';
import { clearCredentials, setCredentials } from '@/app/api/httpClient';
import type { AppDispatch } from '@/app/store/store';
import { DEMO_CREDENTIALS } from '@/app/config';

// Только подсказываем: SetSettings перезапускает инстанс на несколько минут, трогать его сами не будем.
export const checkSettings = createAppAsyncThunk('auth/checkSettings', async (_, { dispatch }) => {
    try {
        const { data } = await getSettingsApi();
        dispatch(connectionActions.settingsChecked(settingsWarning(data)));
    } catch (e) {
        const error = toApiError(e);
        if (isFatal(error)) dispatch(connectionActions.fatalErrorOccurred(error.message));
    }
});

export function restoreSession(
    dispatch: AppDispatch,
    { credentials, mode, remember, scenario }: StoredSession,
) {
    setCredentials(credentials);
    dispatch(sessionActions.sessionStarted({ idInstance: credentials.idInstance, mode, remember, scenario }));
    const saved = loadChats(credentials.idInstance, remember);
    if (saved) dispatch(chatActions.chatsRestored(saved));
}

export const signIn = createAppAsyncThunk(
    'auth/signIn',
    async (session: StoredSession, { dispatch, rejectWithValue }) => {
        setCredentials(session.credentials);
        try {
            const { data } = await getStateInstanceApi();
            const state = data.stateInstance;
            if (state !== 'authorized') {
                clearCredentials();
                return rejectWithValue({ kind: 'notAuthorized', message: notAuthorizedText(state) });
            }
        } catch (e) {
            clearCredentials();
            return rejectWithValue(toApiError(e));
        }

        storeSession(session);
        restoreSession(dispatch, session);
        void dispatch(checkSettings());
    },
);

// MSW нужен только в демо, поэтому воркер и хендлеры приезжают отдельным чанком.
export async function startDemo(scenario: DemoScenario) {
    const mocks = await import('@/mocks/browser');
    await mocks.startDemo(scenario);
}

export const openDemo = createAppAsyncThunk('auth/openDemo', async (scenario: DemoScenario, { dispatch }) => {
    await startDemo(scenario);
    await dispatch(
        signIn({ credentials: DEMO_CREDENTIALS, remember: false, mode: 'demo', scenario }),
    ).unwrap();
});

export const logout = () => (dispatch: AppDispatch) => {
    clearCredentials();
    forgetSession();
    dispatch(sessionActions.loggedOut());
};

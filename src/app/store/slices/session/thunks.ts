import type { DemoScenario, StoredSession } from '../../../../types/session';
import { connectionActions } from '../connection/connectionSlice';
import { getSettingsApi, getStateInstanceApi } from '../../../api/requests';
import { isFatal, toApiError } from '../../../api/apiError';
import { DEMO_TEXTS, ERROR_TEXTS, LOGIN_TEXTS } from '../../../../shared/constants/texts';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { settingsWarning } from '../../../../shared/utils/settingsWarning';
import { chatActions } from '../chat/chatSlice';
import { loadChats } from '../../../../shared/utils/chatStorage';
import { sessionActions } from './sessionSlice';
import { forgetSession, storeSession } from '../../../../shared/utils/sessionStorage';
import { clearCredentials, setCredentials } from '../../../api/httpClient';
import type { AppDispatch } from '../../store';
import { DEMO_CREDENTIALS } from '../../../config';

// Только подсказываем: SetSettings перезапускает инстанс на несколько минут, трогать его сами не будем.
export const checkSettings = createAppAsyncThunk('session/checkSettings', async (_, { dispatch }) => {
    try {
        const { data } = await getSettingsApi();
        dispatch(connectionActions.settingsChecked(settingsWarning(data)));
    } catch (e) {
        const error = toApiError(e);
        if (isFatal(error)) dispatch(connectionActions.fatalErrorOccurred(error.message));
    }
});

export const restoreSession = (
    dispatch: AppDispatch,
    { credentials, mode, remember, scenario }: StoredSession,
) => {
    setCredentials(credentials);
    dispatch(sessionActions.sessionStarted({ idInstance: credentials.idInstance, mode, remember, scenario }));
    const saved = loadChats(credentials.idInstance, remember);
    if (saved) dispatch(chatActions.chatsRestored(saved));
};

export const signIn = createAppAsyncThunk(
    'session/signIn',
    async (session: StoredSession, { dispatch, rejectWithValue }) => {
        setCredentials(session.credentials);
        try {
            const { data } = await getStateInstanceApi();
            const state = data.stateInstance;
            if (state !== 'authorized') {
                clearCredentials();
                return rejectWithValue(ERROR_TEXTS.notAuthorized(state));
            }
        } catch (e) {
            clearCredentials();
            const error = toApiError(e);
            return rejectWithValue(error.kind === 'network' ? LOGIN_TEXTS.networkError : error.message);
        }

        storeSession(session);
        restoreSession(dispatch, session);
        void dispatch(checkSettings());
    },
);

// MSW нужен только в демо, поэтому воркер и хендлеры приезжают отдельным чанком.
export const startDemo = async (scenario: DemoScenario) => {
    const mocks = await import('../../../../mocks/browser');
    await mocks.startDemo(scenario);
};

export const openDemo = createAppAsyncThunk(
    'session/openDemo',
    async (scenario: DemoScenario, { dispatch, rejectWithValue }) => {
        try {
            await startDemo(scenario);
        } catch {
            return rejectWithValue(DEMO_TEXTS.failed);
        }
        const result = await dispatch(
            signIn({ credentials: DEMO_CREDENTIALS, remember: false, mode: 'demo', scenario }),
        );
        if (signIn.rejected.match(result)) return rejectWithValue(result.payload ?? DEMO_TEXTS.failed);
    },
);

export const logout = () => (dispatch: AppDispatch) => {
    clearCredentials();
    forgetSession();
    dispatch(sessionActions.loggedOut());
};

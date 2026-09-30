import { fatalErrorOccurred, settingsChecked } from '@/entities/session';
import { greenApi, isFatal, toApiError } from '@/shared/api';
import { createAppAsyncThunk } from '@/shared/lib/redux';
import { settingsWarning } from '../lib/settingsWarning';

// Только подсказываем: SetSettings перезапускает инстанс на несколько минут, трогать его сами не будем.
export const checkSettings = createAppAsyncThunk('auth/checkSettings', async (_, { dispatch }) => {
    try {
        dispatch(settingsChecked(settingsWarning(await greenApi.getSettings())));
    } catch (e) {
        const error = toApiError(e);
        if (isFatal(error)) dispatch(fatalErrorOccurred(error.message));
    }
});

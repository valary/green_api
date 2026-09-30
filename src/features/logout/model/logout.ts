import { forgetSession, loggedOut } from '@/entities/session';
import { clearCredentials } from '@/shared/api';
import type { AppDispatch } from '@/app/store';

export const logout = () => (dispatch: AppDispatch) => {
    clearCredentials();
    forgetSession();
    dispatch(loggedOut());
};

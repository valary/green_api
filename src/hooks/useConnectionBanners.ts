import { selectConnection } from '../app/store/selectors';
import { connectionActions } from '../app/store/slices/connection/connectionSlice';
import { useAppDispatch, useAppSelector } from './redux';
import { useLogout } from './useLogout';

export const useConnectionBanners = () => {
    const dispatch = useAppDispatch();
    const connection = useAppSelector(selectConnection);
    const relogin = useLogout();

    return {
        ...connection,
        relogin,
        dismissSettings: () => dispatch(connectionActions.settingsWarningDismissed()),
    };
};

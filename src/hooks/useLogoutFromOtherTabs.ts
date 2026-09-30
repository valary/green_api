import { useEffect } from 'react';
import { SESSION_STORAGE_KEY } from '@/shared/utils/sessionStorage';
import { useAppDispatch } from './redux';
import { logout } from '@/app/store/slices/session/thunks';

// С «Запомнить» сессия общая для вкладок — выход в одной должен разлогинить все.
export const useLogoutFromOtherTabs = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key === SESSION_STORAGE_KEY && event.newValue === null) dispatch(logout());
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [dispatch]);
};

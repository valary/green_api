import { useEffect } from 'react';
import { SESSION_STORAGE_KEY } from '@/entities/session';
import { useAppDispatch } from '@/shared/lib/redux';
import { logout } from './logout';

// С «Запомнить» сессия общая для вкладок — выход в одной должен разлогинить все.
export function useLogoutFromOtherTabs() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key === SESSION_STORAGE_KEY && event.newValue === null) dispatch(logout());
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [dispatch]);
}

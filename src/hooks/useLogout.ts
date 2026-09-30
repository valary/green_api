import { logout } from '../app/store/slices/session/thunks';
import { useAppDispatch } from './redux';

export const useLogout = () => {
    const dispatch = useAppDispatch();
    return () => dispatch(logout());
};

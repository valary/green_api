import { useAppDispatch } from '@/hooks/redux';
import { Button } from '@/shared/ui/Button/Button';
import { Icon } from '@/shared/ui/Icon/Icon';
import { logout } from '@/app/store/slices/session/thunks';

export const LogoutButton = () => {
    const dispatch = useAppDispatch();

    return (
        <Button onClick={() => dispatch(logout())}>
            <Icon name="logout" />
            Выйти
        </Button>
    );
};

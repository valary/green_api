import { useAppDispatch } from '@/shared/lib/redux';
import { Button, Icon } from '@/shared/ui';
import { logout } from '../model/logout';

export function LogoutButton() {
    const dispatch = useAppDispatch();

    return (
        <Button onClick={() => dispatch(logout())}>
            <Icon name="logout" />
            Выйти
        </Button>
    );
}

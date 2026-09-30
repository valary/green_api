import { useAppDispatch } from '../../hooks/redux';
import { Button } from '../../shared/ui/Button/Button';
import { Icon } from '../../shared/ui/Icon/Icon';
import { logout } from '../../app/store/slices/session/thunks';
import { CHAT_LIST_TEXTS } from '../../shared/constants/texts';

export const LogoutButton = () => {
    const dispatch = useAppDispatch();

    return (
        <Button onClick={() => dispatch(logout())}>
            <Icon name="logout" />
            {CHAT_LIST_TEXTS.logout}
        </Button>
    );
};

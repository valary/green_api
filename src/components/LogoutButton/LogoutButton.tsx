import { useLogout } from '../../hooks/useLogout';
import { CHAT_LIST_TEXTS } from '../../shared/constants/texts';
import { Button } from '../../shared/ui/Button/Button';
import { Icon } from '../../shared/ui/Icon/Icon';

export const LogoutButton = () => {
    const logout = useLogout();

    return (
        <Button onClick={logout}>
            <Icon name="logout" />
            {CHAT_LIST_TEXTS.logout}
        </Button>
    );
};

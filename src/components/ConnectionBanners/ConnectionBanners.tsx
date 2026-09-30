import { selectConnection } from '@/app/store/selectors';
import { connectionActions } from '@/app/store/slices/connection/connectionSlice';
import { logout } from '@/app/store/slices/session/thunks';
import { ERROR_TEXT } from '@/app/api/apiError';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Button } from '@/shared/ui/Button/Button';
import { Icon } from '@/shared/ui/Icon/Icon';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { BannerStack, ConnectionBanner, BannerText } from './ConnectionBanners.styles';

export const ConnectionBanners = () => {
    const dispatch = useAppDispatch();
    const { fatalError, online, problem, receivingElsewhere, settingsWarning } =
        useAppSelector(selectConnection);

    return (
        <BannerStack>
            {fatalError && (
                <ConnectionBanner $tone="danger" role="alert">
                    <Icon name="alert" />
                    <BannerText>{fatalError}</BannerText>
                    <Button variant="primary" onClick={() => dispatch(logout())}>
                        Выйти и ввести заново
                    </Button>
                </ConnectionBanner>
            )}
            {!online && !fatalError && (
                <ConnectionBanner $tone="neutral" role="status">
                    <Spinner />
                    <BannerText>{ERROR_TEXT.network}</BannerText>
                </ConnectionBanner>
            )}
            {problem && !fatalError && (
                <ConnectionBanner $tone="warning" role="alert">
                    <Icon name="warn" />
                    <BannerText>Приём сообщений не работает: {problem}</BannerText>
                </ConnectionBanner>
            )}
            {receivingElsewhere && (
                <ConnectionBanner $tone="neutral" role="status">
                    <Icon name="bubble" />
                    <BannerText>
                        Сообщения принимает другая вкладка с этим инстансом. Закройте её — приём продолжится
                        здесь
                    </BannerText>
                </ConnectionBanner>
            )}
            {settingsWarning && (
                <ConnectionBanner $tone="warning" role="status">
                    <Icon name="warn" />
                    <BannerText>{settingsWarning}</BannerText>
                    <Button onClick={() => dispatch(connectionActions.settingsWarningDismissed())}>
                        Скрыть
                    </Button>
                </ConnectionBanner>
            )}
        </BannerStack>
    );
};

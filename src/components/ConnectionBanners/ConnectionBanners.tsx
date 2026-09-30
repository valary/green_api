import { selectConnection } from '../../app/store/selectors';
import { connectionActions } from '../../app/store/slices/connection/connectionSlice';
import { logout } from '../../app/store/slices/session/thunks';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Button } from '../../shared/ui/Button/Button';
import { Icon } from '../../shared/ui/Icon/Icon';
import { Spinner } from '../../shared/ui/Spinner/Spinner';
import { BannerStack, ConnectionBanner, BannerText } from './ConnectionBanners.styles';
import { BANNER_TEXTS, ERROR_TEXTS } from '../../shared/constants/texts';

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
                        {BANNER_TEXTS.relogin}
                    </Button>
                </ConnectionBanner>
            )}
            {!online && !fatalError && (
                <ConnectionBanner $tone="neutral" role="status">
                    <Spinner />
                    <BannerText>{ERROR_TEXTS.network}</BannerText>
                </ConnectionBanner>
            )}
            {problem && !fatalError && (
                <ConnectionBanner $tone="warning" role="alert">
                    <Icon name="warn" />
                    <BannerText>{BANNER_TEXTS.receiveProblem(problem)}</BannerText>
                </ConnectionBanner>
            )}
            {receivingElsewhere && (
                <ConnectionBanner $tone="neutral" role="status">
                    <Icon name="bubble" />
                    <BannerText>{BANNER_TEXTS.otherTab}</BannerText>
                </ConnectionBanner>
            )}
            {settingsWarning && (
                <ConnectionBanner $tone="warning" role="status">
                    <Icon name="warn" />
                    <BannerText>{settingsWarning}</BannerText>
                    <Button onClick={() => dispatch(connectionActions.settingsWarningDismissed())}>
                        {BANNER_TEXTS.dismiss}
                    </Button>
                </ConnectionBanner>
            )}
        </BannerStack>
    );
};

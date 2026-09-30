import { useConnectionBanners } from '../../hooks/useConnectionBanners';
import { BANNER_TEXTS, ERROR_TEXTS } from '../../shared/constants/texts';
import { Button } from '../../shared/ui/Button/Button';
import { Icon } from '../../shared/ui/Icon/Icon';
import { Spinner } from '../../shared/ui/Spinner/Spinner';
import { BannerStack, BannerText, ConnectionBanner } from './ConnectionBanners.styles';

export const ConnectionBanners = () => {
    const { fatalError, online, problem, receivingElsewhere, settingsWarning, relogin, dismissSettings } =
        useConnectionBanners();

    return (
        <BannerStack>
            {fatalError && (
                <ConnectionBanner $tone="danger" role="alert">
                    <Icon name="alert" />
                    <BannerText>{fatalError}</BannerText>
                    <Button variant="primary" onClick={relogin}>
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
                    <Button onClick={dismissSettings}>{BANNER_TEXTS.dismiss}</Button>
                </ConnectionBanner>
            )}
        </BannerStack>
    );
};

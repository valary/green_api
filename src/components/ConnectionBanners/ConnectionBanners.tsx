import { selectConnection } from '@/app/store/selectors';
import { connectionActions } from '@/app/store/slices/connection/connectionSlice';
import { logout } from '@/app/store/slices/session/thunks';
import { ERROR_TEXT } from '@/app/api/apiError';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Button } from '@/shared/ui/Button/Button';
import { Icon } from '@/shared/ui/Icon/Icon';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import * as S from './ConnectionBanners.styles';

export function ConnectionBanners() {
    const dispatch = useAppDispatch();
    const { fatalError, online, problem, receivingElsewhere, settingsWarning } =
        useAppSelector(selectConnection);

    return (
        <S.Banners>
            {fatalError && (
                <S.Banner $tone="danger" role="alert">
                    <Icon name="alert" />
                    <S.Text>{fatalError}</S.Text>
                    <Button variant="primary" onClick={() => dispatch(logout())}>
                        Выйти и ввести заново
                    </Button>
                </S.Banner>
            )}
            {!online && !fatalError && (
                <S.Banner $tone="neutral" role="status">
                    <Spinner />
                    <S.Text>{ERROR_TEXT.network}</S.Text>
                </S.Banner>
            )}
            {problem && !fatalError && (
                <S.Banner $tone="warning" role="alert">
                    <Icon name="warn" />
                    <S.Text>Приём сообщений не работает: {problem}</S.Text>
                </S.Banner>
            )}
            {receivingElsewhere && (
                <S.Banner $tone="neutral" role="status">
                    <Icon name="bubble" />
                    <S.Text>
                        Сообщения принимает другая вкладка с этим инстансом. Закройте её — приём продолжится
                        здесь
                    </S.Text>
                </S.Banner>
            )}
            {settingsWarning && (
                <S.Banner $tone="warning" role="status">
                    <Icon name="warn" />
                    <S.Text>{settingsWarning}</S.Text>
                    <Button onClick={() => dispatch(connectionActions.settingsWarningDismissed())}>
                        Скрыть
                    </Button>
                </S.Banner>
            )}
        </S.Banners>
    );
}

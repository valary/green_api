import { DemoButton, LoginForm } from '@/features/auth';
import { Icon } from '@/shared/ui';
import * as S from './LoginPage.styles';

export function LoginPage() {
    return (
        <S.Page as="main">
            <S.Card aria-labelledby="login-title">
                <S.Mark>
                    <Icon name="bubble" />
                </S.Mark>
                <S.Title id="login-title">Вход по данным GREEN-API</S.Title>
                <S.Lead>
                    idInstance и apiTokenInstance — на странице инстанса в личном кабинете GREEN-API
                </S.Lead>
                <LoginForm />
                <DemoButton />
            </S.Card>
        </S.Page>
    );
}

import { DemoButton } from '@/components/DemoButton/DemoButton';
import { LoginForm } from '@/components/LoginForm/LoginForm';
import { Icon } from '@/shared/ui/Icon/Icon';
import { LoginScreen, LoginCard, LoginMark, LoginTitle, LoginLead } from './LoginPage.styles';

export const LoginPage = () => {
    return (
        <LoginScreen as="main">
            <LoginCard aria-labelledby="login-title">
                <LoginMark>
                    <Icon name="bubble" />
                </LoginMark>
                <LoginTitle id="login-title">Вход по данным GREEN-API</LoginTitle>
                <LoginLead>
                    idInstance и apiTokenInstance — на странице инстанса в личном кабинете GREEN-API
                </LoginLead>
                <LoginForm />
                <DemoButton />
            </LoginCard>
        </LoginScreen>
    );
};

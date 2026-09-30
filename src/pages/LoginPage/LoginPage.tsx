import { DemoButton } from '../../components/DemoButton/DemoButton';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import { Icon } from '../../shared/ui/Icon/Icon';
import { LoginScreen, LoginCard, LoginMark, LoginTitle, LoginLead } from './LoginPage.styles';
import { LOGIN_TEXTS } from '../../shared/constants/texts';

export const LoginPage = () => {
    return (
        <LoginScreen as="main">
            <LoginCard aria-labelledby="login-title">
                <LoginMark>
                    <Icon name="bubble" />
                </LoginMark>
                <LoginTitle id="login-title">{LOGIN_TEXTS.title}</LoginTitle>
                <LoginLead>{LOGIN_TEXTS.lead}</LoginLead>
                <LoginForm />
                <DemoButton />
            </LoginCard>
        </LoginScreen>
    );
};

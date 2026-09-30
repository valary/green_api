import { useLoginForm } from '../../hooks/useLoginForm';
import { LOGIN_TEXTS } from '../../shared/constants/texts';
import { Alert } from '../../shared/ui/Alert/Alert';
import { Button } from '../../shared/ui/Button/Button';
import { IconButton } from '../../shared/ui/Button/Button.styles';
import { Checkbox } from '../../shared/ui/Checkbox/Checkbox';
import { Icon } from '../../shared/ui/Icon/Icon';
import { TextField } from '../../shared/ui/TextField/TextField';
import { LoginFormBody } from './LoginForm.styles';

export const LoginForm = () => {
    const { fields, errors, isSubmitting, tokenVisible, toggleToken, tokenRejected, submit } = useLoginForm();

    return (
        <LoginFormBody onSubmit={submit} noValidate>
            <TextField
                label={LOGIN_TEXTS.idInstanceLabel}
                placeholder={LOGIN_TEXTS.idInstancePlaceholder}
                hint={LOGIN_TEXTS.idInstanceHint}
                inputMode="numeric"
                autoComplete="username"
                error={errors.idInstance?.message}
                disabled={isSubmitting}
                {...fields.idInstance}
            />
            <TextField
                label={LOGIN_TEXTS.tokenLabel}
                placeholder={LOGIN_TEXTS.tokenPlaceholder}
                type={tokenVisible ? 'text' : 'password'}
                autoComplete="current-password"
                spellCheck={false}
                autoCapitalize="off"
                error={errors.apiTokenInstance?.message}
                aria-invalid={tokenRejected || undefined}
                disabled={isSubmitting}
                action={
                    <IconButton
                        aria-label={tokenVisible ? LOGIN_TEXTS.hideToken : LOGIN_TEXTS.showToken}
                        aria-pressed={tokenVisible}
                        onClick={toggleToken}
                    >
                        <Icon name={tokenVisible ? 'eyeOff' : 'eye'} />
                    </IconButton>
                }
                {...fields.apiTokenInstance}
            />
            <TextField
                label={LOGIN_TEXTS.apiUrlLabel}
                placeholder={LOGIN_TEXTS.apiUrlPlaceholder}
                hint={LOGIN_TEXTS.apiUrlHint}
                inputMode="url"
                spellCheck={false}
                autoCapitalize="off"
                error={errors.apiUrl?.message}
                disabled={isSubmitting}
                {...fields.apiUrl}
            />
            <Checkbox
                label={LOGIN_TEXTS.remember}
                hint={LOGIN_TEXTS.rememberHint}
                disabled={isSubmitting}
                {...fields.remember}
            />

            {errors.root && <Alert>{errors.root.message}</Alert>}

            <Button type="submit" variant="primary" block loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? LOGIN_TEXTS.submitting : LOGIN_TEXTS.submit}
            </Button>
        </LoginFormBody>
    );
};

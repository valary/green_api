import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../hooks/redux';
import { Alert } from '../../shared/ui/Alert/Alert';
import { Button } from '../../shared/ui/Button/Button';
import { Checkbox } from '../../shared/ui/Checkbox/Checkbox';
import { Icon } from '../../shared/ui/Icon/Icon';
import { IconButton } from '../../shared/ui/Button/Button.styles';
import { TextField } from '../../shared/ui/TextField/TextField';
import { deriveApiUrl } from '../../shared/utils/deriveApiUrl';
import { loginSchema } from './loginSchema';
import type { LoginValues } from './loginSchema';
import { signIn } from '../../app/store/slices/session/thunks';
import { LoginFormBody } from './LoginForm.styles';
import { ERROR_TEXTS, LOGIN_TEXTS } from '../../shared/constants/texts';

const defaultValues: LoginValues = { idInstance: '', apiTokenInstance: '', apiUrl: '', remember: false };

export const LoginForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [tokenVisible, setTokenVisible] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        setFocus,
        setError,
        getFieldState,
        formState: { errors, isSubmitting },
    } = useForm<LoginValues>({ resolver: yupResolver(loginSchema), mode: 'onBlur', defaultValues });

    useEffect(() => setFocus('idInstance'), [setFocus]);

    const onSubmit = async ({ remember, ...credentials }: LoginValues) => {
        const result = await dispatch(signIn({ credentials, remember, mode: 'live', scenario: null }));
        if (signIn.fulfilled.match(result)) navigate('/chat');
        else setError('root', { message: result.payload });
    };

    const tokenRejected = errors.root?.message === ERROR_TEXTS.unauthorized;

    return (
        <LoginFormBody onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
                label={LOGIN_TEXTS.idInstanceLabel}
                placeholder={LOGIN_TEXTS.idInstancePlaceholder}
                hint={LOGIN_TEXTS.idInstanceHint}
                inputMode="numeric"
                autoComplete="username"
                error={errors.idInstance?.message}
                disabled={isSubmitting}
                {...register('idInstance', {
                    onChange: (e: { target: HTMLInputElement }) => {
                        if (!getFieldState('apiUrl').isDirty)
                            setValue('apiUrl', deriveApiUrl(e.target.value));
                    },
                })}
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
                        onClick={() => setTokenVisible((visible) => !visible)}
                    >
                        <Icon name={tokenVisible ? 'eyeOff' : 'eye'} />
                    </IconButton>
                }
                {...register('apiTokenInstance')}
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
                {...register('apiUrl')}
            />
            <Checkbox
                label={LOGIN_TEXTS.remember}
                hint={LOGIN_TEXTS.rememberHint}
                disabled={isSubmitting}
                {...register('remember')}
            />

            {errors.root && <Alert>{errors.root.message}</Alert>}

            <Button type="submit" variant="primary" block loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? LOGIN_TEXTS.submitting : LOGIN_TEXTS.submit}
            </Button>
        </LoginFormBody>
    );
};

import type { ApiError } from '../../types/greenApi';
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

const defaultValues: LoginValues = { idInstance: '', apiTokenInstance: '', apiUrl: '', remember: false };

const errorText = (error: ApiError) =>
    error.kind === 'network'
        ? 'Нет связи с GREEN-API. Проверьте интернет и нажмите «Войти» ещё раз'
        : error.message;

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
        try {
            await dispatch(signIn({ credentials, remember, mode: 'live', scenario: null })).unwrap();
            navigate('/chat');
        } catch (e) {
            const error = e as ApiError;
            setError('root', { type: error.kind, message: errorText(error) });
        }
    };

    const tokenRejected = errors.root?.type === 'unauthorized';

    return (
        <LoginFormBody onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
                label="idInstance"
                placeholder="1101000001"
                hint="Номер инстанса, только цифры"
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
                label="apiTokenInstance"
                placeholder="Токен"
                type={tokenVisible ? 'text' : 'password'}
                autoComplete="current-password"
                spellCheck={false}
                autoCapitalize="off"
                error={errors.apiTokenInstance?.message}
                aria-invalid={tokenRejected || undefined}
                disabled={isSubmitting}
                action={
                    <IconButton
                        aria-label={tokenVisible ? 'Скрыть токен' : 'Показать токен'}
                        aria-pressed={tokenVisible}
                        onClick={() => setTokenVisible((visible) => !visible)}
                    >
                        <Icon name={tokenVisible ? 'eyeOff' : 'eye'} />
                    </IconButton>
                }
                {...register('apiTokenInstance')}
            />
            <TextField
                label="apiUrl"
                placeholder="https://1101.api.green-api.com"
                hint="Подставляется по idInstance. Меняйте, только если в кабинете указан другой"
                inputMode="url"
                spellCheck={false}
                autoCapitalize="off"
                error={errors.apiUrl?.message}
                disabled={isSubmitting}
                {...register('apiUrl')}
            />
            <Checkbox
                label="Запомнить на этом устройстве"
                hint="Токен останется в браузере после закрытия вкладки. Не включайте на чужом компьютере"
                disabled={isSubmitting}
                {...register('remember')}
            />

            {errors.root && <Alert>{errors.root.message}</Alert>}

            <Button type="submit" variant="primary" block loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? 'Проверяем инстанс…' : 'Войти'}
            </Button>
        </LoginFormBody>
    );
};

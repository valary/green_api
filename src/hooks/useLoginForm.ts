import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../app/store/slices/session/thunks';
import { loginSchema } from '../shared/validation/loginSchema';
import type { LoginValues } from '../types/forms';
import { ERROR_TEXTS } from '../shared/constants/texts';
import { deriveApiUrl } from '../shared/utils/deriveApiUrl';
import { useAppDispatch } from './redux';

const defaultValues: LoginValues = { idInstance: '', apiTokenInstance: '', apiUrl: '', remember: false };

export const useLoginForm = () => {
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

    // apiUrl подставляется по idInstance, пока пользователь не поправил его руками.
    const onIdInstanceChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!getFieldState('apiUrl').isDirty) setValue('apiUrl', deriveApiUrl(event.target.value));
    };

    const submit = handleSubmit(async ({ remember, ...credentials }) => {
        const result = await dispatch(signIn({ credentials, remember, mode: 'live', scenario: null }));
        if (signIn.fulfilled.match(result)) return navigate('/chat');
        setError('root', { message: result.payload });
    });

    return {
        fields: {
            idInstance: register('idInstance', { onChange: onIdInstanceChange }),
            apiTokenInstance: register('apiTokenInstance'),
            apiUrl: register('apiUrl'),
            remember: register('remember'),
        },
        errors,
        isSubmitting,
        tokenVisible,
        toggleToken: () => setTokenVisible((visible) => !visible),
        tokenRejected: errors.root?.message === ERROR_TEXTS.unauthorized,
        submit,
    };
};

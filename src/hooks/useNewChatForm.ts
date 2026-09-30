import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createChatByPhone } from '../app/store/slices/chat/thunks';
import { phoneSchema } from '../shared/validation/phoneSchema';
import type { PhoneValues } from '../types/forms';
import { useAppDispatch } from './redux';

export const useNewChatForm = (onCreated: (chatId: string) => void) => {
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        setFocus,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<PhoneValues>({
        resolver: yupResolver(phoneSchema),
        mode: 'onBlur',
        defaultValues: { phone: '' },
    });

    useEffect(() => setFocus('phone'), [setFocus]);

    const submit = handleSubmit(async ({ phone }) => {
        const result = await dispatch(createChatByPhone(phone));
        if (createChatByPhone.fulfilled.match(result)) return onCreated(result.payload);
        setError('root', { message: result.payload });
        setFocus('phone');
    });

    return {
        phoneField: register('phone', { onChange: () => clearErrors('root') }),
        errors,
        isSubmitting,
        submit,
    };
};

import type { ApiError } from '../../types/greenApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { normalizePhone } from '../../shared/utils/phone';
import { useAppDispatch } from '../../hooks/redux';
import { Alert } from '../../shared/ui/Alert/Alert';
import { Button } from '../../shared/ui/Button/Button';
import { Modal } from '../../shared/ui/Modal/Modal';
import { TextField } from '../../shared/ui/TextField/TextField';
import { createChatByPhone } from '../../app/store/slices/chat/thunks';
import { phoneSchema } from './phoneSchema';
import type { PhoneValues } from './phoneSchema';
import { PhoneForm, DialogActions } from './NewChatDialog.styles';
import { NEW_CHAT_TEXTS } from '../../shared/constants/texts';

type Props = {
    onClose: () => void;
    onCreated: (chatId: string) => void;
};

const errorText = (error: ApiError) =>
    error.kind === 'network' ? NEW_CHAT_TEXTS.networkError : error.message;

export const NewChatDialog = ({ onClose, onCreated }: Props) => {
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

    const onSubmit = async ({ phone }: PhoneValues) => {
        try {
            onCreated(await dispatch(createChatByPhone(normalizePhone(phone)!)).unwrap());
        } catch (e) {
            setError('root', { message: errorText(e as ApiError) });
            setFocus('phone');
        }
    };

    return (
        <Modal title={NEW_CHAT_TEXTS.title} onClose={onClose}>
            <PhoneForm onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                    label={NEW_CHAT_TEXTS.phoneLabel}
                    placeholder={NEW_CHAT_TEXTS.phonePlaceholder}
                    hint={NEW_CHAT_TEXTS.phoneHint}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    readOnly={isSubmitting}
                    error={errors.phone?.message}
                    {...register('phone', { onChange: () => clearErrors('root') })}
                />
                {errors.root && <Alert>{errors.root.message}</Alert>}
                <DialogActions>
                    <Button variant="text" onClick={onClose}>
                        {NEW_CHAT_TEXTS.cancel}
                    </Button>
                    <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
                        {isSubmitting ? NEW_CHAT_TEXTS.submitting : NEW_CHAT_TEXTS.submit}
                    </Button>
                </DialogActions>
            </PhoneForm>
        </Modal>
    );
};

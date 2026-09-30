import type { ApiError } from '@/types/greenApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { normalizePhone } from '@/shared/utils/phone';
import { useAppDispatch } from '@/hooks/redux';
import { Alert } from '@/shared/ui/Alert/Alert';
import { Button } from '@/shared/ui/Button/Button';
import { Modal } from '@/shared/ui/Modal/Modal';
import { TextField } from '@/shared/ui/TextField/TextField';
import { createChatByPhone } from '@/app/store/slices/chat/thunks';
import { phoneSchema } from './phoneSchema';
import type { PhoneValues } from './phoneSchema';
import { PhoneForm, DialogActions } from './NewChatDialog.styles';

type Props = {
    onClose: () => void;
    onCreated: (chatId: string) => void;
};

const errorText = (error: ApiError) =>
    error.kind === 'network'
        ? 'Нет связи с GREEN-API. Проверьте интернет и попробуйте ещё раз'
        : error.message;

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
        <Modal title="Новый чат" onClose={onClose}>
            <PhoneForm onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                    label="Номер телефона"
                    placeholder="+7 900 123-45-67"
                    hint="В международном формате, можно с пробелами и скобками"
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
                        Отмена
                    </Button>
                    <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
                        {isSubmitting ? 'Ищем в Telegram…' : 'Открыть чат'}
                    </Button>
                </DialogActions>
            </PhoneForm>
        </Modal>
    );
};

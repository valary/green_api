import * as yup from 'yup';
import { normalizePhone } from '../../shared/utils/phone';

export const PHONE_FORMAT_ERROR = 'Введите номер в международном формате, например +7 900 123-45-67';

export const phoneSchema = yup.object({
    phone: yup
        .string()
        .required(PHONE_FORMAT_ERROR)
        .test('phone', PHONE_FORMAT_ERROR, (value) => normalizePhone(value) !== null),
});

export type PhoneValues = yup.InferType<typeof phoneSchema>;

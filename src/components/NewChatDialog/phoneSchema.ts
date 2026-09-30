import * as yup from 'yup';
import { normalizePhone } from '../../shared/utils/phone';
import { NEW_CHAT_TEXTS } from '../../shared/constants/texts';

export const phoneSchema = yup.object({
    phone: yup
        .string()
        .required(NEW_CHAT_TEXTS.phoneFormat)
        .test('phone', NEW_CHAT_TEXTS.phoneFormat, (value) => normalizePhone(value) !== null),
});

export type PhoneValues = yup.InferType<typeof phoneSchema>;

import { object, string } from 'yup';
import type { ObjectSchema } from 'yup';
import type { PhoneValues } from '../../types/forms';
import { NEW_CHAT_TEXTS } from '../constants/texts';
import { normalizePhone } from '../utils/phone';

export const phoneSchema: ObjectSchema<PhoneValues> = object({
    phone: string()
        .required(NEW_CHAT_TEXTS.phoneFormat)
        .test('phone', NEW_CHAT_TEXTS.phoneFormat, (value) => normalizePhone(value) !== null),
});

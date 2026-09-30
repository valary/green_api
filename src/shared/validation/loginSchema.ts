import { boolean, object, string } from 'yup';
import type { ObjectSchema } from 'yup';
import type { LoginValues } from '../../types/forms';
import { LOGIN_TEXTS } from '../constants/texts';

export const loginSchema: ObjectSchema<LoginValues> = object({
    idInstance: string()
        .trim()
        .required(LOGIN_TEXTS.idInstanceRequired)
        .matches(/^\d{4,}$/, LOGIN_TEXTS.idInstanceFormat),
    apiTokenInstance: string().trim().required(LOGIN_TEXTS.tokenRequired),
    apiUrl: string()
        .trim()
        .required(LOGIN_TEXTS.apiUrlRequired)
        .matches(/^https:\/\/\S+$/, LOGIN_TEXTS.apiUrlFormat),
    remember: boolean().defined(),
});

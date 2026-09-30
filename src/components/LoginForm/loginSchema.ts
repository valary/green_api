import * as yup from 'yup';
import { LOGIN_TEXTS } from '../../shared/constants/texts';

export const loginSchema = yup.object({
    idInstance: yup
        .string()
        .trim()
        .required(LOGIN_TEXTS.idInstanceRequired)
        .matches(/^\d{4,}$/, LOGIN_TEXTS.idInstanceFormat),
    apiTokenInstance: yup.string().trim().required(LOGIN_TEXTS.tokenRequired),
    apiUrl: yup
        .string()
        .trim()
        .required(LOGIN_TEXTS.apiUrlRequired)
        .matches(/^https:\/\/\S+$/, LOGIN_TEXTS.apiUrlFormat),
    remember: yup.boolean().defined(),
});

export type LoginValues = yup.InferType<typeof loginSchema>;

import * as yup from 'yup';

export const loginSchema = yup.object({
    idInstance: yup
        .string()
        .trim()
        .required('Введите idInstance')
        .matches(/^\d{4,}$/, 'Только цифры, например 1101000001'),
    apiTokenInstance: yup.string().trim().required('Введите apiTokenInstance'),
    apiUrl: yup
        .string()
        .trim()
        .required('Введите apiUrl')
        .matches(/^https:\/\/\S+$/, 'Адрес вида https://1101.api.green-api.com'),
    remember: yup.boolean().defined(),
});

export type LoginValues = yup.InferType<typeof loginSchema>;

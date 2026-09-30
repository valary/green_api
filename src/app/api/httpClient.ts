import axios from 'axios';
import { toApiError } from './apiError';
import type { Credentials } from '@/types/greenApi';

let credentials: Credentials | null = null;

export const setCredentials = (next: Credentials) => {
    credentials = next;
};

export const clearCredentials = () => {
    credentials = null;
};

export const httpClient = axios.create({ timeout: 15_000 });

// GREEN-API принимает токен только в пути: {apiUrl}/waInstance{id}/{method}/{token}/{params}.
// Путь собирается здесь и больше нигде, в state и в логи токен не попадает.
httpClient.interceptors.request.use((config) => {
    if (!credentials) throw new axios.CanceledError('no session');

    const { apiUrl, idInstance, apiTokenInstance } = credentials;
    const [method, ...params] = (config.url ?? '').split('/');
    config.url = [
        apiUrl.replace(/\/+$/, ''),
        `waInstance${idInstance}`,
        method,
        apiTokenInstance,
        ...params,
    ].join('/');
    return config;
});

httpClient.interceptors.response.use(undefined, (error: unknown) => {
    const apiError = toApiError(error);
    const token = credentials?.apiTokenInstance;
    if (token) apiError.message = apiError.message.replaceAll(token, '***');
    return Promise.reject(apiError);
});

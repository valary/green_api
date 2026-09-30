import type { AxiosPromise } from 'axios';
import { RECEIVE_TIMEOUT_SEC } from '@/app/config';
import type {
    CheckAccountResponse,
    InstanceSettings,
    QueuedNotification,
    StateInstance,
} from '@/types/greenApi';
import { httpClient } from './httpClient';

export const getStateInstanceApi = async (): AxiosPromise<{ stateInstance: StateInstance }> =>
    httpClient.get('getStateInstance');

export const getSettingsApi = async (): AxiosPromise<InstanceSettings> => httpClient.get('getSettings');

export const checkAccountApi = async (phoneNumber: number): AxiosPromise<CheckAccountResponse> =>
    httpClient.post('checkAccount', { phoneNumber });

export const sendMessageApi = async (chatId: string, message: string): AxiosPromise<{ idMessage: string }> =>
    httpClient.post('sendMessage', { chatId, message });

// Пустая очередь приходит как null после receiveTimeout — сервер держит запрос открытым.
export const receiveNotificationApi = async (signal?: AbortSignal): AxiosPromise<QueuedNotification | null> =>
    httpClient.get('receiveNotification', {
        params: { receiveTimeout: RECEIVE_TIMEOUT_SEC },
        timeout: (RECEIVE_TIMEOUT_SEC + 15) * 1000,
        signal,
    });

// result: false значит «уже удалено» — для очереди это тоже успех.
export const deleteNotificationApi = async (receiptId: number): AxiosPromise<{ result: boolean }> =>
    httpClient.delete(`deleteNotification/${receiptId}`);

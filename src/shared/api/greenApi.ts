import { RECEIVE_TIMEOUT_SEC } from '@/shared/config';
import { httpClient } from './httpClient';
import type { CheckAccountResponse, InstanceSettings, QueuedNotification, StateInstance } from './types';

export const greenApi = {
    async getStateInstance() {
        const { data } = await httpClient.get<{ stateInstance: StateInstance }>('getStateInstance');
        return data.stateInstance;
    },

    async getSettings() {
        const { data } = await httpClient.get<InstanceSettings>('getSettings');
        return data;
    },

    async checkAccount(phoneNumber: number) {
        const { data } = await httpClient.post<CheckAccountResponse>('checkAccount', { phoneNumber });
        return data;
    },

    async sendMessage(chatId: string, message: string) {
        const { data } = await httpClient.post<{ idMessage: string }>('sendMessage', { chatId, message });
        return data;
    },

    async receiveNotification(signal?: AbortSignal) {
        const { data } = await httpClient.get<QueuedNotification | null>('receiveNotification', {
            params: { receiveTimeout: RECEIVE_TIMEOUT_SEC },
            timeout: (RECEIVE_TIMEOUT_SEC + 15) * 1000,
            signal,
        });
        return data || null;
    },

    // result: false значит «уже удалено» — для очереди это тоже успех.
    async deleteNotification(receiptId: number) {
        const { data } = await httpClient.delete<{ result: boolean }>(`deleteNotification/${receiptId}`);
        return data.result;
    },
};

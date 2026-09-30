import { createSlice } from '@reduxjs/toolkit';
import { chatReducers } from '@/app/store/slices/chat/reducers/chatReducers';
import { initialChats } from './initialChats';
import { notificationReducers } from '@/app/store/slices/chat/reducers/notificationReducers';
import { sendReducers } from '@/app/store/slices/chat/reducers/sendReducers';

export const chatSlice = createSlice({
    name: 'chat',
    initialState: initialChats,
    reducers: { ...chatReducers, ...sendReducers, ...notificationReducers },
});

export const {
    chatCreated,
    chatOpened,
    chatClosed,
    chatsRestored,
    messageQueued,
    messageRetried,
    messageSent,
    messageFailed,
    incomingMessageReceived,
    outgoingEchoReceived,
    deliveryStatusReceived,
} = chatSlice.actions;

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

export const chatActions = chatSlice.actions;
export const chatReducer = chatSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { chatReducers } from './reducers/chatReducers';
import { initialChats } from './initialChats';
import { notificationReducers } from './reducers/notificationReducers';
import { sendReducers } from './reducers/sendReducers';

export const chatSlice = createSlice({
    name: 'chat',
    initialState: initialChats,
    reducers: { ...chatReducers, ...sendReducers, ...notificationReducers },
});

export const chatActions = chatSlice.actions;
export const chatReducer = chatSlice.reducer;

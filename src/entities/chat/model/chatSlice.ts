import { createSlice } from '@reduxjs/toolkit'
import { chatReducers } from './chatReducers'
import { initialChats } from './initialChats'
import { notificationReducers } from './notificationReducers'
import { sendReducers } from './sendReducers'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: initialChats,
  reducers: { ...chatReducers, ...sendReducers, ...notificationReducers },
})

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
} = chatSlice.actions

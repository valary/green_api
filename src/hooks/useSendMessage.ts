import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { MAX_MESSAGE_LENGTH } from '../app/config';
import { sendMessage } from '../app/store/slices/chat/thunks';
import { useAppDispatch } from './redux';

const COUNTER_FROM = MAX_MESSAGE_LENGTH - 100;
const MAX_FIELD_HEIGHT = 192;

export const useSendMessage = (chatId: string) => {
    const dispatch = useAppDispatch();
    const [text, setText] = useState('');
    const fieldRef = useRef<HTMLTextAreaElement>(null);
    const tooLong = text.length > MAX_MESSAGE_LENGTH;
    const canSend = text.trim() !== '' && !tooLong;

    useLayoutEffect(() => {
        const field = fieldRef.current;
        if (!field) return;
        field.style.height = 'auto';
        field.style.height = `${Math.min(field.scrollHeight, MAX_FIELD_HEIGHT)}px`;
    }, [text]);

    // На телефоне не открываем клавиатуру сами — фокус ставим только при мыши.
    useEffect(() => {
        if (!window.matchMedia?.('(pointer: coarse)').matches) fieldRef.current?.focus();
    }, [chatId]);

    const send = () => {
        if (!canSend) return;
        void dispatch(sendMessage({ chatId, text }));
        setText('');
    };

    return {
        text,
        fieldRef,
        tooLong,
        canSend,
        showCounter: text.length >= COUNTER_FROM,
        onChange: (event: ChangeEvent<HTMLTextAreaElement>) => setText(event.target.value),
        onSubmit: (event: FormEvent) => {
            event.preventDefault();
            send();
        },
        onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => {
            if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
            event.preventDefault();
            send();
        },
    };
};

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { MAX_MESSAGE_LENGTH } from '@/shared/config';
import { useAppDispatch } from '@/shared/lib/redux';
import { Icon, ServicePill, VisuallyHidden } from '@/shared/ui';
import { sendMessage } from '../model/sendMessage';
import * as S from './Composer.styles';

const COUNTER_FROM = MAX_MESSAGE_LENGTH - 100;
const MAX_HEIGHT = 192;

const formatCount = (value: number) => value.toLocaleString('ru-RU');

export function Composer({ chatId }: { chatId: string }) {
    const dispatch = useAppDispatch();
    const [text, setText] = useState('');
    const fieldRef = useRef<HTMLTextAreaElement>(null);
    const tooLong = text.length > MAX_MESSAGE_LENGTH;
    const canSend = text.trim() !== '' && !tooLong;

    useLayoutEffect(() => {
        const field = fieldRef.current;
        if (!field) return;
        field.style.height = 'auto';
        field.style.height = `${Math.min(field.scrollHeight, MAX_HEIGHT)}px`;
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

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        send();
    };

    const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
        event.preventDefault();
        send();
    };

    return (
        <S.Form onSubmit={onSubmit}>
            {tooLong && (
                <S.Note>
                    <ServicePill role="status">Сообщение длиннее 4 096 символов — сократите его</ServicePill>
                </S.Note>
            )}
            <S.Inner>
                <S.Box>
                    <VisuallyHidden as="label" htmlFor="composer-field">
                        Сообщение
                    </VisuallyHidden>
                    <textarea
                        id="composer-field"
                        ref={fieldRef}
                        rows={1}
                        placeholder="Сообщение"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        onKeyDown={onKeyDown}
                        aria-describedby={text.length >= COUNTER_FROM ? 'composer-counter' : undefined}
                    />
                    {text.length >= COUNTER_FROM && (
                        <S.Counter id="composer-counter" $over={tooLong}>
                            {formatCount(text.length)} / {formatCount(MAX_MESSAGE_LENGTH)}
                        </S.Counter>
                    )}
                </S.Box>
                <S.Send type="submit" aria-label="Отправить" aria-disabled={!canSend} $ready={canSend}>
                    <Icon name="send" />
                </S.Send>
            </S.Inner>
        </S.Form>
    );
}

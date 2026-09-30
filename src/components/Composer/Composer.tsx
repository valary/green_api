import { MAX_MESSAGE_LENGTH } from '../../app/config';
import { useSendMessage } from '../../hooks/useSendMessage';
import { COMPOSER_TEXTS } from '../../shared/constants/texts';
import { ServicePill } from '../../shared/ui/ChatBackground/ChatBackground';
import { Icon } from '../../shared/ui/Icon/Icon';
import { VisuallyHidden } from '../../shared/ui/VisuallyHidden/VisuallyHidden';
import {
    ComposerForm,
    ComposerRow,
    LengthCounter,
    MessageFieldBox,
    SendButton,
    TooLongNote,
} from './Composer.styles';

const formatCount = (value: number) => value.toLocaleString('ru-RU');

type Props = { chatId: string };

export const Composer = ({ chatId }: Props) => {
    const { text, fieldRef, tooLong, canSend, showCounter, onChange, onSubmit, onKeyDown } =
        useSendMessage(chatId);

    return (
        <ComposerForm onSubmit={onSubmit}>
            {tooLong && (
                <TooLongNote>
                    <ServicePill role="status">{COMPOSER_TEXTS.tooLong}</ServicePill>
                </TooLongNote>
            )}
            <ComposerRow>
                <MessageFieldBox>
                    <VisuallyHidden as="label" htmlFor="composer-field">
                        {COMPOSER_TEXTS.label}
                    </VisuallyHidden>
                    <textarea
                        id="composer-field"
                        ref={fieldRef}
                        rows={1}
                        placeholder={COMPOSER_TEXTS.placeholder}
                        value={text}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        aria-describedby={showCounter ? 'composer-counter' : undefined}
                    />
                    {showCounter && (
                        <LengthCounter id="composer-counter" $over={tooLong}>
                            {formatCount(text.length)} / {formatCount(MAX_MESSAGE_LENGTH)}
                        </LengthCounter>
                    )}
                </MessageFieldBox>
                <SendButton
                    type="submit"
                    aria-label={COMPOSER_TEXTS.send}
                    aria-disabled={!canSend}
                    $ready={canSend}
                >
                    <Icon name="send" />
                </SendButton>
            </ComposerRow>
        </ComposerForm>
    );
};

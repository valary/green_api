import { useNewChatForm } from '../../hooks/useNewChatForm';
import { NEW_CHAT_TEXTS } from '../../shared/constants/texts';
import { Alert } from '../../shared/ui/Alert/Alert';
import { Button } from '../../shared/ui/Button/Button';
import { Modal } from '../../shared/ui/Modal/Modal';
import { TextField } from '../../shared/ui/TextField/TextField';
import { DialogActions, PhoneForm } from './NewChatDialog.styles';

type Props = {
    onClose: () => void;
    onCreated: (chatId: string) => void;
};

export const NewChatDialog = ({ onClose, onCreated }: Props) => {
    const { phoneField, errors, isSubmitting, submit } = useNewChatForm(onCreated);

    return (
        <Modal title={NEW_CHAT_TEXTS.title} onClose={onClose}>
            <PhoneForm onSubmit={submit} noValidate>
                <TextField
                    label={NEW_CHAT_TEXTS.phoneLabel}
                    placeholder={NEW_CHAT_TEXTS.phonePlaceholder}
                    hint={NEW_CHAT_TEXTS.phoneHint}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    readOnly={isSubmitting}
                    error={errors.phone?.message}
                    {...phoneField}
                />
                {errors.root && <Alert>{errors.root.message}</Alert>}
                <DialogActions>
                    <Button variant="text" onClick={onClose}>
                        {NEW_CHAT_TEXTS.cancel}
                    </Button>
                    <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
                        {isSubmitting ? NEW_CHAT_TEXTS.submitting : NEW_CHAT_TEXTS.submit}
                    </Button>
                </DialogActions>
            </PhoneForm>
        </Modal>
    );
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectChatPreviews } from '../app/store/selectors';
import { useAppSelector } from './redux';

export const useChatList = () => {
    const navigate = useNavigate();
    const previews = useAppSelector(selectChatPreviews);
    const [dialogOpen, setDialogOpen] = useState(false);

    const openChat = (chatId: string) => navigate(`/chat/${chatId}`);

    return {
        previews,
        openChat,
        dialogOpen,
        openDialog: () => setDialogOpen(true),
        closeDialog: () => setDialogOpen(false),
        onChatCreated: (chatId: string) => {
            setDialogOpen(false);
            openChat(chatId);
        },
    };
};

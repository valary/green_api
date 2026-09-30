import type { ReceivedEvent } from '@/types/chat';
import { useEffect } from 'react';
import { chatActions } from '@/app/store/slices/chat/chatSlice';
import { connectionActions } from '@/app/store/slices/connection/connectionSlice';
import { useAppDispatch } from './redux';
import { runInSingleTab } from '@/shared/utils/tabLock';

import { pollNotifications } from '@/app/api/pollNotifications';

const toAction = (event: ReceivedEvent) => {
    switch (event.kind) {
        case 'incoming':
            return chatActions.incomingMessageReceived(event.message);
        case 'echo':
            return chatActions.outgoingEchoReceived(event.message);
        case 'status':
            return chatActions.deliveryStatusReceived(event.update);
        case 'ignored':
            return null;
    }
};

export const useNotificationPolling = (idInstance: string | undefined) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!idInstance) return;
        const controller = new AbortController();

        // Очередь у инстанса одна: два опросчика делят уведомления, и ответ «пропадает» в соседней вкладке.
        void runInSingleTab(
            `green-api-chat:poller:${idInstance}`,
            controller.signal,
            (waiting) => dispatch(connectionActions.receivingElsewhereChanged(waiting)),
            () =>
                pollNotifications({
                    signal: controller.signal,
                    onEvent: (event) => {
                        const action = toAction(event);
                        if (action) dispatch(action);
                    },
                    onNetworkChange: (online) => dispatch(connectionActions.networkChanged(online)),
                    onFatal: (message) => dispatch(connectionActions.fatalErrorOccurred(message)),
                    onProblem: (message) => dispatch(connectionActions.problemChanged(message)),
                }),
        );

        return () => controller.abort();
    }, [idInstance, dispatch]);
};

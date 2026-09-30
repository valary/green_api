import type { ReceivedEvent } from '@/types/chat';
import { useEffect } from 'react';
import {
    deliveryStatusReceived,
    incomingMessageReceived,
    outgoingEchoReceived,
} from '@/app/store/slices/chat/chatSlice';
import {
    fatalErrorOccurred,
    networkChanged,
    problemChanged,
    receivingElsewhereChanged,
} from '@/app/store/slices/connection/connectionSlice';
import { useAppDispatch } from './redux';
import { runInSingleTab } from '@/shared/utils/tabLock';

import { pollNotifications } from '@/app/api/pollNotifications';

function toAction(event: ReceivedEvent) {
    switch (event.kind) {
        case 'incoming':
            return incomingMessageReceived(event.message);
        case 'echo':
            return outgoingEchoReceived(event.message);
        case 'status':
            return deliveryStatusReceived(event.update);
        case 'ignored':
            return null;
    }
}

export function useNotificationPolling(idInstance: string | undefined) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!idInstance) return;
        const controller = new AbortController();

        // Очередь у инстанса одна: два опросчика делят уведомления, и ответ «пропадает» в соседней вкладке.
        void runInSingleTab(
            `green-api-chat:poller:${idInstance}`,
            controller.signal,
            (waiting) => dispatch(receivingElsewhereChanged(waiting)),
            () =>
                pollNotifications({
                    signal: controller.signal,
                    onEvent: (event) => {
                        const action = toAction(event);
                        if (action) dispatch(action);
                    },
                    onNetworkChange: (online) => dispatch(networkChanged(online)),
                    onFatal: (message) => dispatch(fatalErrorOccurred(message)),
                    onProblem: (message) => dispatch(problemChanged(message)),
                }),
        );

        return () => controller.abort();
    }, [idInstance, dispatch]);
}

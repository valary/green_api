import { Icon, type IconName } from '@/shared/ui';
import type { MessageStatus } from '../model/types';

const marks: Record<MessageStatus, { icon: IconName; label: string }> = {
    sending: { icon: 'clock', label: 'Отправляется' },
    sent: { icon: 'check', label: 'Отправлено' },
    delivered: { icon: 'checks', label: 'Доставлено' },
    read: { icon: 'checks', label: 'Прочитано' },
    error: { icon: 'alert', label: 'Не отправлено' },
};

export function DeliveryMark({ status, className }: { status: MessageStatus; className?: string }) {
    const { icon, label } = marks[status];
    return <Icon name={icon} label={label} small className={className} />;
}

import { Icon } from '@/shared/ui/Icon/Icon';
import type { IconName } from '@/shared/ui/Icon/Icon';
import type { MessageStatus } from '@/types/message';

const marks: Record<MessageStatus, { icon: IconName; label: string }> = {
    sending: { icon: 'clock', label: 'Отправляется' },
    sent: { icon: 'check', label: 'Отправлено' },
    delivered: { icon: 'checks', label: 'Доставлено' },
    read: { icon: 'checks', label: 'Прочитано' },
    error: { icon: 'alert', label: 'Не отправлено' },
};

type Props = { status: MessageStatus; className?: string };

export const DeliveryMark = ({ status, className }: Props) => {
    const { icon, label } = marks[status];
    return <Icon name={icon} label={label} small className={className} />;
};

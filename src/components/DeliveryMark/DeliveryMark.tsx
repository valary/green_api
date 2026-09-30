import { Icon } from '../../shared/ui/Icon/Icon';
import type { IconName } from '../../shared/ui/Icon/Icon';
import type { MessageStatus } from '../../types/message';
import { MESSAGE_STATUS_TEXTS } from '../../shared/constants/texts';

const marks: Record<MessageStatus, { icon: IconName; label: string }> = {
    sending: { icon: 'clock', label: MESSAGE_STATUS_TEXTS.sending },
    sent: { icon: 'check', label: MESSAGE_STATUS_TEXTS.sent },
    delivered: { icon: 'checks', label: MESSAGE_STATUS_TEXTS.delivered },
    read: { icon: 'checks', label: MESSAGE_STATUS_TEXTS.read },
    error: { icon: 'alert', label: MESSAGE_STATUS_TEXTS.error },
};

type Props = { status: MessageStatus; className?: string };

export const DeliveryMark = ({ status, className }: Props) => {
    const { icon, label } = marks[status];
    return <Icon name={icon} label={label} small className={className} />;
};

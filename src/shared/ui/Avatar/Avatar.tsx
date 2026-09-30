import { avatarIndex, initials } from '@/shared/utils/avatar';
import { AvatarCircle } from './Avatar.styles';

type Props = { chatId: string; title: string; small?: boolean };

export const Avatar = ({ chatId, title, small }: Props) => {
    return (
        <AvatarCircle $gradient={avatarIndex(chatId)} $small={small} aria-hidden="true">
            {initials(title)}
        </AvatarCircle>
    );
};

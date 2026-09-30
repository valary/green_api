import { avatarIndex, initials } from '@/shared/utils/avatar';
import * as S from './Avatar.styles';

export function Avatar({ chatId, title, small }: { chatId: string; title: string; small?: boolean }) {
    return (
        <S.Avatar $gradient={avatarIndex(chatId)} $small={small} aria-hidden="true">
            {initials(title)}
        </S.Avatar>
    );
}

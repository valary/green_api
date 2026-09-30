import { useAppSelector } from '@/hooks/redux';
import { selectIsDemo } from '@/app/store/selectors';
import * as S from './DemoBadge.styles';

export function DemoBadge({ className }: { className?: string }) {
    const isDemo = useAppSelector(selectIsDemo);
    if (!isDemo) return null;

    return (
        <S.Badge className={className} title="Данные не уходят в GREEN-API — это имитация">
            Демо
        </S.Badge>
    );
}

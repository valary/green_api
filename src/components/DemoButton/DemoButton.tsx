import { useOpenDemo } from '../../hooks/useOpenDemo';
import { DEMO_TEXTS } from '../../shared/constants/texts';
import { Alert } from '../../shared/ui/Alert/Alert';
import { Button } from '../../shared/ui/Button/Button';
import { DemoHint, DemoSection, OrDivider } from './DemoButton.styles';

export const DemoButton = () => {
    const { scenario, status, open } = useOpenDemo();
    const opening = status === 'loading';

    return (
        <DemoSection>
            <OrDivider>{DEMO_TEXTS.divider}</OrDivider>
            <Button variant="text" block loading={opening} disabled={opening} onClick={open}>
                {opening ? DEMO_TEXTS.opening : DEMO_TEXTS.open}
            </Button>
            <DemoHint>{DEMO_TEXTS.hints[scenario]}</DemoHint>
            {status === 'failed' && <Alert>{DEMO_TEXTS.failed}</Alert>}
        </DemoSection>
    );
};

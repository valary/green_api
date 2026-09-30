import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { Alert } from '../../shared/ui/Alert/Alert';
import { Button } from '../../shared/ui/Button/Button';
import { demoScenarioHints, parseDemoScenario } from '../../shared/utils/demoScenario';
import { openDemo } from '../../app/store/slices/session/thunks';
import { DemoSection, OrDivider, DemoHint } from './DemoButton.styles';
import { DEMO_TEXTS } from '../../shared/constants/texts';

export const DemoButton = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [opening, setOpening] = useState(false);
    const [failed, setFailed] = useState(false);
    const autoOpened = useRef(false);
    const scenario = parseDemoScenario(searchParams.get('demo'));

    const open = async () => {
        setOpening(true);
        setFailed(false);
        try {
            await dispatch(openDemo(scenario)).unwrap();
            navigate('/chat');
        } catch {
            setFailed(true);
            setOpening(false);
        }
    };

    // Ссылка вида ?demo=offline сразу открывает нужный сценарий — удобно давать ревьюеру.
    useEffect(() => {
        if (!searchParams.has('demo') || autoOpened.current) return;
        autoOpened.current = true;
        void open();
    });

    return (
        <DemoSection>
            <OrDivider>{DEMO_TEXTS.divider}</OrDivider>
            <Button variant="text" block loading={opening} disabled={opening} onClick={open}>
                {opening ? DEMO_TEXTS.opening : DEMO_TEXTS.open}
            </Button>
            <DemoHint>{demoScenarioHints[scenario]}</DemoHint>
            {failed && <Alert>{DEMO_TEXTS.failed}</Alert>}
        </DemoSection>
    );
};

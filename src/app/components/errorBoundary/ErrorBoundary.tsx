import * as React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import * as Sentry from '@sentry/browser';
import { detect } from 'detect-browser';
import { Ingress } from 'nav-frontend-typografi';
import ErrorGuide from '../error-guide/ErrorGuide';

interface State {
    eventId: string | null;
}

let errorCount = 0;
let clearErrorCountTimeoutId: number | undefined;

export const isKnownBrowserIssue = (err: Error) => {
    const browser = detect();
    try {
        if (browser) {
            const { os, name, version } = browser;
            const message = err.message || '';
            if (os === 'iOS' && name === 'safari' && version?.indexOf('10.') === 0) {
                if (message.toLowerCase().indexOf('quota') >= 0) {
                    // https://stackoverflow.com/questions/21159301/quotaexceedederror-dom-exception-22-an-attempt-was-made-to-add-something-to-st/30174554
                    return true;
                }
            }
            if (os === 'Windows 10' && name === 'edge' && version?.match(/(^17.|^18.)\w+/)) {
                if (err.name === 'Ugyldig kallende objekt' || err.name === 'Invalid calling object') {
                    // Fokus issue for edge 17 og 18 - stopper ikke utfylling
                    return true;
                }
            }
            if (message === 'ResizeObserver loop limit exceeded') {
                // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
                // https://github.com/WICG/ResizeObserver/issues/38
                return true;
            }
        }
    } catch (e) {}
    return false;
};

class ErrorBoundary extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);
        this.state = { eventId: null };
    }

    componentDidCatch(error: Error | null, errorInfo: object) {
        errorCount++;
        const isKnownIssue = error && isKnownBrowserIssue(error);
        Sentry.withScope((scope) => {
            if (isKnownIssue) {
                scope.setLevel(Sentry.Severity.Info);
            }
            scope.setExtras({ errorInfo, error, errorCount });
            const eventId = Sentry.captureException(error);
            this.setState({ eventId });
        });
        if (clearErrorCountTimeoutId === undefined) {
            clearErrorCountTimeoutId = window.setTimeout(() => {
                errorCount = 0;
                console.log('reset error counter');
            }, 15000);
        }
    }

    render() {
        if (errorCount > 5) {
            return (
                <Page
                    title={'Det oppstod en feil'}
                    topContentRenderer={() => (
                        <>
                            <StepBanner text="Midlertidig kompensasjon for selvstendig næringsdrivende og frilansere" />
                        </>
                    )}>
                    <Box margin="xxxl">
                        <ErrorGuide title="Noe gikk galt ...">
                            <Ingress>
                                Beklager, her har det dessverre skjedd en feil. Dersom feilen fortsetter, prøv igjen
                                litt senere.
                            </Ingress>
                        </ErrorGuide>
                    </Box>
                </Page>
            );
        }
        return this.props.children;
    }
}
export default ErrorBoundary;

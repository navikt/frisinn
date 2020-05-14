import * as React from 'react';
import * as Sentry from '@sentry/browser';
import { detect } from 'detect-browser';

interface State {
    eventId: string | null;
}

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
                if (err.name === 'Ugyldig kallende objekt') {
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
        const isKnownIssue = error && isKnownBrowserIssue(error);
        Sentry.withScope((scope) => {
            if (isKnownIssue) {
                scope.setLevel(Sentry.Severity.Info);
            }
            scope.setExtras(errorInfo);
            const eventId = Sentry.captureException(error);
            this.setState({ eventId });
        });
    }

    render() {
        return this.props.children;
    }
}
export default ErrorBoundary;

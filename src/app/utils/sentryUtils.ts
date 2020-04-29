import * as Sentry from '@sentry/browser';
import { Severity } from '@sentry/browser';

export enum SentryEventName {
    'mapSelvstendigNæringsdrivendeFormDataToApiData' = 'mapSelvstendigNæringsdrivendeFormDataToApiData',
    'mapFrilanserFormDataToApiData' = 'mapFrilanserFormDataToApiData',
}

export const triggerSentryEvent = (eventName: SentryEventName, level: Severity, message?: string) => {
    Sentry.withScope((scope) => {
        scope.setTag('eventName', eventName);
        scope.setLevel(level);
        if (level === Severity.Error) {
            const err = new Error();
            err.message = message || 'no message';
            err.name = eventName;
            Sentry.captureException(err);
        }
        Sentry.captureMessage(`${eventName}${message ? `: ${message}` : ''}`);
    });
};

export const triggerSentryError = (eventName: SentryEventName, error: Error) => {
    Sentry.withScope((scope) => {
        scope.setTag('eventName', eventName);
        Sentry.captureException(error);
    });
};

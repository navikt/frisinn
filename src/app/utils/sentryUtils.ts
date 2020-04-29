import * as Sentry from '@sentry/browser';
import { Severity, Event as SentryEvent } from '@sentry/browser';

export enum SentryEventName {
    'mapSelvstendigNæringsdrivendeFormDataToApiDataReturnsUndefined' = 'mapSelvstendigNæringsdrivendeFormDataToApiData returns undefined',
    'mapFrilanserFormDataToApiDataReturnsUndefined' = 'mapFrilanserFormDataToApiData returns undefined',
    'noMatchingSoknadRoute' = 'noMatchingSoknadRoute',
}

interface CustomError extends Error {
    payload?: any;
}

export const triggerSentryEvent = (
    eventName: SentryEventName,
    level: Severity,
    message: string,
    payload?: string | any
) => {
    Sentry.withScope((scope) => {
        scope.setTag('eventName', eventName);
        scope.setLevel(level);
        if (level === Severity.Error) {
            const err: CustomError = {
                name: eventName,
                message,
                payload,
            };
            Sentry.captureException(err);
        }
        Sentry.captureMessage(`${eventName}: ${message}`);
    });
};

export const triggerSentryCustomError = (eventName: SentryEventName, payload?: string | any) => {
    Sentry.withScope((scope) => {
        scope.setTag('eventName', eventName);
        scope.setLevel(Severity.Error);
        const evt: SentryEvent = {
            message: eventName,
            extra: { payload: JSON.parse(JSON.stringify(payload)) },
        };
        Sentry.captureEvent(evt);
    });
};

export const triggerSentryError = (eventName: SentryEventName, error: Error) => {
    Sentry.withScope((scope) => {
        scope.setTag('eventName', eventName);
        Sentry.captureException(error);
    });
};

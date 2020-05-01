import * as Sentry from '@sentry/browser';
import { Severity, Event as SentryEvent } from '@sentry/browser';

export enum SentryEventName {
    'mapSelvstendigNæringsdrivendeFormDataToApiDataReturnsUndefined' = 'mapSelvstendigNæringsdrivendeFormDataToApiData returns undefined',
    'mapFrilanserFormDataToApiDataReturnsUndefined' = 'mapFrilanserFormDataToApiData returns undefined',
    'noMatchingSoknadRoute' = 'noMatchingSoknadRoute',
    'sendSoknadFailed' = 'sendSoknadFailed',
    'apiRequestFailed' = 'apiRequestFailed',
    'invalidSelvstendigAndFrilansApiData' = 'invalidSelvstendigAndFrilansApiData',
    'soknadSentSuccessfully' = 'soknadSentSuccessfully',
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

export const triggerSentryMessage = (eventName: SentryEventName, payload?: string | any) => {
    Sentry.withScope((scope) => {
        scope.setTag('eventName', eventName);
        scope.setLevel(Severity.Info);
        const extra = { payload: payload ? JSON.parse(JSON.stringify(payload)) : undefined };
        const extraString = extra ? JSON.stringify(payload) : undefined;

        const evt: SentryEvent = {
            message: eventName,
            extra: extraString ? JSON.parse(extraString) : undefined,
        };
        Sentry.captureEvent(evt);
    });
};

export const triggerSentryCustomError = (eventName: SentryEventName, payload?: string | any) => {
    Sentry.withScope((scope) => {
        scope.setTag('eventName', eventName);
        scope.setLevel(Severity.Error);
        const evt: SentryEvent = {
            message: eventName,
            extra: { payload: payload ? JSON.parse(JSON.stringify(payload)) : undefined },
        };
        Sentry.captureEvent(evt);
    });
};

export const triggerSentryError = (eventName: SentryEventName, error: Error, tag?: { key: string; value: string }) => {
    Sentry.withScope((scope) => {
        scope.setTag('eventName', eventName);
        if (tag) {
            scope.setTag(tag.key, tag.value);
        }
        Sentry.captureException(error);
    });
};
import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import api, { ApiEndpoint } from '../api';
import { HistoriskInntektÅrstall } from '../../types/HistoriskInntektÅrstall';
import { AvsluttetSelskap } from '../../types/AvsluttetSelskap';
import { SentryEventName, triggerSentryMessage, triggerSentryCustomError } from '../../utils/sentryUtils';
import { parseInntektsperiodeApiResponse } from './inntektsperiodeUtils';

export interface InntektsperiodeApiResponse {
    inntektsperiode: { fom: ApiStringDate; tom: ApiStringDate };
}

interface GetInntektsperiodePayload {
    opphørtePersonligeForetak?: OpphørtPersonligeForetak[];
}

export interface Inntektsperiode {
    inntektsårstall: HistoriskInntektÅrstall;
}

export interface OpphørtPersonligeForetak {
    navn: string;
    registreringsdato: ApiStringDate;
    opphørsdato: ApiStringDate;
}

export async function getInntektsperiode({
    avsluttaSelskaper = [],
}: {
    avsluttaSelskaper: AvsluttetSelskap[];
}): Promise<Inntektsperiode> {
    try {
        const payload: GetInntektsperiodePayload = {
            opphørtePersonligeForetak: avsluttaSelskaper.map((f) => ({
                navn: f.navn,
                opphørsdato: formatDateToApiFormat(f.avsluttetDato),
                registreringsdato: formatDateToApiFormat(f.opprettetDato),
            })),
        };
        const { data } = await api.post<GetInntektsperiodePayload, InntektsperiodeApiResponse>(
            ApiEndpoint.inntektsperiode,
            payload
        );
        const inntektsperiode = parseInntektsperiodeApiResponse(data);
        if (inntektsperiode) {
            triggerSentryMessage(SentryEventName.getInntektsperiodeLog, JSON.stringify({ data, inntektsperiode }));
            return Promise.resolve(inntektsperiode);
        } else {
            triggerSentryCustomError(SentryEventName.getInntektsperiodeLog, JSON.stringify({ data, inntektsperiode }));
        }
        return Promise.reject('Could not parse inntektsårstall');
    } catch (error) {
        return Promise.reject(error);
    }
}

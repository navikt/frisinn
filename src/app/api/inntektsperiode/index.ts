import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { apiStringDateToDate, DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import api, { ApiEndpoint } from '../api';
import { HistoriskInntektÅrstall } from '../../types/HistoriskInntektÅrstall';
import { AvsluttetSelskap } from '../../types/AvsluttetSelskap';
import { SentryEventName, triggerSentryMessage } from '../../utils/sentryUtils';

interface InntektsperiodeApiResponse {
    inntektsperiode: { fom: ApiStringDate; tom: ApiStringDate };
}

interface GetInntektsperiodePayload {
    opphørtePersonligeForetak?: OpphørtPersonligeForetak[];
}

export interface Inntektsperiode {
    inntektsperiode?: DateRange;
    inntektsårstall: HistoriskInntektÅrstall;
}

export interface OpphørtPersonligeForetak {
    navn: string;
    registreringsdato: ApiStringDate;
    opphørsdato: ApiStringDate;
}

const parseInntektsperiodeApiResponse = (respons: InntektsperiodeApiResponse): Inntektsperiode => {
    const from = apiStringDateToDate(respons.inntektsperiode.fom);
    const to = apiStringDateToDate(respons.inntektsperiode.tom);
    const inntektsperiode: Inntektsperiode = {
        inntektsperiode: {
            from,
            to,
        },
        inntektsårstall: from.getFullYear() === 2019 ? 2019 : 2020,
    };
    triggerSentryMessage(SentryEventName.getInntektsperiodeLog, JSON.stringify({ respons, inntektsperiode }));
    return inntektsperiode;
};

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
        return Promise.resolve(parseInntektsperiodeApiResponse(data));
    } catch (error) {
        return Promise.reject(error);
    }
}

import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { apiStringDateToDate, DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import api, { ApiEndpoint } from '../api';
import { HistoriskInntektÅrstall } from '../../types/inntektÅrstall';
import { HistoriskFortak } from '../../types/HistoriskeForetak';

interface Tidsperiode {
    fom: ApiStringDate;
    tom: ApiStringDate;
}

export interface InntektsperiodeApiResponse {
    inntektsperiode: Tidsperiode;
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
export interface GetInntektsperiodePayload {
    opphørtePersonligeForetak?: OpphørtPersonligeForetak[];
}

const parseInntektsperiodeApiResponse = (respons: InntektsperiodeApiResponse): Inntektsperiode => {
    const from = apiStringDateToDate(respons.inntektsperiode.fom);
    const to = apiStringDateToDate(respons.inntektsperiode.tom);
    return {
        inntektsperiode: {
            from,
            to,
        },
        inntektsårstall: from.getFullYear() === 2019 ? 2019 : 2020,
    };
};

export async function getInntektsperiode({
    historiskeForetak = [],
}: {
    historiskeForetak: HistoriskFortak[];
}): Promise<Inntektsperiode> {
    try {
        const payload: GetInntektsperiodePayload = {
            opphørtePersonligeForetak: historiskeForetak.map((f) => ({
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

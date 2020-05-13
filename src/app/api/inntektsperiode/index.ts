import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { apiStringDateToDate, DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import api, { ApiEndpoint } from '../api';
import { HistoriskInntektÅrstall } from '../../types/inntektÅrstall';

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
    selvstendigInntektstapStartetDato,
    startetSomSelvstendigNæringsdrivende,
}: {
    selvstendigInntektstapStartetDato?: Date;
    startetSomSelvstendigNæringsdrivende?: Date;
}): Promise<Inntektsperiode> {
    try {
        const params = [];
        if (selvstendigInntektstapStartetDato) {
            params.push(`inntektstapStartet=${formatDateToApiFormat(selvstendigInntektstapStartetDato)}`);
        }

        if (startetSomSelvstendigNæringsdrivende) {
            params.push(
                `startetSomSelvstendigNæringsdrivende=${formatDateToApiFormat(startetSomSelvstendigNæringsdrivende)}`
            );
        }
        const { data } = await api.get<InntektsperiodeApiResponse>(ApiEndpoint.inntektsperiode, params.join('&'));
        return Promise.resolve(parseInntektsperiodeApiResponse(data));
    } catch (error) {
        return Promise.reject(error);
    }
}

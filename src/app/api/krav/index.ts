import api, { ApiEndpoint } from '../api';
import { ApiKrav } from '../../types/Krav';
import { DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';

const getKravEndPointFromKrav = (krav: ApiKrav) => {
    switch (krav) {
        case ApiKrav.alder:
            return ApiEndpoint.kravAlder;
        case ApiKrav.selvstendig:
            return ApiEndpoint.kravSelvstendigNæringsdrivende;
    }
};

export interface KravApiResponse {
    innfrirKrav: boolean;
    beskrivelse: string;
}

export const sjekkKrav = (krav: ApiKrav, dateRange?: DateRange) => {
    const params = dateRange
        ? `fom=${formatDateToApiFormat(dateRange.from)}&tom=${formatDateToApiFormat(dateRange.to)}`
        : undefined;
    return api.get<KravApiResponse>(getKravEndPointFromKrav(krav), params);
};

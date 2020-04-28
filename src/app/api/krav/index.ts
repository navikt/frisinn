import { DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ApiKrav } from '../../types/ApiKrav';
import api, { ApiEndpoint } from '../api';

const getKravEndPointFromKrav = (krav: ApiKrav): ApiEndpoint => {
    switch (krav) {
        case ApiKrav.alder:
            return ApiEndpoint.kravAlder;
        case ApiKrav.selvstendig:
            return ApiEndpoint.kravSelvstendigNæringsdrivende;
        case ApiKrav.maksEnSoknadPerPeriodeAccessCheck:
            return ApiEndpoint.kravMaksEnSoknadPerPeriode;
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

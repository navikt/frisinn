import { DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ApiKrav } from '../../types/ApiKrav';
import api, { ApiEndpoint } from '../api';

const getKravEndPointFromKrav = (krav: ApiKrav): ApiEndpoint => {
    switch (krav) {
        case ApiKrav.alder:
            return ApiEndpoint.kravAlder;
        case ApiKrav.maksEnSoknadPerPeriodeAccessCheck:
            return ApiEndpoint.kravMaksEnSoknadPerPeriode;
        case ApiKrav.apenAlder:
            return ApiEndpoint.apenKravAlder;
    }
};

export interface KravApiResponse {
    innfrirKrav: boolean;
    beskrivelse: string;
}

export const fomTomParam = (dateRange: DateRange) =>
    `fom=${formatDateToApiFormat(dateRange.from)}&tom=${formatDateToApiFormat(dateRange.to)}`;

export const sjekkKrav = (krav: ApiKrav, params?: string) => {
    return api.get<KravApiResponse>(getKravEndPointFromKrav(krav), params);
};

import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import api, { ApiEndpoint } from '../api';
import { ApplicationDateRanges } from '../../types/ApplicationEssentials';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface PeriodeTidsperiode {
    fom: ApiStringDate;
    tom: ApiStringDate;
}

export interface PerioderApiResponse {
    søknadsperiode: PeriodeTidsperiode;
    kanSøkeSomFrilanser: PeriodeTidsperiode;
    kanSøkeSomSelvstendigNæringsdrivende: PeriodeTidsperiode;
}

const parsePerioderApiResponse = (søknadsperioder: PerioderApiResponse): ApplicationDateRanges => {
    const ranges: ApplicationDateRanges = {
        applicationDateRange: {
            from: apiStringDateToDate(søknadsperioder.søknadsperiode.fom),
            to: apiStringDateToDate(søknadsperioder.søknadsperiode.tom),
        },
        frilansDateRange: {
            from: apiStringDateToDate(søknadsperioder.kanSøkeSomFrilanser.fom),
            to: apiStringDateToDate(søknadsperioder.kanSøkeSomFrilanser.tom),
        },
        selvstendigDateRange: {
            from: apiStringDateToDate(søknadsperioder.kanSøkeSomSelvstendigNæringsdrivende.fom),
            to: apiStringDateToDate(søknadsperioder.kanSøkeSomSelvstendigNæringsdrivende.tom),
        },
    };
    return ranges;
};

export async function getPerioder(): Promise<ApplicationDateRanges> {
    try {
        const { data } = await api.get<PerioderApiResponse>(ApiEndpoint.perioder);
        return Promise.resolve(parsePerioderApiResponse(data));
    } catch (error) {
        return Promise.reject(undefined);
    }
}

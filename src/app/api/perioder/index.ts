import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import api, { ApiEndpoint } from '../api';
import { ApplicationDateRanges } from '../../types/ApplicationEssentials';
import { apiStringDateToDate, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface PeriodeTidsperiode {
    fom: ApiStringDate;
    tom: ApiStringDate;
}

export interface PerioderApiResponse {
    søknadsperiode: PeriodeTidsperiode;
}

const parsePerioderApiResponse = (søknadsperioder: PerioderApiResponse): ApplicationDateRanges => {
    const ranges: ApplicationDateRanges = {
        applicationDateRange: {
            from: apiStringDateToDate(søknadsperioder.søknadsperiode.fom),
            to: apiStringDateToDate(søknadsperioder.søknadsperiode.tom),
        },
    };
    return ranges;
};

export async function getPerioder(inntektstapStartet?: Date[]): Promise<ApplicationDateRanges> {
    try {
        const dateParamName = 'inntektstapStartet';
        const dates = inntektstapStartet?.map((date) => formatDateToApiFormat(date));
        const { data } = await api.get<PerioderApiResponse>(
            ApiEndpoint.perioder,
            dates ? `${dateParamName}=${dates.join(`&${dateParamName}=`)}` : undefined
        );
        return Promise.resolve(parsePerioderApiResponse(data));
    } catch (error) {
        return Promise.reject(undefined);
    }
}

import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import api, { ApiEndpoint } from '../api';
import { apiStringDateToDate, formatDateToApiFormat, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface PeriodeTidsperiode {
    fom: ApiStringDate;
    tom: ApiStringDate;
}

export interface PerioderApiResponse {
    søknadsperiode: PeriodeTidsperiode;
}

interface Perioder {
    søknadsperiode: DateRange;
}

const parsePerioderApiResponse = (søknadsperioder: PerioderApiResponse): Perioder => {
    const ranges: Perioder = {
        søknadsperiode: {
            from: apiStringDateToDate(søknadsperioder.søknadsperiode.fom),
            to: apiStringDateToDate(søknadsperioder.søknadsperiode.tom),
        },
    };
    return ranges;
};

export async function getPerioder(inntektstapStartet?: Date[]): Promise<Perioder> {
    try {
        const dateParamName = 'inntektstapStartet';
        const dates = inntektstapStartet?.map((date) => formatDateToApiFormat(date));
        const { data } = await api.get<PerioderApiResponse>(
            ApiEndpoint.perioder,
            dates ? `${dateParamName}=${dates.join(`&${dateParamName}=`)}` : undefined
        );
        return Promise.resolve(parsePerioderApiResponse(data));
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getSøknadsperiode(inntektstapStartet?: Date[]): Promise<DateRange> {
    try {
        const perioder = await getPerioder(inntektstapStartet);
        return Promise.resolve(perioder.søknadsperiode);
    } catch (error) {
        return Promise.reject(error);
    }
}

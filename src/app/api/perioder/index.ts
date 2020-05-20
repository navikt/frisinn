import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { apiStringDateToDate, DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import api, { ApiEndpoint } from '../api';

interface PeriodeTidsperiode {
    fom: ApiStringDate;
    tom: ApiStringDate;
}

interface Options {
    startetSøknad?: Date;
    inntektstapStartet: Date[];
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

async function getPerioder(options?: Options): Promise<Perioder> {
    try {
        const inntektstapStartetParamName = 'inntektstapStartet';
        const dates = options?.inntektstapStartet?.map((date) => formatDateToApiFormat(date));
        const params = [];

        if (dates) {
            params.push(`${inntektstapStartetParamName}=${dates.join(`&${inntektstapStartetParamName}=`)}`);
        }
        if (options?.startetSøknad) {
            params.push(`startetSøknad=${options.startetSøknad.toISOString()}`);
        }
        const { data } = await api.get<PerioderApiResponse>(ApiEndpoint.perioder, params.join('&'));
        return Promise.resolve(parsePerioderApiResponse(data));
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getSøknadsperiode(options?: Options): Promise<DateRange> {
    try {
        const perioder = await getPerioder(options);
        return Promise.resolve(perioder.søknadsperiode);
    } catch (error) {
        return Promise.reject(error);
    }
}

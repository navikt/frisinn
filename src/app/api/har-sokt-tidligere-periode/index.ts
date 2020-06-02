import { TidligerePerioder } from '../../types/SoknadEssentials';
import { DateRange } from '../../utils/dateUtils';
import { getSøknadsperiodeinfo } from '../../utils/søknadsperiodeUtils';
import api, { ApiEndpoint } from '../api';

interface HarSoktTidligereApiRespons {
    harSøktSomSelvstendigNæringsdrivende: boolean;
    harSøktSomFrilanser: boolean;
}

const harIkkeSøktTidligere: TidligerePerioder = {
    harSøktSomFrilanser: false,
    harSøktSomSelvstendigNæringsdrivende: false,
};

export async function getHarSoktTidligerePeriode(søknadsperiode: DateRange): Promise<TidligerePerioder> {
    try {
        if (søknadsperiode === undefined) {
            throw new Error('søknadsperiode is undefined');
        }
        if (getSøknadsperiodeinfo(søknadsperiode).erÅpnetForAndregangssøknad === false) {
            return Promise.resolve(harIkkeSøktTidligere);
        }
        const { data } = await api.get<HarSoktTidligereApiRespons>(ApiEndpoint.harSoktTidligerePeriode);
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject(error);
    }
}

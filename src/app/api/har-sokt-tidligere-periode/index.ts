import api, { ApiEndpoint } from '../api';
import { TidligerePerioder } from '../../types/SoknadEssentials';
import { DateRange } from '../../utils/dateUtils';
import Søknadsperioden from '../../utils/søknadsperioden';

interface HarSoktTidligereApiRespons {
    harSøktSomSelvstendigNæringsdrivende: boolean;
    harSøktSomFrilanser: boolean;
}

export async function getHarSoktTidligerePeriode(søknadsperiode: DateRange): Promise<TidligerePerioder> {
    try {
        if (søknadsperiode === undefined) {
            throw new Error('søknadsperiode is undefined');
        }
        if (Søknadsperioden(søknadsperiode).erÅpnetForAndregangssøknad === false) {
            return Promise.resolve({
                harSøktSomFrilanser: false,
                harSøktSomSelvstendigNæringsdrivende: false,
            });
        }
        const { data } = await api.get<HarSoktTidligereApiRespons>(ApiEndpoint.harSoktTidligerePeriode);
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject(error);
    }
}

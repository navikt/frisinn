import api, { ApiEndpoint } from '../api';
import { TidligerePerioder } from '../../types/SoknadEssentials';
import { DateRange } from '../../utils/dateUtils';
import { isFeatureEnabled, Feature } from '../../utils/featureToggleUtils';
import { erÅpnetForAndregangssøknad } from '../../utils/soknadsperiodeUtils';

interface HarSoktTidligereApiRespons {
    harSøktSomSelvstendigNæringsdrivende: boolean;
    harSøktSomFrilanser: boolean;
}

export async function getHarSoktTidligerePeriode(søknadsperiode: DateRange): Promise<TidligerePerioder> {
    try {
        if (
            erÅpnetForAndregangssøknad(søknadsperiode) === false ||
            isFeatureEnabled(Feature.ANDREGANGSSOKNAD) === false
        ) {
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

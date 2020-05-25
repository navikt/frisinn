import api, { ApiEndpoint } from '../api';
import { TidligerePerioder } from '../../types/SoknadEssentials';
import { isFeatureEnabled, Feature } from '../../utils/featureToggleUtils';

interface HarSoktTidligereApiRespons {
    harSøktSomSelvstendigNæringsdrivende: boolean;
    harSøktSomFrilanser: boolean;
}

export async function getHarSoktTidligerePeriode(): Promise<TidligerePerioder | undefined> {
    try {
        if (isFeatureEnabled(Feature.ANDREGANGSSOKNAD) === false) {
            return Promise.resolve(undefined);
        }
        const { data } = await api.get<HarSoktTidligereApiRespons>(ApiEndpoint.harSoktTidligerePeriode);
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject(error);
    }
}

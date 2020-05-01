import { useState } from 'react';
import { AxiosError } from 'axios';
import { getSøknadsperiode } from '../api/perioder';
import { getPersonligeForetak } from '../api/personlige-foretak';
import { getSoker } from '../api/soker';
import { SoknadEssentials } from '../types/SoknadEssentials';
import { isForbidden, isUnauthorized } from '../utils/apiUtils';

function useSoknadEssentials() {
    const [soknadEssentials, setSoknadEssentials] = useState<SoknadEssentials | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userIsLoggedIn, setUserIsLoggedIn] = useState<boolean | undefined>(undefined);
    const [error, setError] = useState<AxiosError | undefined>();

    const fetch = async () => {
        setSoknadEssentials(undefined);
        setError(undefined);
        setIsLoading(true);
        try {
            const person = await getSoker();
            const currentSøknadsperiode = await getSøknadsperiode();
            const personligeForetak = await getPersonligeForetak();
            setSoknadEssentials({
                person,
                currentSøknadsperiode,
                personligeForetak: personligeForetak.foretak.length > 0 ? personligeForetak : undefined,
            });
            setUserIsLoggedIn(true);
        } catch (error) {
            if (isForbidden(error) || isUnauthorized(error)) {
                setUserIsLoggedIn(false);
            }
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { soknadEssentials, userIsLoggedIn, isLoading, error, fetch };
}

export default useSoknadEssentials;

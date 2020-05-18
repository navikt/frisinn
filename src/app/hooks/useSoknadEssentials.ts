import { useState } from 'react';
import { AxiosError } from 'axios';
import { getSøknadsperiode } from '../api/perioder';
import { getPersonligeForetak } from '../api/personlige-foretak';
import { getSoker } from '../api/soker';
import { SoknadEssentials } from '../types/SoknadEssentials';
import { isForbidden, isUnauthorized } from '../utils/apiUtils';
import { getPeriodeForAvsluttaSelskaper } from '../soknad/selvstendig-step/avsluttet-selskap/avsluttetSelskapUtils';

function useSoknadEssentials() {
    const [soknadEssentials, setSoknadEssentials] = useState<SoknadEssentials | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | undefined>();
    const [isRedirectingToLogin, setIsRedirectingToLogin] = useState<boolean | undefined>();

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
                avsluttetSelskapDateRange: personligeForetak
                    ? getPeriodeForAvsluttaSelskaper(personligeForetak.tidligsteRegistreringsdato)
                    : undefined,
            });
        } catch (error) {
            if (isForbidden(error) || isUnauthorized(error)) {
                setIsRedirectingToLogin(true);
            } else {
                setError(error || new Error('SoknadEssentials load failed'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { soknadEssentials, isRedirectingToLogin, isLoading, error, fetch };
}

export default useSoknadEssentials;

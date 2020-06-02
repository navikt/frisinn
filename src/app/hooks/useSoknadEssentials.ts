import { useState } from 'react';
import { AxiosError } from 'axios';
import { getSøknadsperiode } from '../api/perioder';
import { getPersonligeForetak } from '../api/personlige-foretak';
import { getSoker } from '../api/soker';
import { getPeriodeForAvsluttaSelskaper } from '../soknad/selvstendig-step/avsluttet-selskap/avsluttetSelskapUtils';
import { SoknadEssentials } from '../types/SoknadEssentials';
import { isForbidden, isUnauthorized } from '../utils/apiUtils';
import { getHarSoktTidligerePeriode } from '../api/har-sokt-tidligere-periode';
import { isSelvstendigNæringsdrivende } from '../utils/selvstendigUtils';
import { getSøknadsperiodeinfo } from '../utils/søknadsperiodeUtils';

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
            const søknadsperiode = await getSøknadsperiode();
            const tidligerePerioder = await getHarSoktTidligerePeriode(søknadsperiode);
            const personligeForetak = await getPersonligeForetak(
                tidligerePerioder.harSøktSomSelvstendigNæringsdrivende
            );

            setSoknadEssentials({
                person,
                søknadsperiode,
                søknadsperiodeinfo: getSøknadsperiodeinfo(søknadsperiode),
                personligeForetak: personligeForetak,
                avsluttetSelskapDateRange: personligeForetak
                    ? getPeriodeForAvsluttaSelskaper(personligeForetak.tidligsteRegistreringsdato)
                    : undefined,
                tidligerePerioder,
                isSelvstendigNæringsdrivende: isSelvstendigNæringsdrivende(personligeForetak, tidligerePerioder),
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

    return {
        soknadEssentials,
        isRedirectingToLogin,
        isLoading,
        error,
        fetch,
    };
}

export default useSoknadEssentials;

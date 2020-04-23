import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { getSøknadsperiode } from '../api/perioder';
import { getPersonligeForetak } from '../api/personlige-foretak';
import { getSoker } from '../api/soker';
import { SoknadEssentials } from '../types/SoknadEssentials';

function useSoknadEssentials() {
    const [soknadEssentials, setSoknadEssentials] = useState<SoknadEssentials | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>();

    const fetchData = async () => {
        setError(undefined);
        try {
            setIsLoading(true);
            const person = await getSoker();
            const currentSøknadsperiode = await getSøknadsperiode();
            const personligeForetak = await getPersonligeForetak();
            setSoknadEssentials({
                person,
                currentSøknadsperiode,
                personligeForetak: personligeForetak.foretak.length > 0 ? personligeForetak : undefined,
            });
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { soknadEssentials, isLoading, error };
}

export default useSoknadEssentials;

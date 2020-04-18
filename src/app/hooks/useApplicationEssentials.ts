import { useState, useEffect } from 'react';
import { ApplicationEssentials } from '../types/ApplicationEssentials';
import { AxiosError } from 'axios';
import { getSoker } from '../api/soker';
import { getSøknadsperiode } from '../api/perioder';
import { getPersonligeForetak } from '../api/personlige-foretak';

function useApplicationEssentials() {
    const [applicationEssentials, setApplicationEssentials] = useState<ApplicationEssentials | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>();

    const fetchData = async () => {
        setError(undefined);
        try {
            setIsLoading(true);
            const person = await getSoker();
            const currentSøknadsperiode = await getSøknadsperiode();
            const personligeForetak = await getPersonligeForetak();
            setApplicationEssentials({
                person,
                currentSøknadsperiode,
                personligeForetak,
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

    return { applicationEssentials, isLoading, error };
}

export default useApplicationEssentials;

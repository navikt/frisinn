import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { getSøknadsperiode } from '../api/perioder';
import { DateRange } from '../utils/dateUtils';

function useCurrentPeriode() {
    const [currentPeriode, setCurrentPeriode] = useState<DateRange | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>();

    const fetchData = async () => {
        setError(undefined);
        try {
            setIsLoading(true);
            const currentSøknadsperiode = await getSøknadsperiode();
            setCurrentPeriode(currentSøknadsperiode);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { currentPeriode, isLoading, error };
}

export default useCurrentPeriode;

import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { getSøknadsperiode } from '../api/perioder';
import { DateRange } from '../utils/dateUtils';

function useSoknadsperiode() {
    const [soknadsperiode, setCurrentPeriode] = useState<DateRange | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>();

    const fetch = async () => {
        setError(undefined);
        setIsLoading(true);
        try {
            const periode = await getSøknadsperiode();
            setCurrentPeriode(periode);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    return { soknadsperiode, isLoading, error };
}

export default useSoknadsperiode;

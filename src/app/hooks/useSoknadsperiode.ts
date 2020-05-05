import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { getSøknadsperiode } from '../api/perioder';
import { DateRange } from '../utils/dateUtils';

function useSoknadsperiode(runImmediately = true) {
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
        if (runImmediately) {
            fetch();
        } else {
            setIsLoading(false);
        }
    }, [runImmediately]);

    const triggerFetch = () => {
        fetch();
    };

    return { soknadsperiode, triggerFetch, isLoading, error };
}

export default useSoknadsperiode;

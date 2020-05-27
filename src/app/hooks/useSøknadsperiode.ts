import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { getSøknadsperiode } from '../api/perioder';
import { DateRange } from '../utils/dateUtils';

function useSøknadsperiode(runImmediately = true) {
    const [søknadsperiode, setSøknadsperiode] = useState<DateRange | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>();

    const fetch = async () => {
        setError(undefined);
        setIsLoading(true);
        try {
            const periode = await getSøknadsperiode();
            setSøknadsperiode(periode);
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

    return { søknadsperiode, triggerFetch, isLoading, error };
}

export default useSøknadsperiode;

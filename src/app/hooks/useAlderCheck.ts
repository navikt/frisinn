import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { sjekkKrav, KravApiResponse } from '../api/krav';
import { ApiKrav } from '../types/Krav';

function useAlderCheck() {
    const [result, setResult] = useState<KravApiResponse | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | undefined>();

    async function checkAlder() {
        setIsLoading(true);
        try {
            const result = await sjekkKrav(ApiKrav.alder);
            setResult(result.data);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        checkAlder();
    }, []);

    return { result, isLoading, error };
}

export default useAlderCheck;

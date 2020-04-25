import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import api, { ApiEndpoint } from '../api/api';

function useTilgjengelig() {
    const [isTilgjengelig, setIsTilgjengelig] = useState<boolean | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | undefined>();

    async function checkTilgjengelig() {
        setIsLoading(true);
        try {
            await api.get<any>(ApiEndpoint.tilgjengelig);
            setIsTilgjengelig(true);
        } catch (error) {
            setError(error);
            // .error?.response?.status === 503
            setIsTilgjengelig(false);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        checkTilgjengelig();
    }, []);

    return { isTilgjengelig, isLoading, error };
}

export default useTilgjengelig;
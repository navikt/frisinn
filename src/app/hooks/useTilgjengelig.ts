import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import api, { ApiEndpoint } from '../api/api';

function useTilgjengelig() {
    const [isTilgjengelig, setIsTilgjengelig] = useState<boolean | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | Error | undefined>();

    async function checkTilgjengelig() {
        setIsLoading(true);
        try {
            await api.get<any>(ApiEndpoint.tilgjengelig);
            setIsTilgjengelig(true);
        } catch (error) {
            setError(error);
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

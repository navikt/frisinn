import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import api, { ApiEndpoint } from '../api/api';

function useTilgjengelig(isIntroPage = false) {
    const [counter, setCounter] = useState<number>(0);
    const [isTilgjengelig, setIsTilgjengelig] = useState<boolean | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | Error | undefined>();

    async function checkTilgjengelig() {
        setIsLoading(true);
        setCounter(counter + 1);
        if (isIntroPage && counter > 10) {
            const error = new Error('Tilgjengelig called 10 times');
            setError(error);
            throw error;
        }
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

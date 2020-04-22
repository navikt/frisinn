import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import api, { ApiEndpoint } from '../api/api';

function useApiGet<ApiResponseFormat>(endpoint: ApiEndpoint, paramString?: string) {
    const [result, setResult] = useState<ApiResponseFormat | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>();

    const get = async () => {
        setError(undefined);
        try {
            setIsLoading(true);
            const response = await api.get<ApiResponseFormat>(endpoint, paramString);
            setResult(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        get();
    }, []);

    return { result, isLoading, error };
}

export default useApiGet;

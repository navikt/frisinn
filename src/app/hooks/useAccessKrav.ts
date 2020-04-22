import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { AccessCheckResult, AccessCheck } from '../types/AccessCheck';

function useAccessCheck(accessCheck: AccessCheck) {
    const [result, setAccessCheckResult] = useState<AccessCheckResult | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>();

    const fetchData = async () => {
        setError(undefined);
        try {
            setIsLoading(true);
            const checkResult = await accessCheck.check();
            setAccessCheckResult(checkResult);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { result, isLoading, error };
}

export default useAccessCheck;

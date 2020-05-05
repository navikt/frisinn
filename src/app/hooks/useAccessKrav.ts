import { useState } from 'react';
import { AxiosError } from 'axios';
import { AccessCheckResult, AccessCheck } from '../types/AccessCheck';

function useAccessCheck(accessCheck: AccessCheck) {
    const [result, setAccessCheckResult] = useState<AccessCheckResult | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | undefined>();

    const check = async () => {
        setError(undefined);
        try {
            setIsLoading(true);
            const checkResult = await accessCheck.check();
            if (checkResult.error) {
                setError(checkResult.error);
            }
            setAccessCheckResult(checkResult);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { result, isLoading, error, check };
}

export default useAccessCheck;

import { useEffect, useState } from 'react';
import applicationTempStorage, { TemporaryStorageData } from '../application/ApplicationTempStorage';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';

function useTemporaryStorage() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [storageData, setStorageData] = useState<TemporaryStorageData | undefined>();

    async function fetchStorage() {
        setIsLoading(true);
        try {
            const storageData = await applicationTempStorage.rehydrate();
            setStorageData(storageData ? applicationTempStorage.getValidStorage(storageData.data) : undefined);
        } catch (error) {
            setStorageData(undefined);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            fetchStorage();
        } else {
            setIsLoading(false);
        }
    }, []);

    async function purge() {
        setIsLoading(true);
        try {
            await applicationTempStorage.purge();
        } finally {
            setStorageData(undefined);
            setIsLoading(false);
        }
    }

    return { storageData, isLoading, purge };
}

export default useTemporaryStorage;
import { useState } from 'react';
import soknadTempStorage, { TemporaryStorageData } from '../soknad/SoknadTempStorage';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';

function useTemporaryStorage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [storageData, setStorageData] = useState<TemporaryStorageData | undefined>();

    async function fetchStorage() {
        setIsLoading(true);
        try {
            const storageData = await soknadTempStorage.fetch();
            setStorageData(storageData ? storageData.data : undefined);
        } catch (error) {
            setStorageData(undefined);
        } finally {
            setIsLoading(false);
        }
    }

    const fetch = () => {
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            fetchStorage();
        } else {
            setIsLoading(false);
        }
    };

    async function purge() {
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            setIsLoading(true);
            try {
                await soknadTempStorage.purge();
            } finally {
                setStorageData(undefined);
                setIsLoading(false);
            }
        }
    }

    return { storageData, isLoading, purge, fetch };
}

export default useTemporaryStorage;

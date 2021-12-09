import { AxiosResponse } from 'axios';
import * as hash from 'object-hash';
import { ApiEndpoint } from '../api/api';
import { axiosJsonConfig } from '../config/axiosConfig';
import { SoknadEssentials } from '../types/SoknadEssentials';
import { SoknadFormData } from '../types/SoknadFormData';
import persistence, { PersistenceInterface } from '../utils/persistence/persistence';
import { StepID } from './stepConfig';

export interface TemporaryStorageData {
    metadata: {
        lastStepID: StepID;
        version: string;
        userHash: string;
    };
    formData: SoknadFormData;
}

export const STORAGE_VERSION = '3';

interface SoknadTemporartStorage extends Omit<PersistenceInterface<TemporaryStorageData>, 'persist'> {
    persist: (formData: SoknadFormData, lastStepID: StepID, essentials: SoknadEssentials) => Promise<AxiosResponse>;
}

const persistSetup = persistence<TemporaryStorageData>({
    url: ApiEndpoint.mellomlagring,
    requestConfig: { ...axiosJsonConfig },
});

export const isStorageDataValid = (
    data: TemporaryStorageData,
    essentials: SoknadEssentials
): TemporaryStorageData | undefined => {
    if (data?.metadata?.version === STORAGE_VERSION && hash(essentials) === data.metadata.userHash) {
        return data;
    }
    return undefined;
};

const soknadTempStorage: SoknadTemporartStorage = {
    persist: (formData: SoknadFormData, lastStepID: StepID, essentials: SoknadEssentials) => {
        return persistSetup.persist({
            formData,
            metadata: { lastStepID, version: STORAGE_VERSION, userHash: hash(essentials) },
        });
    },
    purge: persistSetup.purge,
    fetch: persistSetup.fetch,
};

export default soknadTempStorage;

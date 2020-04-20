import persistence, { PersistenceInterface } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import { AxiosResponse } from 'axios';
import { ApiEndpoint } from '../api/api';
import axiosConfig from '../config/axiosConfig';
import { ApplicationFormData } from '../types/ApplicationFormData';
import { StepID } from './stepConfig';

export interface TemporaryStorageData {
    metadata: {
        lastStepID: StepID;
        version: string;
    };
    formData: ApplicationFormData;
}

export const STORAGE_VERSION = '1';

interface ApplicationTemporartStorage extends Omit<PersistenceInterface<TemporaryStorageData>, 'persist'> {
    persist: (formData: ApplicationFormData, lastStepID: StepID) => Promise<AxiosResponse>;
    getValidStorage: (storage?: TemporaryStorageData) => TemporaryStorageData | undefined;
}

const persistSetup = persistence<TemporaryStorageData>({
    url: ApiEndpoint.mellomlagring,
    requestConfig: { ...axiosConfig },
});

export const getValidTemporaryStorage = (data?: TemporaryStorageData): TemporaryStorageData | undefined => {
    if (data?.metadata?.version === STORAGE_VERSION) {
        return data;
    }
    return undefined;
};

const applicationTempStorage: ApplicationTemporartStorage = {
    persist: (formData: ApplicationFormData, lastStepID: StepID) => {
        return persistSetup.persist({ formData, metadata: { lastStepID, version: STORAGE_VERSION } });
    },
    purge: persistSetup.purge,
    rehydrate: persistSetup.rehydrate,
    getValidStorage: getValidTemporaryStorage,
};

export default applicationTempStorage;

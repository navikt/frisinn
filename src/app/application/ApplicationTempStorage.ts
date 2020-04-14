import persistence, { PersistenceInterface } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import { AxiosResponse } from 'axios';
import axiosConfig from '../config/axiosConfig';
import { StepID } from './stepConfig';
import { ApplicationFormData } from '../types/ApplicationFormData';
import { ApiEndpoint } from '../api/api';
import { ApplicantProfile } from '../types/ApplicantProfile';

export interface TemporaryStorageData {
    metadata: {
        lastStepID: StepID;
        version: string;
        applicantProfile: ApplicantProfile;
    };
    formData: ApplicationFormData;
}

export const STORAGE_VERSION = '1';

interface ApplicationTemporartStorage extends Omit<PersistenceInterface<TemporaryStorageData>, 'persist'> {
    persist: (
        formData: ApplicationFormData,
        lastStepID: StepID,
        applicantProfile: ApplicantProfile
    ) => Promise<AxiosResponse>;
    getValidStorage: (storage: TemporaryStorageData) => TemporaryStorageData | undefined;
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
    persist: (formData: ApplicationFormData, lastStepID: StepID, applicantProfile: ApplicantProfile) => {
        return persistSetup.persist({ formData, metadata: { lastStepID, version: STORAGE_VERSION, applicantProfile } });
    },
    purge: persistSetup.purge,
    rehydrate: persistSetup.rehydrate,
    getValidStorage: getValidTemporaryStorage,
};

export default applicationTempStorage;

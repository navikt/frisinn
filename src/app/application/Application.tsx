import React, { useEffect, useState } from 'react';
import { getEnkeltpersonforetak } from '../api/enkeltpersonforetak';
import { getPerioder } from '../api/perioder';
import { getSoker } from '../api/soker';
import LoadWrapper from '../components/load-wrapper/LoadWrapper';
import { ApplicationContext } from '../context/ApplicationContext';
import { ApplicantProfile } from '../types/ApplicantProfile';
import { initialApplicationValues, ApplicationFormData } from '../types/ApplicationFormData';
import { navigateToApplication } from '../utils/navigationUtils';
import ApplicationFormComponents from './ApplicationFormComponents';
import ApplicationRoutes from './ApplicationRoutes';
import { ApplicationEssentials } from '../types/ApplicationEssentials';
import applicationTempStorage from './ApplicationTempStorage';

interface LoadState {
    isLoading: boolean;
    error?: boolean;
}

const Application = () => {
    const [loadState, setLoadState] = useState<LoadState>({ isLoading: true });
    const [applicationEssentials, setApplicationEssentials] = useState<ApplicationEssentials | undefined>();
    const [applicantProfile, setApplicantProfile] = useState<ApplicantProfile | undefined>();
    const [initialFormData, setInitialFormData] = useState<Partial<ApplicationFormData>>(initialApplicationValues);

    async function loadEssentials() {
        if (applicationEssentials === undefined && loadState.error === undefined) {
            try {
                const [person, søknadsperioder, enkeltpersonforetak, storageData] = await Promise.all([
                    getSoker(),
                    getPerioder(),
                    getEnkeltpersonforetak(),
                    applicationTempStorage.rehydrate(),
                ]);
                setApplicationEssentials({
                    person: person.data,
                    applicationDateRanges: søknadsperioder,
                    companies: enkeltpersonforetak,
                });
                const storage = applicationTempStorage.getValidStorage(storageData.data);
                if (storage) {
                    setInitialFormData(storage.formData);
                    setApplicantProfile(storage.metadata.applicantProfile);
                }
                setLoadState({ isLoading: false, error: false });
            } catch (response) {
                console.log('error');
                setLoadState({ isLoading: false, error: true });
            }
        }
    }

    useEffect(() => {
        loadEssentials();
    }, [applicationEssentials, loadState]);

    const resetApplication = () => {
        setApplicationEssentials(undefined);
        navigateToApplication();
    };

    const { isLoading, error } = loadState;
    return (
        <LoadWrapper
            isLoading={isLoading && error === undefined}
            contentRenderer={() => {
                if (applicationEssentials === undefined) {
                    return <div>Noe gikk galt under henting av din informasjon</div>;
                }
                return (
                    <ApplicationContext.Provider
                        value={{
                            applicationEssentials,
                            applicantProfile,
                            setApplicantProfile: (profile) => setApplicantProfile(profile),
                            resetApplication: () => resetApplication(),
                        }}>
                        <ApplicationFormComponents.FormikWrapper
                            initialValues={initialFormData}
                            onSubmit={() => null}
                            renderForm={() => {
                                return <ApplicationRoutes applicantProfile={applicantProfile} />;
                            }}
                        />
                    </ApplicationContext.Provider>
                );
            }}
        />
    );
};

export default Application;

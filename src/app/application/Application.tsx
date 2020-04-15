import React, { useEffect, useState } from 'react';
import { getEnkeltpersonforetak } from '../api/enkeltpersonforetak';
import { getPerioder } from '../api/perioder';
import { getSoker } from '../api/soker';
import LoadWrapper from '../components/load-wrapper/LoadWrapper';
import { ApplicationContext } from '../context/ApplicationContext';
import { initialApplicationValues, ApplicationFormData } from '../types/ApplicationFormData';
import { navigateToApplication } from '../utils/navigationUtils';
import ApplicationFormComponents from './ApplicationFormComponents';
import ApplicationRoutes from './ApplicationRoutes';
import { ApplicationEssentials } from '../types/ApplicationEssentials';
import applicationTempStorage from './ApplicationTempStorage';
import { isFeatureEnabled, Feature } from '../utils/featureToggleUtils';
import { userNeedsToLogin } from '../utils/apiUtils';

interface LoadState {
    isLoading: boolean;
    error?: boolean;
    redirectToLoginPage?: boolean;
}

const Application = () => {
    const [loadState, setLoadState] = useState<LoadState>({ isLoading: true });
    const [applicationEssentials, setApplicationEssentials] = useState<ApplicationEssentials | undefined>();
    const [initialFormData, setInitialFormData] = useState<Partial<ApplicationFormData>>(initialApplicationValues);

    async function loadEssentials() {
        if (applicationEssentials === undefined && loadState.error === undefined) {
            try {
                const person = await getSoker();
                const søknadsperioder = await getPerioder();
                const enkeltpersonforetak = await getEnkeltpersonforetak();
                let storageData;
                if (isFeatureEnabled(Feature.PERSISTENCE)) {
                    storageData = await applicationTempStorage.rehydrate();
                }
                setApplicationEssentials({
                    person: person.data,
                    applicationDateRanges: søknadsperioder,
                    companies: enkeltpersonforetak,
                });

                const storage = storageData ? applicationTempStorage.getValidStorage(storageData.data) : undefined;
                if (storage) {
                    setInitialFormData(storage.formData);
                }
                setLoadState({ isLoading: false, error: false });
            } catch (error) {
                setLoadState({ isLoading: false, error: true, redirectToLoginPage: userNeedsToLogin(error) });
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

    const { isLoading, redirectToLoginPage: notLoggedIn } = loadState;
    return (
        <LoadWrapper
            isLoading={isLoading === true || notLoggedIn === true}
            contentRenderer={() => {
                if (applicationEssentials === undefined) {
                    return <div>Noe gikk galt under henting av din informasjon</div>;
                }
                return (
                    <ApplicationContext.Provider
                        value={{
                            applicationEssentials,
                            resetApplication: () => resetApplication(),
                        }}>
                        <ApplicationFormComponents.FormikWrapper
                            initialValues={initialFormData}
                            onSubmit={() => null}
                            renderForm={() => {
                                return <ApplicationRoutes />;
                            }}
                        />
                    </ApplicationContext.Provider>
                );
            }}
        />
    );
};

export default Application;

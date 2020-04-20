import React from 'react';
import { useHistory } from 'react-router-dom';
import LoadWrapper from '../components/load-wrapper/LoadWrapper';
import useApplicationEssentials from '../hooks/useApplicationEssentials';
import useTemporaryStorage from '../hooks/useTempStorage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateToApplicationFrontpage } from '../utils/navigationUtils';
import ApplicationFormComponents from './ApplicationFormComponents';
import ApplicationRoutes from './ApplicationRoutes';
import applicationTempStorage from './ApplicationTempStorage';

const Application = () => {
    const essentials = useApplicationEssentials();
    const tempStorage = useTemporaryStorage();
    const { applicationEssentials } = essentials;
    const isLoading = essentials.isLoading || tempStorage.isLoading;
    const initialValues = applicationTempStorage.getValidStorage(tempStorage.storageData)?.formData || {};
    const history = useHistory();

    async function resetApplication() {
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            await tempStorage.purge();
        }
        navigateToApplicationFrontpage(history);
    }

    return (
        <LoadWrapper
            isLoading={isLoading}
            contentRenderer={() => {
                if (applicationEssentials === undefined) {
                    return <GeneralErrorPage />;
                }
                return (
                    <ApplicationFormComponents.FormikWrapper
                        initialValues={initialValues}
                        onSubmit={() => null}
                        renderForm={() => {
                            return (
                                <ApplicationRoutes
                                    applicationEssentials={applicationEssentials}
                                    resetApplication={resetApplication}
                                />
                            );
                        }}
                    />
                );
            }}
        />
    );
};

export default Application;

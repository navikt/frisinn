import React from 'react';
import LoadWrapper from '../components/load-wrapper/LoadWrapper';
import { navigateToApplicationFrontpage } from '../utils/navigationUtils';
import ApplicationFormComponents from './ApplicationFormComponents';
import ApplicationRoutes from './ApplicationRoutes';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import useApplicationEssentials from '../hooks/useApplicationEssentials';
import useTemporaryStorage from '../hooks/useTempStorage';
import applicationTempStorage from './ApplicationTempStorage';
import { useHistory } from 'react-router-dom';

const Application = () => {
    const essentials = useApplicationEssentials();
    const tempStorage = useTemporaryStorage();
    const { applicationEssentials } = essentials;
    const isLoading = essentials.isLoading || tempStorage.isLoading;
    const initialValues = applicationTempStorage.getValidStorage(tempStorage.storageData)?.formData || {};
    const history = useHistory();

    async function resetApplication() {
        await tempStorage.purge();
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

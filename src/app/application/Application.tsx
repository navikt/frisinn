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
import { maksEnSoknadPerPeriodeAccessCheck } from '../utils/apiAccessCheck';
import useAccessCheck from '../hooks/useAccessKrav';
import NoAccessPage from '../pages/no-access-page/NoAccessPage';
import useApiGet from '../hooks/useApiGet';
import { ApiEndpoint } from '../api/api';
import { Ingress } from 'nav-frontend-typografi';

const Application = () => {
    const essentials = useApplicationEssentials();
    const maksEnSoknadPerPeriodeCheck = useAccessCheck(maksEnSoknadPerPeriodeAccessCheck());
    const erTilgjengelig = useApiGet(ApiEndpoint.tilgjengelig);
    const tempStorage = useTemporaryStorage();
    const { applicationEssentials } = essentials;
    const initialValues = applicationTempStorage.getValidStorage(tempStorage.storageData)?.formData || {};
    const history = useHistory();

    async function resetApplication() {
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            await tempStorage.purge();
        }
        navigateToApplicationFrontpage(history);
    }

    const isLoading =
        essentials.isLoading ||
        tempStorage.isLoading ||
        maksEnSoknadPerPeriodeCheck.isLoading ||
        erTilgjengelig.isLoading;

    return (
        <LoadWrapper
            isLoading={isLoading}
            contentRenderer={() => {
                if (erTilgjengelig.error?.response?.status === 503) {
                    return (
                        <NoAccessPage title="Søknaden er ikke tilgjengelig">
                            <Ingress>
                                Søknaden er dessverre ikke tilgjengelig akkurat nå. Vennligst prøv igjen på et senere
                                tidspunkt.
                            </Ingress>
                        </NoAccessPage>
                    );
                }
                if (applicationEssentials === undefined) {
                    return <GeneralErrorPage />;
                }
                if (maksEnSoknadPerPeriodeCheck.result?.passes === false) {
                    return (
                        <NoAccessPage title="Du kan ikke sende inn søknad">
                            {maksEnSoknadPerPeriodeCheck.result.info}
                        </NoAccessPage>
                    );
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

import React from 'react';
import { useHistory } from 'react-router-dom';
import LoadWrapper from '../components/load-wrapper/LoadWrapper';
import useSoknadEssentials from '../hooks/useSoknadEssentials';
import useTemporaryStorage from '../hooks/useTempStorage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateToSoknadFrontpage } from '../utils/navigationUtils';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';
import soknadTempStorage from './SoknadTempStorage';
import { maksEnSoknadPerPeriodeAccessCheck } from '../utils/apiAccessCheck';
import useAccessCheck from '../hooks/useAccessKrav';
import NoAccessPage from '../pages/no-access-page/NoAccessPage';
import useApiGet from '../hooks/useApiGet';
import { ApiEndpoint } from '../api/api';
import { Ingress } from 'nav-frontend-typografi';

export type ResetSoknadFunction = (redirectToFrontpage: boolean) => void;

const Soknad = () => {
    const essentials = useSoknadEssentials();
    const maksEnSoknadPerPeriodeCheck = useAccessCheck(maksEnSoknadPerPeriodeAccessCheck());
    const erTilgjengelig = useApiGet(ApiEndpoint.tilgjengelig);
    const tempStorage = useTemporaryStorage();
    const { soknadEssentials } = essentials;
    const initialValues = isFeatureEnabled(Feature.PERSISTENCE)
        ? soknadTempStorage.getValidStorage(tempStorage.storageData)?.formData || {}
        : {};
    const history = useHistory();

    async function resetSoknad(redirectToFrontpage = true) {
        if (tempStorage && tempStorage.storageData?.formData) {
            if (isFeatureEnabled(Feature.PERSISTENCE)) {
                await tempStorage.purge();
            }
        }
        if (redirectToFrontpage) {
            navigateToSoknadFrontpage(history);
        }
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
                if (soknadEssentials === undefined) {
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
                    <SoknadFormComponents.FormikWrapper
                        initialValues={initialValues}
                        onSubmit={() => null}
                        renderForm={() => {
                            return <SoknadRoutes soknadEssentials={soknadEssentials} resetSoknad={resetSoknad} />;
                        }}
                    />
                );
            }}
        />
    );
};

export default Soknad;

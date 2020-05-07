import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Ingress } from 'nav-frontend-typografi';
import LoadWrapper from '../components/load-wrapper/LoadWrapper';
import useAccessCheck from '../hooks/useAccessKrav';
import { usePrevious } from '../hooks/usePrevious';
import useSoknadEssentials from '../hooks/useSoknadEssentials';
import useTemporaryStorage from '../hooks/useTempStorage';
import useTilgjengelig from '../hooks/useTilgjengelig';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import NoAccessPage from '../pages/no-access-page/NoAccessPage';
import NotOpenPage from '../pages/not-open-page/NotOpenPage';
import SoknadErrorPage from '../pages/soknad-error-page/SoknadErrorPage';
import { alderAccessCheck, maksEnSoknadPerPeriodeAccessCheck } from '../utils/apiAccessCheck';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateTo, navigateToSoknadFrontpage } from '../utils/navigationUtils';
import { getSoknadRoute } from '../utils/routeUtils';
import SoknadErrors from './soknad-errors/SoknadErrors';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';

export type ResetSoknadFunction = (redirectToFrontpage: boolean) => void;

const Soknad = () => {
    const [initializing, setInitializing] = useState<boolean>(true);
    const tilgjengelig = useTilgjengelig();
    const essentials = useSoknadEssentials();
    const maksEnSoknadPerPeriodeCheck = useAccessCheck(maksEnSoknadPerPeriodeAccessCheck());
    const alderCheck = useAccessCheck(alderAccessCheck());
    const tempStorage = useTemporaryStorage();
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
    const { soknadEssentials, isLoading: essentialsIsLoading } = essentials;
    const { isLoading: tilgjengeligIsLoading, isTilgjengelig } = tilgjengelig;
    const prevTilgjengelig = usePrevious<boolean | undefined>(isTilgjengelig);
    const isLoading =
        initializing ||
        alderCheck.isLoading ||
        tempStorage.isLoading ||
        maksEnSoknadPerPeriodeCheck.isLoading ||
        tilgjengeligIsLoading;

    const initializingDone = (): void => {
        const { storageData } = tempStorage;
        if (storageData) {
            const currentRoute = history.location.pathname;
            const lastStepRoute = getSoknadRoute(storageData.metadata.lastStepID);
            if (currentRoute !== lastStepRoute) {
                navigateTo(lastStepRoute, history);
            }
        }
        setInitializing(false);
    };

    useEffect(() => {
        if (isTilgjengelig !== prevTilgjengelig && isTilgjengelig !== undefined) {
            if (isTilgjengelig === true) {
                essentials.fetch();
                tempStorage.fetch();
                alderCheck.check();
                maksEnSoknadPerPeriodeCheck.check();
            } else {
                initializingDone();
            }
        }
    }, [{ isTilgjengelig }]);

    useEffect(() => {
        if (essentials.isRedirectingToLogin) {
            return;
        }
        if (isTilgjengelig === true && essentials.isLoading === false) {
            initializingDone();
        }
    }, [essentialsIsLoading]);

    const hasError =
        essentials.error !== undefined ||
        alderCheck.error !== undefined ||
        maksEnSoknadPerPeriodeCheck.error !== undefined;

    return (
        <LoadWrapper
            isLoading={isLoading || essentials.isRedirectingToLogin === true}
            contentRenderer={() => {
                if (tilgjengelig.isTilgjengelig === false) {
                    return <NotOpenPage />;
                }
                if (hasError) {
                    return (
                        <SoknadErrorPage pageTitle="Det oppstod en feil under visning av siden">
                            <SoknadErrors.GeneralSoknadFrontpageError />
                        </SoknadErrorPage>
                    );
                }
                if (alderCheck.result?.passes === false) {
                    return (
                        <NoAccessPage title="Du kan ikke bruke denne søknaden">
                            <Ingress>{alderCheck.result.info}</Ingress>
                        </NoAccessPage>
                    );
                }
                if (maksEnSoknadPerPeriodeCheck.result?.passes === false) {
                    return (
                        <NoAccessPage title="Du kan ikke sende inn søknad">
                            {maksEnSoknadPerPeriodeCheck.result.info}
                        </NoAccessPage>
                    );
                }
                if (soknadEssentials) {
                    return (
                        <SoknadFormComponents.FormikWrapper
                            initialValues={tempStorage.storageData?.formData || {}}
                            onSubmit={() => null}
                            renderForm={(formik) => {
                                return (
                                    <SoknadRoutes
                                        soknadEssentials={soknadEssentials}
                                        resetSoknad={() => {
                                            formik.resetForm();
                                            resetSoknad();
                                        }}
                                    />
                                );
                            }}
                        />
                    );
                }
                return <GeneralErrorPage />;
            }}
        />
    );
};

export default Soknad;

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import LoadWrapper from '../components/load-wrapper/LoadWrapper';
import useSoknadEssentials from '../hooks/useSoknadEssentials';
import useTemporaryStorage from '../hooks/useTempStorage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateToSoknadFrontpage } from '../utils/navigationUtils';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';
import { maksEnSoknadPerPeriodeAccessCheck, alderAccessCheck } from '../utils/apiAccessCheck';
import useAccessCheck from '../hooks/useAccessKrav';
import NoAccessPage from '../pages/no-access-page/NoAccessPage';
import { Ingress } from 'nav-frontend-typografi';
import useTilgjengelig from '../hooks/useTilgjengelig';
import { usePrevious } from '../hooks/usePrevious';

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

    useEffect(() => {
        if (isTilgjengelig !== prevTilgjengelig && isTilgjengelig !== undefined) {
            essentials.fetch();
            tempStorage.fetch();
            alderCheck.check();
            maksEnSoknadPerPeriodeCheck.check();
        }
    }, [{ isTilgjengelig }]);

    useEffect(() => {
        if (
            essentials.isLoading === false &&
            (essentials.userIsLoggedIn === true || (essentials.userIsLoggedIn === undefined && essentials.error))
        ) {
            setInitializing(false);
        }
    }, [essentialsIsLoading]);
    return (
        <LoadWrapper
            isLoading={isLoading}
            contentRenderer={() => {
                if (tilgjengelig.isTilgjengelig === false) {
                    return (
                        <NoAccessPage title="Søknaden er ikke tilgjengelig">
                            <Ingress>
                                Søknaden er dessverre ikke tilgjengelig akkurat nå. Vennligst prøv igjen på et senere
                                tidspunkt.
                            </Ingress>
                        </NoAccessPage>
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

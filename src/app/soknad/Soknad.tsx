import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Ingress } from 'nav-frontend-typografi';
import LoadWrapper from '../components/load-wrapper/LoadWrapper';
import useAccessCheck from '../hooks/useAccessKrav';
import useSoknadEssentials from '../hooks/useSoknadEssentials';
import useTemporaryStorage from '../hooks/useTempStorage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import NoAccessPage from '../pages/no-access-page/NoAccessPage';
import SoknadErrorPage from '../pages/soknad-error-page/SoknadErrorPage';
import { SoknadFormData } from '../types/SoknadFormData';
import { alderAccessCheck, maksEnSoknadPerPeriodeAccessCheck } from '../utils/apiAccessCheck';
import { navigateTo, navigateToSoknadFrontpage, relocateToSoknad, isOnSoknadFrontpage } from '../utils/navigationUtils';
import { getSoknadRoute } from '../utils/routeUtils';
import SoknadErrors from './soknad-errors/SoknadErrors';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';
import { isStorageDataValid } from './SoknadTempStorage';
import useOsloTime from '../hooks/useOsloTime';
import routeConfig, { getRouteUrl } from '../config/routeConfig';
import { usePrevious } from '../hooks/usePrevious';

export type ResetSoknadFunction = (redirectToFrontpage: boolean) => void;

const Soknad = () => {
    const [initializing, setInitializing] = useState<boolean>(true);
    const [initialFormValues, setInitialFormValues] = useState<Partial<SoknadFormData>>({});

    const osloTime = useOsloTime();
    const { timestamp: osloTimestamp, isLoading: osloTimeIsLoading } = osloTime;
    const essentials = useSoknadEssentials();
    const maksEnSoknadPerPeriodeCheck = useAccessCheck(maksEnSoknadPerPeriodeAccessCheck());
    const alderCheck = useAccessCheck(alderAccessCheck());
    const tempStorage = useTemporaryStorage();
    const history = useHistory();

    const { isLoading: tempStorageIsLoading } = tempStorage;
    const { result: maksEnSøknadResult } = maksEnSoknadPerPeriodeCheck;
    const { result: alderResult } = alderCheck;

    async function resetSoknad(redirectToFrontpage = true) {
        await tempStorage.purge();
        if (redirectToFrontpage) {
            if (location.pathname !== getRouteUrl(routeConfig.SOKNAD)) {
                relocateToSoknad();
            }
        }
    }
    const { soknadEssentials } = essentials;

    const hasError = // ignore tempStorage error
        essentials.error !== undefined ||
        alderCheck.error !== undefined ||
        maksEnSoknadPerPeriodeCheck.error !== undefined;

    const resetInitialFormValues = () => {
        setInitialFormValues({
            startetSøknadTidspunkt: osloTimestamp,
        });
    };

    const allDataLoaded = (): void => {
        const { storageData } = tempStorage;
        if (storageData && soknadEssentials) {
            if (isStorageDataValid(storageData, soknadEssentials)) {
                setInitialFormValues(storageData.formData);
                const currentRoute = history.location.pathname;
                const lastStepRoute = getSoknadRoute(storageData.metadata.lastStepID);
                if (currentRoute !== lastStepRoute) {
                    navigateTo(lastStepRoute, history);
                }
            } else {
                resetInitialFormValues();
                if (isOnSoknadFrontpage(location) === false) {
                    console.log('navigate');
                    navigateToSoknadFrontpage(history);
                }
            }
        } else {
            resetInitialFormValues();
        }
        setInitializing(false);
    };

    useEffect(() => {
        if (
            initializing === true &&
            !hasError &&
            soknadEssentials &&
            osloTimestamp &&
            osloTimeIsLoading === false &&
            tempStorageIsLoading === false &&
            alderResult !== undefined &&
            maksEnSøknadResult !== undefined
        ) {
            allDataLoaded();
        }
    }, [tempStorageIsLoading, alderResult, maksEnSøknadResult, soknadEssentials, osloTimeIsLoading, osloTimestamp]);

    const prevOsloTimestamp = usePrevious(osloTimestamp);
    useEffect(() => {
        if (
            (osloTimestamp && prevOsloTimestamp === undefined) ||
            (prevOsloTimestamp && osloTimestamp && prevOsloTimestamp.toDateString() !== osloTimestamp.toDateString())
        ) {
            essentials.fetch();
            tempStorage.fetch();
            alderCheck.check(osloTimestamp);
            maksEnSoknadPerPeriodeCheck.check(osloTimestamp);
        }
    }, [osloTimestamp]);

    useEffect(() => {
        osloTime.triggerFetch();
    }, []);

    useEffect(() => {
        if (hasError === true) {
            setInitializing(false);
        }
    }, [hasError]);

    return (
        <LoadWrapper
            isLoading={initializing || essentials.isRedirectingToLogin === true}
            contentRenderer={() => {
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
                            initialValues={initialFormValues}
                            onSubmit={() => null}
                            renderForm={() => {
                                return (
                                    <SoknadRoutes
                                        soknadEssentials={soknadEssentials}
                                        resetSoknad={() => {
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

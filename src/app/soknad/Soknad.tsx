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
import { navigateTo, navigateToSoknadFrontpage } from '../utils/navigationUtils';
import { getSoknadRoute } from '../utils/routeUtils';
import SoknadErrors from './soknad-errors/SoknadErrors';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';
import { isStorageDataValid } from './SoknadTempStorage';

export type ResetSoknadFunction = (redirectToFrontpage: boolean) => void;

const Soknad = () => {
    const [initializing, setInitializing] = useState<boolean>(true);
    const [initialFormValues, setInitialFormValues] = useState<Partial<SoknadFormData>>({});

    const essentials = useSoknadEssentials();
    const maksEnSoknadPerPeriodeCheck = useAccessCheck(
        maksEnSoknadPerPeriodeAccessCheck(essentials.startetSøknadTidspunkt)
    );
    const alderCheck = useAccessCheck(alderAccessCheck(essentials.startetSøknadTidspunkt));
    const tempStorage = useTemporaryStorage();
    const history = useHistory();

    const { isLoading: tempStorageIsLoading } = tempStorage;
    const { result: maksEnSøknadResult } = maksEnSoknadPerPeriodeCheck;
    const { result: alderResult } = alderCheck;

    const getResettedInitialValues = (): Partial<SoknadFormData> => ({
        startetSøknadTidspunkt: essentials.startetSøknadTidspunkt,
    });

    async function resetSoknad(redirectToFrontpage = true) {
        if (tempStorage && tempStorage.storageData?.formData) {
            await tempStorage.purge();
        }
        if (redirectToFrontpage) {
            console.log(essentials.startetSøknadTidspunkt);
            essentials.resetStartetSøknadTidspunkt();
            console.log(essentials.startetSøknadTidspunkt);
            setInitialFormValues(getResettedInitialValues());
            navigateToSoknadFrontpage(history);
        }
    }
    const { soknadEssentials } = essentials;

    const hasError = // ignore tempStorage error
        essentials.error !== undefined ||
        alderCheck.error !== undefined ||
        maksEnSoknadPerPeriodeCheck.error !== undefined;

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
                navigateToSoknadFrontpage(history);
            }
        } else {
            setInitialFormValues(getResettedInitialValues());
        }
        setInitializing(false);
    };

    useEffect(() => {
        if (
            initializing === true &&
            !hasError &&
            soknadEssentials &&
            tempStorageIsLoading === false &&
            alderResult !== undefined &&
            maksEnSøknadResult !== undefined
        ) {
            allDataLoaded();
        }
    }, [tempStorageIsLoading, alderResult, maksEnSøknadResult, soknadEssentials]);

    useEffect(() => {
        essentials.fetch();
        tempStorage.fetch();
        alderCheck.check();
        maksEnSoknadPerPeriodeCheck.check();
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

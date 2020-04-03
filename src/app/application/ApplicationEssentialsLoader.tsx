import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import { getApplicantData } from '../api/api';
import LoadWrapper from '../components/load-wrapper/LoadWrapper';
import { ApplicantDataContextProvider } from '../context/ApplicantDataContext';
import { ApplicantData } from '../types/ApplicantData';
import * as apiUtils from '../utils/apiUtils';
import {
    // navigateToErrorPage,
    navigateToLoginPage
    // navigateToWelcomePage,
    // userIsCurrentlyOnErrorPage
} from '../utils/navigationUtils';

interface Props {
    contentLoadedRenderer: (søkerdata?: ApplicantData) => React.ReactNode;
}

interface LoadState {
    isLoading: boolean;
    error?: boolean;
}

const ApplicationEssentialsLoader = ({ contentLoadedRenderer }: Props) => {
    const [loadState, setLoadState] = useState<LoadState>({ isLoading: true });
    const [applicantData, setApplicantData] = useState<ApplicantData | undefined>();
    // const history = useHistory();

    async function loadApplicationEssentials() {
        if (applicantData === undefined && loadState.error === undefined) {
            try {
                const { data: person } = await getApplicantData();
                setApplicantData({ person });
                setLoadState({ isLoading: false, error: undefined });
                // if (userIsCurrentlyOnErrorPage()) {
                //     navigateToWelcomePage();
                // }
            } catch (response) {
                if (apiUtils.isForbidden(response) || apiUtils.isUnauthorized(response)) {
                    navigateToLoginPage();
                    // } else if (!userIsCurrentlyOnErrorPage()) {
                    //     navigateToErrorPage(history);
                }
                setLoadState({ isLoading: false, error: true });
            }
        }
    }

    useEffect(() => {
        loadApplicationEssentials();
    }, [applicantData, loadState]);

    const { isLoading, error } = loadState;

    return (
        <LoadWrapper
            isLoading={isLoading && error === undefined}
            contentRenderer={() => (
                <ApplicantDataContextProvider value={applicantData}>
                    {contentLoadedRenderer(applicantData)}
                </ApplicantDataContextProvider>
            )}
        />
    );
};

export default ApplicationEssentialsLoader;

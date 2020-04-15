import React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';
import GlobalRoutes from '../config/routeConfig';
import ApplicationErrorPage from '../pages/application-error-page/ApplicationErrorPage';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import EntryPage from '../pages/entry-page/EntryPage';
import { ApplicantProfile } from '../types/ApplicantProfile';
import { ApplicationFormData } from '../types/ApplicationFormData';
import { navigateTo, navigateToConfirmationPage } from '../utils/navigationUtils';
import { getApplicationRoute, getNextStepRoute, isAvailable } from '../utils/routeUtils';
import FrilanserStep from './frilanser-step/FrilanserStep';
import SelvstendigStep from './selvstendig-step/SelvstendigStep';
import { getStepConfig, StepID } from './stepConfig';
import SummaryStep from './summary-step/SummaryStep';
import applicationTempStorage from './ApplicationTempStorage';
import { isFeatureEnabled, Feature } from '../utils/featureToggleUtils';

interface Props {
    applicantProfile?: ApplicantProfile;
}

const ApplicationRoutes = ({ applicantProfile }: Props) => {
    const history = useHistory();

    const { values } = useFormikContext<ApplicationFormData>();
    const stepConfig = getStepConfig(values, applicantProfile);
    const applicationSteps = Object.keys(stepConfig) as Array<StepID>;

    const navigateToNextStepFrom = (stepID: StepID) => {
        if (applicantProfile) {
            if (isFeatureEnabled(Feature.PERSISTENCE)) {
                applicationTempStorage.persist(values, stepID, applicantProfile);
            }
        }
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepID, stepConfig);
            if (nextStepRoute) {
                navigateTo(nextStepRoute, history);
            }
        });
    };

    const renderApplicationStep = (stepID: StepID) => {
        if (isAvailable(stepID, values)) {
            switch (stepID) {
                case StepID.SELVSTENDIG:
                    return <SelvstendigStep onValidSubmit={() => navigateToNextStepFrom(StepID.SELVSTENDIG)} />;
                case StepID.FRILANSER:
                    return <FrilanserStep onValidSubmit={() => navigateToNextStepFrom(StepID.FRILANSER)} />;
                case StepID.SUMMARY:
                    return (
                        <SummaryStep
                            onApplicationSent={() => {
                                navigateToConfirmationPage();
                            }}
                        />
                    );
            }
        }
        return <div>No available route</div>;
    };

    const onStartApplication = () => {
        if (applicantProfile) {
            if (isFeatureEnabled(Feature.PERSISTENCE)) {
                applicationTempStorage.persist(values, StepID.SELVSTENDIG, applicantProfile);
            }
            setTimeout(() => {
                navigateTo(`${getApplicationRoute(StepID.SELVSTENDIG)}`, history);
            });
        }
    };

    return (
        <Switch>
            <Route
                exact={true}
                path={GlobalRoutes.APPLICATION}
                render={() => <EntryPage onStart={onStartApplication} />}
            />
            {applicationSteps.map((step) => {
                return <Route key={step} path={getApplicationRoute(step)} render={() => renderApplicationStep(step)} />;
            })}
            <Route path={GlobalRoutes.APPLICATION_SENT} render={() => <ConfirmationPage />} />
            <Route path={GlobalRoutes.APPLICATION_ERROR} render={() => <ApplicationErrorPage />} />
            <Redirect to={GlobalRoutes.APPLICATION_ERROR} />
        </Switch>
    );
};

export default ApplicationRoutes;

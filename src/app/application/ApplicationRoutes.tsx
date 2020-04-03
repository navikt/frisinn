import React from 'react';
import { Route, Switch, useHistory, Redirect } from 'react-router-dom';
import { useFormikContext } from 'formik';
import ConfirmationPage from '../components/pages/confirmation-page/ConfirmationPage';
import GlobalRoutes from '../config/routeConfig';
import { StepID, stepConfig } from './stepConfig';
import { ApplicationFormData } from '../types/ApplicationFormData';
import { navigateTo } from '../utils/navigationUtils';
import { getApplicationRoute, getNextStepRoute, isAvailable } from '../utils/routeUtils';
import SummaryStep from './summary-step/SummaryStep';
import DetailsStep from './details-step/DetailsStep';
import WelcomeStep from './welcome-step/WelcomeStep';

export interface KvitteringInfo {
    søkernavn: string;
}

const ApplicationRoutes = () => {
    const { values } = useFormikContext<ApplicationFormData>();
    const history = useHistory();
    const applicationSteps = Object.keys(stepConfig) as Array<StepID>;

    const navigateToNextStepFrom = (stepID: StepID) => {
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepID);
            if (nextStepRoute) {
                navigateTo(nextStepRoute, history);
            }
        });
    };

    const renderApplicationStep = (stepID: StepID) => {
        if (isAvailable(stepID, values)) {
            switch (stepID) {
                case StepID.WELCOME:
                    return <WelcomeStep onValidSubmit={() => navigateToNextStepFrom(StepID.WELCOME)} />;
                case StepID.DETAILS:
                    return <DetailsStep onValidSubmit={() => navigateToNextStepFrom(StepID.DETAILS)} />;
                case StepID.SUMMARY:
                    return (
                        <SummaryStep
                            onApplicationSent={() => {
                                window.location.href = GlobalRoutes.APPLICATION_SENT;
                            }}
                        />
                    );
            }
        }
        return <div>No available route</div>;
    };

    return (
        <Switch>
            {applicationSteps.map((step) => (
                <Route key={step} path={getApplicationRoute(step)} render={() => renderApplicationStep(step)} />
            ))}
            <Route path={GlobalRoutes.APPLICATION_SENT} render={() => <ConfirmationPage />} />
            <Redirect to={getApplicationRoute(StepID.WELCOME)} />
        </Switch>
    );
};

export default ApplicationRoutes;

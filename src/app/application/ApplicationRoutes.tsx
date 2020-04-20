import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import GlobalRoutes from '../config/routeConfig';
import ApplicationErrorPage from '../pages/application-error-page/ApplicationErrorPage';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import EntryPage from '../pages/entry-page/EntryPage';
import { ApplicationEssentials } from '../types/ApplicationEssentials';
import { ApplicationFormData } from '../types/ApplicationFormData';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateTo, relocateToConfirmationPage } from '../utils/navigationUtils';
import { getApplicationRoute, getNextStepRoute } from '../utils/routeUtils';
import applicationTempStorage from './ApplicationTempStorage';
import FrilanserStep from './frilanser-step/FrilanserStep';
import SelvstendigStep from './selvstendig-step/SelvstendigStep';
import { getStepConfig, StepID } from './stepConfig';
import SummaryStep from './summary-step/SummaryStep';

interface Props {
    resetApplication: () => void;
    applicationEssentials: ApplicationEssentials;
}

const ApplicationRoutes = ({ resetApplication, applicationEssentials }: Props) => {
    const history = useHistory();

    const { values } = useFormikContext<ApplicationFormData>();
    const stepConfig = getStepConfig(values);
    const applicationSteps = Object.keys(stepConfig) as Array<StepID>;

    const navigateToNextStepFrom = (stepID: StepID) => {
        if (values) {
            if (isFeatureEnabled(Feature.PERSISTENCE)) {
                applicationTempStorage.persist(values, stepID);
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
        switch (stepID) {
            case StepID.SELVSTENDIG:
                return (
                    <SelvstendigStep
                        resetApplication={resetApplication}
                        applicationEssentials={applicationEssentials}
                        onValidSubmit={() => navigateToNextStepFrom(StepID.SELVSTENDIG)}
                    />
                );
            case StepID.FRILANSER:
                return (
                    <FrilanserStep
                        resetApplication={resetApplication}
                        applicationEssentials={applicationEssentials}
                        onValidSubmit={() => navigateToNextStepFrom(StepID.FRILANSER)}
                    />
                );
            case StepID.SUMMARY:
                return (
                    <SummaryStep
                        resetApplication={resetApplication}
                        applicationEssentials={applicationEssentials}
                        onApplicationSent={() => {
                            relocateToConfirmationPage();
                        }}
                    />
                );
        }
    };

    const onStartApplication = () => {
        const nextStepID =
            values.søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES
                ? StepID.SELVSTENDIG
                : StepID.FRILANSER;
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            applicationTempStorage.persist(values, nextStepID);
        }
        setTimeout(() => {
            navigateTo(`${getApplicationRoute(nextStepID)}`, history);
        });
    };

    return (
        <Switch>
            <Route
                exact={true}
                path={GlobalRoutes.APPLICATION}
                render={() => <EntryPage onStart={onStartApplication} applicationEssentials={applicationEssentials} />}
            />
            {applicationSteps.map((step) => {
                return <Route key={step} path={getApplicationRoute(step)} render={() => renderApplicationStep(step)} />;
            })}
            <Route path={GlobalRoutes.APPLICATION_SENT} render={() => <ConfirmationPage />} />
            <Route path={GlobalRoutes.APPLICATION_ERROR} render={() => <ApplicationErrorPage />} />
            <Route path="*">
                <div>No matching routes</div>
            </Route>
        </Switch>
    );
};

export default ApplicationRoutes;

import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';
import GlobalRoutes from '../config/routeConfig';
import ApplicationErrorPage from '../pages/application-error-page/ApplicationErrorPage';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import EntryPage from '../pages/entry-page/EntryPage';
import { ApplicationFormData } from '../types/ApplicationFormData';
import { navigateTo, relocateToConfirmationPage } from '../utils/navigationUtils';
import { getApplicationRoute, getNextStepRoute } from '../utils/routeUtils';
import FrilanserStep from './frilanser-step/FrilanserStep';
import SelvstendigStep from './selvstendig-step/SelvstendigStep';
import { getStepConfig, StepID } from './stepConfig';
import SummaryStep from './summary-step/SummaryStep';
import applicationTempStorage from './ApplicationTempStorage';
import { isFeatureEnabled, Feature } from '../utils/featureToggleUtils';
import { ApplicationEssentials } from '../types/ApplicationEssentials';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

interface Props {
    applicationEssentials: ApplicationEssentials;
}

const ApplicationRoutes = ({ applicationEssentials }: Props) => {
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
                        onValidSubmit={() => navigateToNextStepFrom(StepID.SELVSTENDIG)}
                        applicationEssentials={applicationEssentials}
                    />
                );
            case StepID.FRILANSER:
                return (
                    <FrilanserStep
                        onValidSubmit={() => navigateToNextStepFrom(StepID.FRILANSER)}
                        applicationEssentials={applicationEssentials}
                    />
                );
            case StepID.SUMMARY:
                return (
                    <SummaryStep
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
                render={() => <EntryPage onStart={onStartApplication} />}
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

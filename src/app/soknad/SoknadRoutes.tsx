import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import GlobalRoutes, { getRouteUrl } from '../config/routeConfig';
import SoknadErrorPage from '../pages/soknad-error-page/SoknadErrorPage';
import SoknadEntryPage from '../pages/soknad-entry-page/SoknadEntryPage';
import { SoknadEssentials } from '../types/SoknadEssentials';
import { SoknadFormData } from '../types/SoknadFormData';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateTo, relocateToReceiptPage } from '../utils/navigationUtils';
import { getSoknadRoute, getNextStepRoute } from '../utils/routeUtils';
import soknadTempStorage from './SoknadTempStorage';
import FrilanserStep from './frilanser-step/FrilanserStep';
import SelvstendigStep from './selvstendig-step/SelvstendigStep';
import { getStepConfig, StepID } from './stepConfig';
import SummaryStep from './summary-step/SummaryStep';
import Lenke from 'nav-frontend-lenker';
import BekreftInfoStep from './bekreft-inntekt-step/BekreftInntektStep';
import { triggerSentryCustomError, SentryEventName } from '../utils/sentryUtils';

interface Props {
    resetSoknad: () => void;
    soknadEssentials: SoknadEssentials;
}

const SoknadRoutes = ({ resetSoknad: resetSoknad, soknadEssentials }: Props) => {
    const history = useHistory();

    const { values } = useFormikContext<SoknadFormData>();
    const stepConfig = getStepConfig(values);
    const soknadSteps = Object.keys(stepConfig) as Array<StepID>;

    const navigateToNextStepFrom = (stepID: StepID) => {
        if (values) {
            if (isFeatureEnabled(Feature.PERSISTENCE)) {
                soknadTempStorage.persist(values, stepID);
            }
        }
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepID, stepConfig);
            if (nextStepRoute) {
                navigateTo(nextStepRoute, history);
            }
        });
    };

    const renderSoknadStep = (stepID: StepID) => {
        switch (stepID) {
            case StepID.SELVSTENDIG:
                return (
                    <SelvstendigStep
                        resetSoknad={resetSoknad}
                        soknadEssentials={soknadEssentials}
                        onValidSubmit={() => navigateToNextStepFrom(StepID.SELVSTENDIG)}
                    />
                );
            case StepID.FRILANSER:
                return (
                    <FrilanserStep
                        resetSoknad={resetSoknad}
                        soknadEssentials={soknadEssentials}
                        onValidSubmit={() => navigateToNextStepFrom(StepID.FRILANSER)}
                    />
                );
            case StepID.BEKREFT_INNTEKT:
                return (
                    <BekreftInfoStep
                        resetSoknad={resetSoknad}
                        soknadEssentials={soknadEssentials}
                        onValidSubmit={() => navigateToNextStepFrom(StepID.BEKREFT_INNTEKT)}
                    />
                );
            case StepID.SUMMARY:
                return (
                    <SummaryStep
                        resetSoknad={resetSoknad}
                        soknadEssentials={soknadEssentials}
                        onSoknadSent={() => {
                            relocateToReceiptPage();
                        }}
                    />
                );
        }
    };

    const onStartSoknad = () => {
        const nextStepID =
            values.søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES
                ? StepID.SELVSTENDIG
                : StepID.FRILANSER;
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            soknadTempStorage.persist(values, nextStepID);
        }
        setTimeout(() => {
            navigateTo(`${getSoknadRoute(nextStepID)}`, history);
        });
    };

    return (
        <Switch>
            <Route
                exact={true}
                path={GlobalRoutes.SOKNAD}
                render={() => (
                    <SoknadEntryPage
                        onStart={onStartSoknad}
                        soknadEssentials={soknadEssentials}
                        resetSoknad={resetSoknad}
                    />
                )}
            />
            {soknadSteps.map((step) => {
                return <Route key={step} path={getSoknadRoute(step)} render={() => renderSoknadStep(step)} />;
            })}
            <Route path={GlobalRoutes.SOKNAD_ERROR} render={() => <SoknadErrorPage />} />
            <Route path="*">
                {() => {
                    triggerSentryCustomError(SentryEventName.noMatchingSoknadRoute);
                    return (
                        <SoknadErrorPage>
                            <p>
                                Noe gikk feil under visningen av denne siden. Kanskje du har lastet siden på nytt? Dette
                                er noe vi ikke støtter enda, så du må fylle ut søknaden uten å laste siden på nytt.
                            </p>
                            <Lenke href={getRouteUrl(GlobalRoutes.SOKNAD)}>
                                Gå tilbake til startsiden for søknaden
                            </Lenke>
                        </SoknadErrorPage>
                    );
                }}
            </Route>
        </Switch>
    );
};

export default SoknadRoutes;

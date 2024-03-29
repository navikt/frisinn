import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import GlobalRoutes from '../config/routeConfig';
import useOsloTime from '../hooks/useOsloTime';
import { usePrevious } from '../hooks/usePrevious';
import SoknadEntryPage from '../pages/soknad-entry-page/SoknadEntryPage';
import SoknadErrorPage from '../pages/soknad-error-page/SoknadErrorPage';
import { SoknadEssentials } from '../types/SoknadEssentials';
import { SoknadFormData } from '../types/SoknadFormData';
import { isRunningInDevEnvironment } from '../utils/envUtils';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';
import { navigateTo, relocateToReceiptPage } from '../utils/navigationUtils';
import { getNextStepRoute, getSoknadRoute } from '../utils/routeUtils';
import { SentryEventName, triggerSentryCustomError, triggerSentryMessage } from '../utils/sentryUtils';
import { erSøknadStartetTidspunktErGyldig } from '../utils/startetSøknadTidspunktUtils';
import ArbeidstakerStep from './arbeidstaker-step/ArbeidstakerStep';
import BekreftInfoStep from './bekreft-inntekt-step/BekreftInntektStep';
import FrilanserStep from './frilanser-step/FrilanserStep';
import SelvstendigAndregangStep from './selvstendig-step/andregang/SelvstendigAndregangStep';
import SelvstendigForstegangStep from './selvstendig-step/forstegang/SelvstendigForstegangStep';
import SoknadErrors from './soknad-errors/SoknadErrors';
import soknadTempStorage from './SoknadTempStorage';
import { getStepConfig, StepID } from './stepConfig';
import SummaryStep from './summary-step/SummaryStep';

interface Props {
    resetSoknad: () => void;
    soknadEssentials: SoknadEssentials;
}

const SoknadRoutes = ({ resetSoknad, soknadEssentials }: Props) => {
    const history = useHistory();

    const { values } = useFormikContext<SoknadFormData>();
    const stepConfig = getStepConfig(values, soknadEssentials.søknadsperiodeinfo);
    const soknadSteps = Object.keys(stepConfig) as Array<StepID>;
    const { harSøktSomSelvstendigNæringsdrivende } = soknadEssentials.tidligerePerioder;
    const [søknadIsToOld, setSøknadIsToOld] = useState<boolean>(false);

    const osloTime = useOsloTime();
    const { utcString } = osloTime;

    const preUtcString = usePrevious(utcString);
    useEffect(() => {
        if (
            utcString &&
            preUtcString !== utcString &&
            erSøknadStartetTidspunktErGyldig(values.startetSøknadTidspunkt, utcString) === false
        ) {
            setSøknadIsToOld(true);
        }
    }, [utcString]);

    const navigateToNextStepFrom = (stepID: StepID) => {
        osloTime.triggerFetch();
        if (values) {
            if (isFeatureEnabled(Feature.PERSISTENCE)) {
                const stepToPersist = stepConfig[stepID].nextStep;
                if (stepToPersist) {
                    soknadTempStorage.persist(values, stepToPersist, soknadEssentials);
                }
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
                if (harSøktSomSelvstendigNæringsdrivende) {
                    return (
                        <SelvstendigAndregangStep
                            stepConfig={stepConfig}
                            resetSoknad={resetSoknad}
                            soknadEssentials={soknadEssentials}
                            onValidSubmit={() => navigateToNextStepFrom(StepID.SELVSTENDIG)}
                        />
                    );
                }
                return (
                    <SelvstendigForstegangStep
                        stepConfig={stepConfig}
                        resetSoknad={resetSoknad}
                        soknadEssentials={soknadEssentials}
                        onValidSubmit={() => navigateToNextStepFrom(StepID.SELVSTENDIG)}
                    />
                );
            case StepID.FRILANSER:
                return (
                    <FrilanserStep
                        stepConfig={stepConfig}
                        resetSoknad={resetSoknad}
                        soknadEssentials={soknadEssentials}
                        onValidSubmit={() => navigateToNextStepFrom(StepID.FRILANSER)}
                    />
                );
            case StepID.ARBEIDSTAKER:
                return (
                    <ArbeidstakerStep
                        stepConfig={stepConfig}
                        resetSoknad={resetSoknad}
                        soknadEssentials={soknadEssentials}
                        onValidSubmit={() => navigateToNextStepFrom(StepID.ARBEIDSTAKER)}
                    />
                );
            case StepID.BEKREFT_INNTEKT:
                return (
                    <BekreftInfoStep
                        stepConfig={stepConfig}
                        resetSoknad={resetSoknad}
                        soknadEssentials={soknadEssentials}
                        onValidSubmit={() => navigateToNextStepFrom(StepID.BEKREFT_INNTEKT)}
                    />
                );
            case StepID.SUMMARY:
                return (
                    <SummaryStep
                        stepConfig={stepConfig}
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
            soknadTempStorage.persist(values, nextStepID, soknadEssentials);
        }
        setTimeout(() => {
            navigateTo(`${getSoknadRoute(nextStepID)}`, history);
        });
    };

    if (søknadIsToOld === true) {
        triggerSentryMessage(
            SentryEventName.startetSøknadTidspunktIsTooOld,
            JSON.stringify({
                time: osloTime.timestamp,
                startet: values.startetSøknadTidspunkt,
            })
        );
        return (
            <SoknadErrorPage>
                <SoknadErrors.MissingApiDataError />
            </SoknadErrorPage>
        );
    }

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
            <Route
                path={GlobalRoutes.SOKNAD_ERROR}
                render={() => (
                    <SoknadErrorPage>
                        <SoknadErrors.GeneralError />
                    </SoknadErrorPage>
                )}
            />
            <Route
                path="*"
                render={() => {
                    if (isRunningInDevEnvironment()) {
                        triggerSentryCustomError(SentryEventName.noMatchingSoknadRoute, JSON.stringify({ values }));
                    }
                    return (
                        <SoknadErrorPage>
                            <SoknadErrors.NoMatchingRoute />
                        </SoknadErrorPage>
                    );
                }}></Route>
        </Switch>
    );
};

export default SoknadRoutes;

import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { SoknadEssentials } from '../types/SoknadEssentials';
import { SoknadFormData } from '../types/SoknadFormData';
import { getSoknadRoute } from '../utils/routeUtils';
import { DateRange } from '../utils/dateUtils';
import Søknadsperioden from '../utils/søknadsperioden';

export enum StepID {
    'SELVSTENDIG' = 'selvstendignaringsdrivende',
    'FRILANSER' = 'frilanser',
    'ARBEIDSTAKER' = 'arbeidstaker',
    'BEKREFT_INNTEKT' = 'bekreftInntekt',
    'SUMMARY' = 'oppsummering',
}

export interface StepConfigItemTexts {
    pageTitle: string;
    stepTitle: string;
    nextButtonLabel: string;
}

export interface StepItemConfigInterface extends StepConfigItemTexts {
    index: number;
    nextStep?: StepID;
    backLinkHref?: string;
}

export interface StepConfigInterface {
    [key: string]: StepItemConfigInterface;
}

const getStepConfigItemTextKeys = (stepId: StepID): StepConfigItemTexts => {
    return {
        pageTitle: `step.${stepId}.pageTitle`,
        stepTitle: `step.${stepId}.stepTitle`,
        nextButtonLabel: `step.${stepId}.nextButtonLabel`,
    };
};

const getAvailableStep = (values: SoknadFormData, søknadsperiode: DateRange): StepID[] => {
    const steps: StepID[] = [];
    if (values?.søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES) {
        steps.push(StepID.SELVSTENDIG);
    }
    if (values?.søkerOmTaptInntektSomFrilanser === YesOrNo.YES) {
        steps.push(StepID.FRILANSER);
    }
    if (
        Søknadsperioden(søknadsperiode).arbeidstakerinntektErAktiv &&
        (values?.selvstendigSoknadIsOk || values?.frilanserSoknadIsOk)
    ) {
        steps.push(StepID.ARBEIDSTAKER);
    }
    steps.push(StepID.BEKREFT_INNTEKT);
    steps.push(StepID.SUMMARY);
    return steps;
};

export const getStepConfig = (values: SoknadFormData, søknadsperiode: DateRange): StepConfigInterface => {
    const steps = getAvailableStep(values, søknadsperiode);
    const numSteps = steps.length;
    const config: StepConfigInterface = {};
    let idx = 0;
    steps.forEach((step) => {
        config[step] = {
            ...getStepConfigItemTextKeys(step),
            index: idx,
            backLinkHref: idx > 0 ? getSoknadRoute(steps[idx - 1]) : undefined,
            nextStep: idx < numSteps - 1 ? steps[idx + 1] : undefined,
        };
        idx++;
    });
    return config;
};

export interface StepConfigProps {
    soknadEssentials: SoknadEssentials;
    stepConfig: StepConfigInterface;
    resetSoknad: () => void;
    onValidSubmit: () => void;
}

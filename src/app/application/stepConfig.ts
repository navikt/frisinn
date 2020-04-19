import { ApplicationFormData } from '../types/ApplicationFormData';
import { getApplicationRoute } from '../utils/routeUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ApplicationEssentials } from '../types/ApplicationEssentials';

export enum StepID {
    'SELVSTENDIG' = 'selvstendignaringsdrivende',
    'FRILANSER' = 'frilanser',
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

const getAvailableStep = (values?: ApplicationFormData): StepID[] => {
    const steps: StepID[] = [];
    if (values?.søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES) {
        steps.push(StepID.SELVSTENDIG);
    }
    if (values?.søkerOmTaptInntektSomFrilanser === YesOrNo.YES) {
        steps.push(StepID.FRILANSER);
    }
    steps.push(StepID.SUMMARY);
    return steps;
};

export const getStepConfig = (values: ApplicationFormData): StepConfigInterface => {
    const steps = getAvailableStep(values);
    const numSteps = steps.length;
    const config: StepConfigInterface = {};
    let idx = 0;
    steps.forEach((step) => {
        config[step] = {
            ...getStepConfigItemTextKeys(step),
            index: idx,
            backLinkHref: idx > 0 ? getApplicationRoute(steps[idx - 1]) : undefined,
            nextStep: idx < numSteps - 1 ? steps[idx + 1] : undefined,
        };
        idx++;
    });
    return config;
};

export interface StepConfigProps {
    applicationEssentials: ApplicationEssentials;
    resetApplication: () => void;
    onValidSubmit: () => void;
}

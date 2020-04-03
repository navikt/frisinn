import { getApplicationRoute } from '../utils/routeUtils';

export enum StepID {
    'WELCOME' = 'velkommen',
    'DETAILS' = 'detaljer',
    'SUMMARY' = 'oppsummering'
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
        nextButtonLabel: `step.nextButtonLabel`
    };
};

export const stepConfig: StepConfigInterface = {
    [StepID.WELCOME]: {
        ...getStepConfigItemTextKeys(StepID.WELCOME),
        index: 0,
        nextStep: StepID.DETAILS
    },
    [StepID.DETAILS]: {
        ...getStepConfigItemTextKeys(StepID.DETAILS),
        index: 1,
        backLinkHref: getApplicationRoute(StepID.WELCOME)
    },
    [StepID.SUMMARY]: {
        ...getStepConfigItemTextKeys(StepID.SUMMARY),
        index: 2,
        backLinkHref: getApplicationRoute(StepID.DETAILS)
    }
};

export interface StepConfigProps {
    onValidSubmit: () => void;
}

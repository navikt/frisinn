import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigInterface, StepConfigItemTexts, StepID } from 'app/application/stepConfig';
import { ApplicationFormData } from '../types/ApplicationFormData';

export const getStepTexts = (intl: IntlShape, stepId: StepID, stepConfig: StepConfigInterface): StepConfigItemTexts => {
    const conf = stepConfig[stepId];
    return {
        pageTitle: intlHelper(intl, conf.pageTitle),
        stepTitle: intlHelper(intl, conf.stepTitle),
        nextButtonLabel: intlHelper(intl, conf.nextButtonLabel)
    };
};

export const welcomingPageIAvailable = (formData: ApplicationFormData) => {
    return true;
};

export const summaryStepAvailable = (formData: ApplicationFormData) => {
    return true;
};

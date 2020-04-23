import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import NAVStepIndicator from 'nav-frontend-stegindikator/lib/stegindikator';
import { default as Step } from 'nav-frontend-stegindikator/lib/stegindikator-steg';
import { getStepTexts } from 'app/utils/stepUtils';
import { StepConfigInterface } from '../../../soknad/stepConfig';

interface StepIndicatorProps {
    activeStep: number;
    stepConfig: StepConfigInterface;
}

const renderSteps = (stepConfig: StepConfigInterface, intl: IntlShape) =>
    Object.keys(stepConfig).map((stepId, index) => {
        const { stepTitle } = getStepTexts(intl, stepId as any, stepConfig);
        return <Step index={index} label={stepTitle} key={`${stepTitle + index}`} />;
    });

const StepIndicator: React.FunctionComponent<StepIndicatorProps> = ({ activeStep, stepConfig }: StepIndicatorProps) => {
    const intl = useIntl();
    return (
        <NAVStepIndicator visLabel={false} autoResponsiv={false} aktivtSteg={activeStep}>
            {renderSteps(stepConfig, intl)}
        </NAVStepIndicator>
    );
};

export default StepIndicator;

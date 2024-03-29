import React from 'react';
import { useIntl } from 'react-intl';
import { Knapp } from 'nav-frontend-knapper';
import FormBlock from 'common/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import StepFooter from '../components/step-footer/StepFooter';
import Step, { StepProps } from '../components/step/Step';
import { SoknadFormData } from '../types/SoknadFormData';
import { getStepTexts } from '../utils/stepUtils';
import SoknadFormComponents from './SoknadFormComponents';
import { StepConfigInterface } from './stepConfig';

export interface FormikStepProps {
    children: React.ReactNode;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    onValidFormSubmit?: () => void;
    stepConfig: StepConfigInterface;
    skipValidation?: boolean;
    stepCleanup?: (values: SoknadFormData) => SoknadFormData;
    resetSoknad: () => void;
}

type Props = FormikStepProps & StepProps;

const SoknadStep: React.FunctionComponent<Props> = ({ resetSoknad, stepCleanup, stepConfig, ...restProps }: Props) => {
    const intl = useIntl();
    const { children, onValidFormSubmit, showButtonSpinner, showSubmitButton = true, buttonDisabled, id } = restProps;
    const texts = getStepTexts(intl, id, stepConfig);

    const handleAvbrytOgSlettSøknad = () => {
        resetSoknad();
    };

    return (
        <Step stepConfig={stepConfig} {...restProps}>
            <SoknadFormComponents.Form
                onValidSubmit={onValidFormSubmit}
                includeButtons={false}
                includeValidationSummary={true}
                runDelayedFormValidation={true}
                cleanup={stepCleanup}
                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                {children}
                {showSubmitButton && (
                    <FormBlock>
                        <Knapp
                            type="hoved"
                            htmlType="submit"
                            className={'step__button'}
                            spinner={showButtonSpinner || false}
                            disabled={buttonDisabled || false}>
                            {texts.nextButtonLabel}
                        </Knapp>
                    </FormBlock>
                )}
            </SoknadFormComponents.Form>
            <StepFooter onAvbrytOgSlett={handleAvbrytOgSlettSøknad} />
        </Step>
    );
};

export default SoknadStep;

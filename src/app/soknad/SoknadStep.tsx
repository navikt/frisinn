import React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import FormBlock from 'common/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import StepFooter from '../components/step-footer/StepFooter';
import Step, { StepProps } from '../components/step/Step';
import { SoknadFormData } from '../types/SoknadFormData';
import { getStepTexts } from '../utils/stepUtils';
import SoknadFormComponents from './SoknadFormComponents';
import { getStepConfig } from './stepConfig';
import { Prompt } from 'react-router';

export interface FormikStepProps {
    children: React.ReactNode;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    onValidFormSubmit?: () => void;
    skipValidation?: boolean;
    stepCleanup?: (values: SoknadFormData) => SoknadFormData;
    resetSoknad: () => void;
}

type Props = FormikStepProps & StepProps;

const SoknadStep: React.FunctionComponent<Props> = ({ resetSoknad, stepCleanup, ...restProps }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();

    const stepConfig = getStepConfig(values);
    const { children, onValidFormSubmit, showButtonSpinner, showSubmitButton = true, buttonDisabled, id } = restProps;
    const texts = getStepTexts(intl, id, stepConfig);

    const handleAvbrytOgSlettSøknad = () => {
        resetSoknad();
    };

    return (
        <Step stepConfig={stepConfig} {...restProps}>
            <Prompt when={true} message="Are you sure you want to leave?" />
            <SoknadFormComponents.Form
                onValidSubmit={onValidFormSubmit}
                includeButtons={false}
                includeValidationSummary={true}
                runDelayedFormValidation={false}
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

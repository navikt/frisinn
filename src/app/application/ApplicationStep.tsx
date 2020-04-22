import React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import FormBlock from 'common/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import StepFooter from '../components/step-footer/StepFooter';
import Step, { StepProps } from '../components/step/Step';
import { ApplicationFormData } from '../types/ApplicationFormData';
import { getStepTexts } from '../utils/stepUtils';
import ApplicationFormComponents from './ApplicationFormComponents';
import { getStepConfig } from './stepConfig';

export interface FormikStepProps {
    children: React.ReactNode;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    onValidFormSubmit?: () => void;
    skipValidation?: boolean;
    stepCleanup?: (values: ApplicationFormData) => ApplicationFormData;
    resetApplication: () => void;
}

type Props = FormikStepProps & StepProps;

const ApplicationStep: React.FunctionComponent<Props> = ({ resetApplication, stepCleanup, ...restProps }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<ApplicationFormData>();

    const stepConfig = getStepConfig(values);
    const { children, onValidFormSubmit, showButtonSpinner, showSubmitButton = true, buttonDisabled, id } = restProps;
    const texts = getStepTexts(intl, id, stepConfig);

    const handleAvbrytOgSlettSøknad = () => {
        resetApplication();
    };

    return (
        <Step stepConfig={stepConfig} {...restProps}>
            <ApplicationFormComponents.Form
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
            </ApplicationFormComponents.Form>
            <StepFooter onAvbrytOgSlett={handleAvbrytOgSlettSøknad} />
        </Step>
    );
};

export default ApplicationStep;

import React from 'react';
import { useIntl } from 'react-intl';
import { Knapp } from 'nav-frontend-knapper';
import FormBlock from 'common/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import Step, { StepProps } from '../components/step/Step';
import { getStepTexts } from '../utils/stepUtils';
import ApplicationFormComponents from './ApplicationFormComponents';
import { stepConfig } from './stepConfig';

export interface FormikStepProps {
    children: React.ReactNode;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    onValidFormSubmit?: () => void;
    skipValidation?: boolean;
}

type Props = FormikStepProps & StepProps;

const ApplicationStep: React.FunctionComponent<Props> = (props) => {
    const intl = useIntl();
    const { children, onValidFormSubmit, showButtonSpinner, buttonDisabled, id } = props;
    const texts = getStepTexts(intl, id, stepConfig);
    return (
        <Step stepConfig={stepConfig} {...props}>
            <ApplicationFormComponents.Form
                onValidSubmit={onValidFormSubmit}
                includeButtons={false}
                includeValidationSummary={true}
                runDelayedFormValidation={true}
                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                {children}
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
            </ApplicationFormComponents.Form>
        </Step>
    );
};

export default ApplicationStep;

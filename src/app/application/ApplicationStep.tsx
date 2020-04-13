import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import FormBlock from 'common/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from 'common/utils/commonFieldErrorRenderer';
import MissingAppContext from '../components/missing-app-context/MissingAppContext';
import StepFooter from '../components/step-footer/StepFooter';
import Step, { StepProps } from '../components/step/Step';
import { ApplicationContext } from '../context/ApplicationContext';
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
}

type Props = FormikStepProps & StepProps;

const ApplicationStep: React.FunctionComponent<Props> = (props: Props) => {
    const intl = useIntl();
    const { values, resetForm } = useFormikContext<ApplicationFormData>();
    const appContext = useContext(ApplicationContext);

    if (!appContext) {
        return <MissingAppContext />;
    }

    const stepConfig = getStepConfig(values, appContext.applicantProfile);
    const { children, onValidFormSubmit, showButtonSpinner, showSubmitButton = true, buttonDisabled, id } = props;
    const texts = getStepTexts(intl, id, stepConfig);
    const handleAvbrytOgSlettSøknad = () => {
        resetForm();
        appContext.resetApplication();
    };
    return (
        <Step stepConfig={stepConfig} {...props}>
            <ApplicationFormComponents.Form
                onValidSubmit={onValidFormSubmit}
                includeButtons={false}
                includeValidationSummary={true}
                runDelayedFormValidation={false}
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

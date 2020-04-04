import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { canUserContinueToApplication } from '../../../utils/accessUtils';
import { IntroFormData, IntroFormField, IntroFormQuestions } from './introFormConfig';

const FormComponent = getTypedFormComponents<IntroFormField, IntroFormData>();

const initialValues: IntroFormData = {
    erSelvstendigNæringsdrivende: YesOrNo.UNANSWERED,
    erFrilanser: YesOrNo.UNANSWERED,
};

interface Props {
    onValidSubmit: (values: IntroFormData) => void;
}

const IntroForm = ({ onValidSubmit }: Props) => {
    const intl = useIntl();
    return (
        <FormComponent.FormikWrapper
            onSubmit={onValidSubmit}
            initialValues={initialValues}
            renderForm={({ values }) => {
                const { isVisible, areAllQuestionsAnswered } = IntroFormQuestions.getVisbility(values);
                const canUseApplication = areAllQuestionsAnswered() ? canUserContinueToApplication(values) : undefined;

                return (
                    <FormComponent.Form
                        includeValidationSummary={true}
                        includeButtons={canUseApplication === true}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        submitButtonLabel="Gå videre">
                        {isVisible(IntroFormField.erSelvstendigNæringsdrivende) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.erSelvstendigNæringsdrivende}
                                    legend={'Er du selvstendig næringsdrivende'}
                                />
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.erFrilanser) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.erFrilanser}
                                    legend={'Er du frilanser?'}
                                />
                            </FormBlock>
                        )}
                        {canUseApplication === false && (
                            <Box margin="xl">
                                <AlertStripeAdvarsel>Du kan ikke bruke denne søknaden.</AlertStripeAdvarsel>
                            </Box>
                        )}
                    </FormComponent.Form>
                );
            }}
        />
    );
};

export default IntroForm;

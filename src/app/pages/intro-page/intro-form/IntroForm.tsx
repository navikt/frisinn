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
    erSelvstendigNæringsdrivendeEllerFrilanser: YesOrNo.UNANSWERED,
    harHattInntaktstapPgaKorona: YesOrNo.UNANSWERED,
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
                        {isVisible(IntroFormField.erSelvstendigNæringsdrivendeEllerFrilanser) && (
                            <>
                                <FormBlock>
                                    <FormComponent.YesOrNoQuestion
                                        name={IntroFormField.erSelvstendigNæringsdrivendeEllerFrilanser}
                                        legend={'Er du selvstendig næringsdrivende eller frilanser'}
                                    />
                                </FormBlock>
                                {isVisible(IntroFormField.harHattInntaktstapPgaKorona) && (
                                    <FormBlock>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.harHattInntaktstapPgaKorona}
                                            legend={'Har du hatt inntektstap på grunn av Koronaviruset?'}
                                        />
                                    </FormBlock>
                                )}
                            </>
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

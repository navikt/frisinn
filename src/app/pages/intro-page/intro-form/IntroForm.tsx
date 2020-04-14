import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { shouldUserBeStoppedFormUsingApplication, RejectReason } from '../../../utils/accessUtils';
import { IntroFormData, IntroFormField, IntroFormQuestions } from './introFormConfig';

const FormComponent = getTypedFormComponents<IntroFormField, IntroFormData>();

const initialValues: IntroFormData = {
    erMellom18og67år: YesOrNo.UNANSWERED,
    erSelvstendigNæringsdrivende: YesOrNo.UNANSWERED,
    erFrilanser: YesOrNo.UNANSWERED,
    erArbeidstaker: YesOrNo.UNANSWERED,
    harFullUtbetalingFraNAV: YesOrNo.UNANSWERED,
    harTaptInntektPgaKorona: YesOrNo.UNANSWERED,
    harInntektUnder6g: YesOrNo.UNANSWERED,
    harSøktAndreYtelserFraNAV: YesOrNo.UNANSWERED,
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
                const rejectionReason = shouldUserBeStoppedFormUsingApplication(values);
                const { isVisible, areAllQuestionsAnswered } = IntroFormQuestions.getVisbility({
                    ...values,
                    rejectionReason,
                });

                return (
                    <FormComponent.Form
                        includeValidationSummary={true}
                        includeButtons={areAllQuestionsAnswered() && rejectionReason === undefined}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        submitButtonLabel="Gå videre">
                        {isVisible(IntroFormField.erMellom18og67år) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.erMellom18og67år}
                                    legend={
                                        'Var du over (eller fylte) 18 år, og under (eller ble) 67 år i perioden du søker for?'
                                    }
                                />
                            </FormBlock>
                        )}
                        {rejectionReason === RejectReason.erIkkeMellom18og66 && (
                            <FormBlock>
                                <AlertStripeAdvarsel>Du må være mellom fra 18 og 66 år</AlertStripeAdvarsel>
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.erSelvstendigNæringsdrivende) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.erSelvstendigNæringsdrivende}
                                    legend={'Er du selvstendig næringsdrivende?'}
                                />
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.erFrilanser) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.erFrilanser}
                                    legend={'Er du frilanser pr. NAVs definisjon?'}
                                />
                            </FormBlock>
                        )}
                        {rejectionReason === RejectReason.erIkkeSelvstendigEllerFrilanser && (
                            <FormBlock>
                                <AlertStripeAdvarsel>
                                    Du må være selvstendig næringsdrivende eller frilanser
                                </AlertStripeAdvarsel>
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.erArbeidstaker) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.erArbeidstaker}
                                    legend={'Har du hatt inntekt som arbeidstaker?'}
                                />
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.harFullUtbetalingFraNAV) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.harFullUtbetalingFraNAV}
                                    legend={'Får du full utbetaling fra NAV (100%)?'}
                                />
                            </FormBlock>
                        )}
                        {rejectionReason === RejectReason.harFullUtbetalingFraNAV && (
                            <FormBlock>
                                <AlertStripeAdvarsel>
                                    Dersom du får full utbetaling fra NAV i perioden, kan du ikke søke her
                                </AlertStripeAdvarsel>
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.harTaptInntektPgaKorona) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.harTaptInntektPgaKorona}
                                    legend={
                                        'Har du tapt inntekt som selvstendig næringsdrivende eller frilanser på grunn av koronatiltak?'
                                    }
                                />
                            </FormBlock>
                        )}
                        {rejectionReason === RejectReason.harIkkeTaptInntektPgaKorona && (
                            <FormBlock>
                                <AlertStripeAdvarsel>
                                    Dersom du ikke har tapt inntekt på grunn av koronatiltak, kan du ikke søke her
                                </AlertStripeAdvarsel>
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.harInntektUnder6g) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.harInntektUnder6g}
                                    legend={'Er din totale inntekt mindre enn 6g (600 000)?'}
                                />
                            </FormBlock>
                        )}
                        {rejectionReason === RejectReason.harInntektOver6g && (
                            <FormBlock>
                                <AlertStripeAdvarsel>
                                    Dersom du har en inntekt over 6g, kan du ikke søke her
                                </AlertStripeAdvarsel>
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.harSøktAndreYtelserFraNAV) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.harSøktAndreYtelserFraNAV}
                                    legend={'Er du søkt på andre NAV ytelser i samme periode som du søker for nå?'}
                                />
                            </FormBlock>
                        )}
                        {values.harSøktAndreYtelserFraNAV === YesOrNo.YES && (
                            <FormBlock>
                                <AlertStripeInfo>Når du har søkt om andre ytelser samtidig så ...</AlertStripeInfo>
                            </FormBlock>
                        )}
                    </FormComponent.Form>
                );
            }}
        />
    );
};

export default IntroForm;

import React from 'react';
import { useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { IntroFormData, IntroFormField, IntroFormQuestions } from './introFormConfig';
import { yesOrNoIsAnswered } from '../../../utils/yesOrNoUtils';
import { Undertittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Lenke from 'nav-frontend-lenker';
import { DateRange } from '../../../utils/dateUtils';
import moment from 'moment';
import { formatDate } from '../../../components/date-view/DateView';
import DateRangeView from '../../../components/date-range-view/DateRangeView';
import introFormUtils from './introFormUtils';

const FormComponent = getTypedFormComponents<IntroFormField, IntroFormData>();

const initialValues: IntroFormData = {
    erMellom18og67år: YesOrNo.UNANSWERED,
    erSelvstendigNæringsdrivende: YesOrNo.UNANSWERED,
    selvstendigHarTaptInntektPgaKorona: YesOrNo.UNANSWERED,
    selvstendigFårDekketTapet: YesOrNo.UNANSWERED,
    erFrilanser: YesOrNo.UNANSWERED,
    frilanserHarTaptInntektPgaKorona: YesOrNo.UNANSWERED,
    frilanserFårDekketTapet: YesOrNo.UNANSWERED,
    harAlleredeSøkt: YesOrNo.UNANSWERED,
    vilFortsetteTilSøknad: YesOrNo.UNANSWERED,
};

interface Props {
    currentPeriode: DateRange;
    onValidSubmit: (values: IntroFormData) => void;
}

const IntroForm = ({ onValidSubmit, currentPeriode }: Props) => {
    const intl = useIntl();

    return (
        <FormComponent.FormikWrapper
            onSubmit={onValidSubmit}
            initialValues={initialValues}
            renderForm={({ values }) => {
                const { isVisible, areAllQuestionsAnswered } = IntroFormQuestions.getVisbility({
                    ...values,
                });

                const alderIsOk = yesOrNoIsAnswered(values.erMellom18og67år) && values.erMellom18og67år === YesOrNo.YES;
                const selvstendigIsOk = introFormUtils.canApplyAsSelvstendig(values);
                const frilanserIsOk = introFormUtils.canApplyAsFrilanser(values);
                const harAlleredeSøktIsOk =
                    values.harAlleredeSøkt === YesOrNo.NO || values.vilFortsetteTilSøknad === YesOrNo.YES;

                const canContinueToApplication =
                    areAllQuestionsAnswered() && (selvstendigIsOk || frilanserIsOk) && alderIsOk && harAlleredeSøktIsOk;

                const minBirthDate: Date = moment(currentPeriode.to).subtract(18, 'years').toDate();
                const maxBirthDate: Date = moment(currentPeriode.from).subtract(67, 'years').toDate();

                console.log();

                return (
                    <FormComponent.Form
                        includeValidationSummary={true}
                        includeButtons={canContinueToApplication}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        submitButtonLabel="Gå videre til søknaden">
                        {isVisible(IntroFormField.erMellom18og67år) && (
                            <>
                                <Box margin="m">
                                    <Undertittel>Alder</Undertittel>
                                </Box>
                                <FormBlock margin="l">
                                    <FormComponent.YesOrNoQuestion
                                        name={IntroFormField.erMellom18og67år}
                                        legend={`Er du født på, eller mellom ${formatDate(
                                            maxBirthDate
                                        )} og ${formatDate(minBirthDate)}?`}
                                    />
                                </FormBlock>
                            </>
                        )}
                        {values.erMellom18og67år === YesOrNo.NO && (
                            <FormBlock>
                                <AlertStripeAdvarsel>
                                    Du må ha vært mellom fra 18 og 67 år i perioden{' '}
                                    <DateRangeView dateRange={currentPeriode} />{' '}
                                </AlertStripeAdvarsel>
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.erSelvstendigNæringsdrivende) && (
                            <>
                                <Box margin="xxl">
                                    <Undertittel>Selvstendig næringsdrivende</Undertittel>
                                </Box>
                                <FormBlock margin="l">
                                    <FormComponent.YesOrNoQuestion
                                        name={IntroFormField.erSelvstendigNæringsdrivende}
                                        description="Foretaket må ha vært registert i Brønnøysundregisteret før 1. mars for at du kan trykke ja her"
                                        legend={'Er du selvstendig næringsdrivende med ENK, DA/ANS?'}
                                    />
                                </FormBlock>
                            </>
                        )}
                        {isVisible(IntroFormField.selvstendigHarTaptInntektPgaKorona) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.selvstendigHarTaptInntektPgaKorona}
                                    legend={
                                        'Har du tapt inntekt som selvstendig næringsdrivende i perioden på grunn av koronasituasjonen?'
                                    }
                                    description="inntektstapet er det reelle tapet du har hatt i mars og april, ikke fremtige tap; det søker du om neste måned."
                                />
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.selvstendigFårDekketTapet) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.selvstendigFårDekketTapet}
                                    legend={
                                        'Får du allerede dekket inntektstapet som selvstendig næringsdrivende fra NAV?'
                                    }
                                />
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.erFrilanser) && (
                            <>
                                <Box margin="xxl">
                                    <Undertittel>Frilanser</Undertittel>
                                </Box>

                                <FormBlock margin="l">
                                    <FormComponent.YesOrNoQuestion
                                        name={IntroFormField.erFrilanser}
                                        legend={'Er du frilanser pr. NAVs definisjon?'}
                                        description={
                                            <>
                                                Det vil si en ikke ansatt lønnsmottaker. Du kan sjekke om oppdragene
                                                dine er registert som frilansoppdrag, på{' '}
                                                <Lenke
                                                    href="https://skatt.skatteetaten.no/web/innsynamelding/"
                                                    target="_blank">
                                                    skatteetaten sine nettsider
                                                </Lenke>{' '}
                                                (åpnes i nytt vindu).
                                            </>
                                        }
                                    />
                                </FormBlock>
                            </>
                        )}
                        {isVisible(IntroFormField.frilanserHarTaptInntektPgaKorona) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.frilanserHarTaptInntektPgaKorona}
                                    legend={
                                        'Har du tapt inntekt som frilanser i perioden på grunn av koronasituasjonen?'
                                    }
                                />
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.frilanserFårDekketTapet) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.frilanserFårDekketTapet}
                                    legend={'Får du allerede dekket inntektstapet som frilanser fra NAV?'}
                                />
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.harAlleredeSøkt) && (
                            <>
                                <Box margin="xxl">
                                    <Undertittel>Har du allerede søkt?</Undertittel>
                                </Box>
                                <FormBlock margin="l">
                                    <FormComponent.YesOrNoQuestion
                                        name={IntroFormField.harAlleredeSøkt}
                                        legend={
                                            'Har du allerede søkt (og/eller venter på svar) fra NAV for det samme inntektstapet du ønsker å søke om i denne søknaden??'
                                        }
                                    />
                                </FormBlock>

                                {values.harAlleredeSøkt === YesOrNo.YES && (
                                    <FormBlock>
                                        <AlertStripeInfo>
                                            Du kan kun få dekket inntektstapet en gang. Du kan velge å{' '}
                                            <ul>
                                                <li>Ikke søke på denne ytelsen</li>
                                                <li>Trekke tilbake den andre søknaden og søke på denne ytelsen</li>
                                            </ul>
                                        </AlertStripeInfo>
                                    </FormBlock>
                                )}
                            </>
                        )}
                        {isVisible(IntroFormField.vilFortsetteTilSøknad) && (
                            <FormBlock>
                                <FormComponent.YesOrNoQuestion
                                    name={IntroFormField.vilFortsetteTilSøknad}
                                    legend={'Vil du likevel gå videre til søknaden?'}
                                />
                            </FormBlock>
                        )}

                        {areAllQuestionsAnswered() && alderIsOk && !selvstendigIsOk && !frilanserIsOk && (
                            <FormBlock>
                                <AlertStripeAdvarsel>
                                    Du kan hverken søke som selvstendig næringsdrivende eller frilanser
                                </AlertStripeAdvarsel>
                            </FormBlock>
                        )}

                        {canContinueToApplication && (
                            <FormBlock>
                                <CounsellorPanel>
                                    Basert på hva du har svart, kan du søke på vedtak 10 som{' '}
                                    <ul>
                                        {selvstendigIsOk ? <li>Selvstendig næringsdrivende</li> : null}
                                        {frilanserIsOk ? <li>Frilanser</li> : null}
                                    </ul>
                                </CounsellorPanel>
                            </FormBlock>
                        )}
                    </FormComponent.Form>
                );
            }}
        />
    );
};

export default IntroForm;

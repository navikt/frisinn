import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import Lenke from 'nav-frontend-lenker';
import { Undertittel, Element } from 'nav-frontend-typografi';
import DateRangeView from '../../../components/date-range-view/DateRangeView';
import ExpandableInfo from '../../../components/expandable-content/ExpandableInfo';
import { DateRange } from '../../../utils/dateUtils';
import { IntroFormData, IntroFormField, IntroFormQuestions } from './introFormConfig';
import introFormUtils from './introFormUtils';
import { hasValue } from '../../../validation/fieldValidations';

const FormComponent = getTypedFormComponents<IntroFormField, IntroFormData>();

const initialValues: Partial<IntroFormData> = {
    fødselsdato: undefined,
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
                    currentPeriode,
                });

                const alderIsOk = introFormUtils.birthdateIsValid(values.fødselsdato, currentPeriode);
                const selvstendigIsOk = introFormUtils.canApplyAsSelvstendig(values);
                const frilanserIsOk = introFormUtils.canApplyAsFrilanser(values);

                const harAlleredeSøktIsOk =
                    values.harAlleredeSøkt === YesOrNo.NO || values.vilFortsetteTilSøknad === YesOrNo.YES;

                const canContinueToApplication =
                    areAllQuestionsAnswered() && (selvstendigIsOk || frilanserIsOk) && alderIsOk && harAlleredeSøktIsOk;

                return (
                    <FormComponent.Form
                        includeValidationSummary={true}
                        includeButtons={canContinueToApplication}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        submitButtonLabel="Gå videre til søknaden">
                        {isVisible(IntroFormField.fødselsdato) && (
                            <>
                                <FormBlock margin="l">
                                    <FormComponent.DatePicker
                                        showYearSelector={true}
                                        name={IntroFormField.fødselsdato}
                                        label="Når er du født?"
                                        dayPickerProps={{ initialMonth: new Date(2000, 0, 1) }}
                                    />
                                </FormBlock>
                            </>
                        )}
                        {hasValue(values.fødselsdato) && !alderIsOk && (
                            <FormBlock>
                                <AlertStripeAdvarsel>
                                    Du må ha vært mellom fra 18 og 67 år i perioden{' '}
                                    <DateRangeView dateRange={currentPeriode} />
                                </AlertStripeAdvarsel>
                            </FormBlock>
                        )}
                        {isVisible(IntroFormField.erSelvstendigNæringsdrivende) && (
                            <>
                                <Box margin="xxl">
                                    <Undertittel className="sectionTitle">Selvstendig næringsdrivende</Undertittel>
                                </Box>

                                <FormBlock margin="l">
                                    <FormComponent.YesOrNoQuestion
                                        name={IntroFormField.erSelvstendigNæringsdrivende}
                                        legend={'Er du selvstendig næringsdrivende med ENK, DA/ANS?'}
                                        description={
                                            'Foretaket må ha vært registert i Brønnøysundregisteret før 1. mars 2020.'
                                        }
                                    />
                                </FormBlock>
                            </>
                        )}
                        {isVisible(IntroFormField.selvstendigHarTaptInntektPgaKorona) && (
                            <>
                                <FormBlock>
                                    <FormComponent.YesOrNoQuestion
                                        name={IntroFormField.selvstendigHarTaptInntektPgaKorona}
                                        legend={
                                            'Har du tapt inntekt som selvstendig næringsdrivende i perioden på grunn av koronasituasjonen?'
                                        }
                                        description={
                                            <ExpandableInfo title="Hva regnes som inntektstap?">
                                                Inntektstap er det reelle tapet du har hatt i perioden{' '}
                                                <strong>
                                                    <DateRangeView dateRange={currentPeriode} />
                                                </strong>
                                                , ikke fremtige tap; det søker du om neste måned.
                                            </ExpandableInfo>
                                        }
                                    />
                                </FormBlock>
                                {values.selvstendigHarTaptInntektPgaKorona === YesOrNo.NO && (
                                    <FormBlock>
                                        <AlertStripeInfo>
                                            <Element>Du kan ikke søke som selvstendig næringsdrivende</Element>
                                            Du må ha hatt inntektstap som selvstendig næringsdrivende på grunn av
                                            koronasituasjonen for å kunne søke om kompensasjon som selvstendig
                                            næringsdrivende.
                                        </AlertStripeInfo>
                                    </FormBlock>
                                )}
                            </>
                        )}
                        {isVisible(IntroFormField.selvstendigFårDekketTapet) && (
                            <>
                                <FormBlock>
                                    <FormComponent.YesOrNoQuestion
                                        name={IntroFormField.selvstendigFårDekketTapet}
                                        legend={
                                            'Får du allerede dekket inntektstapet som selvstendig næringsdrivende fra NAV?'
                                        }
                                        description={
                                            <ExpandableInfo title="Hva vil dette si?">
                                                Omnis aut, incidunt perferendis iure perspiciatis quibusdam beatae neque
                                                libero culpa quos.
                                            </ExpandableInfo>
                                        }
                                    />
                                </FormBlock>
                                {values.selvstendigFårDekketTapet === YesOrNo.YES && (
                                    <FormBlock>
                                        <AlertStripeInfo>
                                            <Element>Du kan ikke søke som selvstendig næringsdrivende</Element>
                                            Dersom du allerede får dekket tapet, kan du ikke søke om kompensasjon som
                                            selvstendig næringsdrivende.
                                        </AlertStripeInfo>
                                    </FormBlock>
                                )}
                                {values.selvstendigFårDekketTapet === YesOrNo.NO && (
                                    <FormBlock>
                                        <AlertStripeInfo>
                                            <Element>Du kan søke som selvstendig næringsdrivende</Element>
                                        </AlertStripeInfo>
                                    </FormBlock>
                                )}
                            </>
                        )}
                        {isVisible(IntroFormField.erFrilanser) && (
                            <Box>
                                <Box margin="xxl">
                                    <Undertittel className="sectionTitle">Frilanser</Undertittel>
                                </Box>

                                <FormBlock margin="l">
                                    <FormComponent.YesOrNoQuestion
                                        name={IntroFormField.erFrilanser}
                                        legend={'Er du frilanser pr. NAVs definisjon?'}
                                        description={
                                            <ExpandableInfo
                                                title="Hva er NAVs definisjon på frilanser?"
                                                closeTitle={'Skjul info'}>
                                                Det vil si en ikke ansatt lønnsmottaker. Du kan sjekke om oppdragene
                                                dine er registert som frilansoppdrag, på{' '}
                                                <Lenke
                                                    href="https://www.skatteetaten.no/skjema/mine-inntekter-og-arbeidsforhold/"
                                                    target="_blank">
                                                    skatteetaten sine nettsider
                                                </Lenke>{' '}
                                                (åpnes i nytt vindu).
                                            </ExpandableInfo>
                                        }
                                    />
                                </FormBlock>
                            </Box>
                        )}
                        {isVisible(IntroFormField.frilanserHarTaptInntektPgaKorona) && (
                            <>
                                <FormBlock>
                                    <FormComponent.YesOrNoQuestion
                                        name={IntroFormField.frilanserHarTaptInntektPgaKorona}
                                        legend={
                                            'Har du tapt inntekt som frilanser i perioden på grunn av koronasituasjonen?'
                                        }
                                    />
                                </FormBlock>
                                {values.frilanserHarTaptInntektPgaKorona === YesOrNo.NO && (
                                    <FormBlock>
                                        <AlertStripeInfo>
                                            <Element>Du kan ikke søke som frilanser</Element>
                                            Du må ha hatt inntektstap som selvstendig næringsdrivende på grunn av
                                            koronasituasjonen for å kunne søke om kompensasjon som frilanser.
                                        </AlertStripeInfo>
                                    </FormBlock>
                                )}
                            </>
                        )}
                        {isVisible(IntroFormField.frilanserFårDekketTapet) && (
                            <>
                                <FormBlock>
                                    <FormComponent.YesOrNoQuestion
                                        name={IntroFormField.frilanserFårDekketTapet}
                                        legend={'Får du allerede dekket inntektstapet som frilanser fra NAV?'}
                                    />
                                </FormBlock>
                                {values.frilanserFårDekketTapet === YesOrNo.YES && (
                                    <FormBlock>
                                        <AlertStripeInfo>
                                            <Element>Du kan ikke søke som frilanser</Element>
                                            Dersom du allerede får dekket tapet, kan du ikke søke om kompensasjon som
                                            frilanser.
                                        </AlertStripeInfo>
                                    </FormBlock>
                                )}
                                {values.frilanserFårDekketTapet === YesOrNo.NO && (
                                    <FormBlock>
                                        <AlertStripeInfo>
                                            <Element>Du kan søke som frilanser</Element>
                                        </AlertStripeInfo>
                                    </FormBlock>
                                )}
                            </>
                        )}

                        {isVisible(IntroFormField.harAlleredeSøkt) && (
                            <>
                                <Box margin="xxl">
                                    <Undertittel className="sectionTitle">Har du allerede søkt?</Undertittel>
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

                        {canContinueToApplication && (
                            <FormBlock>
                                <EkspanderbartPanel tittel="Sjekkliste: ting du trenger for å fylle ut søknaden">
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab iste nemo quas sequi
                                    cum corporis id
                                    <ul>
                                        <li>inventore laudantium</li>
                                        <li>repellendus odit distinctio delectus animi tempora</li>
                                        <li>officia reiciendis et error veniam possimus</li>
                                    </ul>
                                </EkspanderbartPanel>
                            </FormBlock>
                        )}
                    </FormComponent.Form>
                );
            }}
        />
    );
};

export default IntroForm;

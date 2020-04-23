import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { AlertStripeInfo, AlertStripeSuksess } from 'nav-frontend-alertstriper';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import Lenke from 'nav-frontend-lenker';
import { Undertittel, Element } from 'nav-frontend-typografi';
import DateRangeView from '../../../components/date-range-view/DateRangeView';
import ExpandableInfo from '../../../components/expandable-content/ExpandableInfo';
import { DateRange, getSisteGyldigeDagForInntektstapIPeriode } from '../../../utils/dateUtils';
import { IntroFormData, IntroFormField, IntroFormQuestions } from './introFormConfig';
import introFormUtils from './introFormUtils';
import { hasValue } from '../../../validation/fieldValidations';
import DateView from '../../../components/date-view/DateView';
import moment from 'moment';
import StopMessage from '../StopMessage';
import Info from './IntroFormInfo';
import IntroFormQuestion from '../IntroFormQuestion';

const FormComponent = getTypedFormComponents<IntroFormField, IntroFormData>();

interface Props {
    soknadsperiode: DateRange;
    onValidSubmit: (values: IntroFormData) => void;
}
const IntroForm = ({ onValidSubmit, soknadsperiode }: Props) => {
    const intl = useIntl();
    return (
        <FormComponent.FormikWrapper
            onSubmit={onValidSubmit}
            initialValues={{}}
            renderForm={({ values }) => {
                const { isVisible, areAllQuestionsAnswered } = IntroFormQuestions.getVisbility({
                    ...values,
                    soknadsperiode,
                });

                const FormQuestion = IntroFormQuestion(values, soknadsperiode);

                const alderIsOk = introFormUtils.birthdateIsValid(values.fødselsdato, soknadsperiode);
                const selvstendigIsOk = introFormUtils.canApplyAsSelvstendig(values);
                const frilanserIsOk = introFormUtils.canApplyAsFrilanser(values);

                const harAlleredeSøktIsOk =
                    values.harAlleredeSøkt === YesOrNo.NO || values.vilFortsetteTilSøknad === YesOrNo.YES;

                const sisteGyldigeDagForInntektstap: Date = getSisteGyldigeDagForInntektstapIPeriode(soknadsperiode);

                const canContinueToSoknad =
                    areAllQuestionsAnswered() && (selvstendigIsOk || frilanserIsOk) && alderIsOk && harAlleredeSøktIsOk;

                return (
                    <FormComponent.Form
                        includeValidationSummary={true}
                        includeButtons={canContinueToSoknad}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        submitButtonLabel="Gå videre til søknaden">
                        <FormQuestion question={IntroFormField.fødselsdato}>
                            <FormComponent.DatePicker
                                name={IntroFormField.fødselsdato}
                                label="Når er du født?"
                                showYearSelector={true}
                                dayPickerProps={{ initialMonth: new Date(1995, 0, 1) }}
                                dateLimitations={{ maksDato: moment.utc().subtract(17, 'years').toDate() }}
                            />
                            {hasValue(values.fødselsdato) && !alderIsOk && (
                                <StopMessage>
                                    <Info.ikkeGyldigAlder periode={soknadsperiode} />
                                </StopMessage>
                            )}
                        </FormQuestion>
                        {isVisible(IntroFormField.erSelvstendigNæringsdrivende) && (
                            <Box margin="xxl">
                                <Undertittel className="sectionTitle">Selvstendig næringsdrivende</Undertittel>
                            </Box>
                        )}
                        <FormQuestion question={IntroFormField.erSelvstendigNæringsdrivende}>
                            <FormComponent.YesOrNoQuestion
                                name={IntroFormField.erSelvstendigNæringsdrivende}
                                legend={'Er du selvstendig næringsdrivende med ENK, DA/ANS?'}
                                description={'Foretaket må ha vært registert i Brønnøysundregisteret før 1. mars 2020.'}
                            />
                        </FormQuestion>
                        <FormQuestion question={IntroFormField.selvstendigHarTaptInntektPgaKorona}>
                            <FormComponent.YesOrNoQuestion
                                name={IntroFormField.selvstendigHarTaptInntektPgaKorona}
                                legend={
                                    'Har du tapt inntekt som selvstendig næringsdrivende i perioden på grunn av koronasituasjonen?'
                                }
                                description={
                                    <ExpandableInfo title="Hva regnes som inntektstap?">
                                        Inntektstap er det reelle tapet du har hatt i perioden{' '}
                                        <strong>
                                            <DateRangeView dateRange={soknadsperiode} />
                                        </strong>
                                        , ikke fremtige tap; det søker du om neste måned.
                                    </ExpandableInfo>
                                }
                            />
                            {values.selvstendigHarTaptInntektPgaKorona === YesOrNo.NO && (
                                <StopMessage>
                                    <Info.selvstendigIkkeTapPgaKorona />
                                </StopMessage>
                            )}
                        </FormQuestion>
                        <FormQuestion question={IntroFormField.selvstendigInntektstapStartetFørFrist}>
                            <FormComponent.YesOrNoQuestion
                                name={IntroFormField.selvstendigInntektstapStartetFørFrist}
                                legend={
                                    <span>
                                        Startet inntektstapet ditt som selvstendig næringsdrivende før{' '}
                                        <DateView date={sisteGyldigeDagForInntektstap} />?
                                    </span>
                                }
                                description={
                                    <ExpandableInfo title="Hva er startdato for inntektstap?">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis laudantium
                                        sapiente illum perferendis distinctio, praesentium, culpa repellendus nulla
                                        corporis commodi explicabo! Quidem quibusdam vitae repellendus voluptate
                                        similique corrupti atque! Debitis!
                                    </ExpandableInfo>
                                }
                            />
                            {values.selvstendigInntektstapStartetFørFrist === YesOrNo.NO && (
                                <StopMessage>
                                    <Info.selvstendigForSentInntektstap />
                                </StopMessage>
                            )}
                        </FormQuestion>
                        <FormQuestion question={IntroFormField.selvstendigFårDekketTapet}>
                            <FormComponent.YesOrNoQuestion
                                name={IntroFormField.selvstendigFårDekketTapet}
                                legend={'Får du allerede dekket inntektstapet som selvstendig næringsdrivende fra NAV?'}
                                description={
                                    <ExpandableInfo title="Hva vil dette si?">
                                        Omnis aut, incidunt perferendis iure perspiciatis quibusdam beatae neque libero
                                        culpa quos.
                                    </ExpandableInfo>
                                }
                            />
                            {values.selvstendigFårDekketTapet === YesOrNo.YES && (
                                <StopMessage>
                                    <Info.selvstendigFårDekketTapet />
                                </StopMessage>
                            )}
                        </FormQuestion>
                        {values.selvstendigFårDekketTapet === YesOrNo.NO && (
                            <Box margin="l">
                                <AlertStripeSuksess>
                                    <Element>Du kan søke som selvstendig næringsdrivende</Element>
                                </AlertStripeSuksess>
                            </Box>
                        )}
                        {isVisible(IntroFormField.erFrilanser) && (
                            <Box margin="xxl">
                                <Undertittel className="sectionTitle">Frilanser</Undertittel>
                            </Box>
                        )}
                        <FormQuestion question={IntroFormField.erFrilanser}>
                            <FormComponent.YesOrNoQuestion
                                name={IntroFormField.erFrilanser}
                                legend={'Er du frilanser pr. NAVs definisjon?'}
                                description={
                                    <ExpandableInfo
                                        title="Hva er NAVs definisjon på frilanser?"
                                        closeTitle={'Skjul info'}>
                                        Det vil si en ikke ansatt lønnsmottaker. Du kan sjekke om oppdragene dine er
                                        registert som frilansoppdrag, på{' '}
                                        <Lenke
                                            href="https://www.skatteetaten.no/skjema/mine-inntekter-og-arbeidsforhold/"
                                            target="_blank">
                                            skatteetaten sine nettsider
                                        </Lenke>{' '}
                                        (åpnes i nytt vindu).
                                    </ExpandableInfo>
                                }
                            />
                        </FormQuestion>
                        <FormQuestion question={IntroFormField.frilanserHarTaptInntektPgaKorona}>
                            <FormComponent.YesOrNoQuestion
                                name={IntroFormField.frilanserHarTaptInntektPgaKorona}
                                legend={'Har du tapt inntekt som frilanser i perioden på grunn av koronasituasjonen?'}
                            />
                            {values.frilanserHarTaptInntektPgaKorona === YesOrNo.NO && (
                                <StopMessage>
                                    <Info.frilanserIkkeTapPgaKorona />
                                </StopMessage>
                            )}
                        </FormQuestion>
                        <FormQuestion question={IntroFormField.frilanserInntektstapStartetFørFrist}>
                            <FormComponent.YesOrNoQuestion
                                name={IntroFormField.frilanserInntektstapStartetFørFrist}
                                legend={
                                    <span>
                                        Startet inntektstapet ditt som frilanser før{' '}
                                        <DateView date={sisteGyldigeDagForInntektstap} />?
                                    </span>
                                }
                                description={
                                    <ExpandableInfo title="Hva er startdato for inntektstap?">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis laudantium
                                        sapiente illum perferendis distinctio, praesentium, culpa repellendus nulla
                                        corporis commodi explicabo! Quidem quibusdam vitae repellendus voluptate
                                        similique corrupti atque! Debitis!
                                    </ExpandableInfo>
                                }
                            />
                            {values.frilanserInntektstapStartetFørFrist === YesOrNo.NO && (
                                <StopMessage>
                                    <Info.frilanserForSentInntektstap />
                                </StopMessage>
                            )}
                        </FormQuestion>
                        <FormQuestion question={IntroFormField.frilanserFårDekketTapet}>
                            <FormComponent.YesOrNoQuestion
                                name={IntroFormField.frilanserFårDekketTapet}
                                legend={'Får du allerede dekket inntektstapet som frilanser fra NAV?'}
                            />
                            {values.frilanserFårDekketTapet === YesOrNo.YES && (
                                <StopMessage>
                                    <Info.frilanserFårDekketTapet />
                                </StopMessage>
                            )}
                            {values.frilanserFårDekketTapet === YesOrNo.NO && (
                                <Box margin="l">
                                    <AlertStripeSuksess>
                                        <Element>Du kan søke som frilanser</Element>
                                    </AlertStripeSuksess>
                                </Box>
                            )}
                        </FormQuestion>
                        {isVisible(IntroFormField.harAlleredeSøkt) && (
                            <Box margin="xxl">
                                <Undertittel className="sectionTitle">Har du allerede søkt?</Undertittel>
                            </Box>
                        )}
                        <FormQuestion question={IntroFormField.harAlleredeSøkt}>
                            <FormComponent.YesOrNoQuestion
                                name={IntroFormField.harAlleredeSøkt}
                                legend={
                                    'Har du allerede søkt (og/eller venter på svar) fra NAV for det samme inntektstapet du ønsker å søke om i denne søknaden??'
                                }
                            />
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
                        </FormQuestion>
                        <FormQuestion question={IntroFormField.vilFortsetteTilSøknad}>
                            <FormComponent.YesOrNoQuestion
                                name={IntroFormField.vilFortsetteTilSøknad}
                                legend={'Vil du likevel gå videre til søknaden?'}
                            />
                        </FormQuestion>
                        {values.erFrilanser === YesOrNo.NO && values.erSelvstendigNæringsdrivende === YesOrNo.NO && (
                            <StopMessage>
                                Du må velge om du er selvstendig næringsdrivende og/eller frilanser.
                            </StopMessage>
                        )}
                        {canContinueToSoknad && (
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

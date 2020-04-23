import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { AlertStripeAdvarsel, AlertStripeInfo, AlertStripeSuksess } from 'nav-frontend-alertstriper';
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

const FormComponent = getTypedFormComponents<IntroFormField, IntroFormData>();

interface Props {
    currentPeriode: DateRange;
    onValidSubmit: (values: IntroFormData) => void;
}
const IntroForm = ({ onValidSubmit, currentPeriode }: Props) => {
    const intl = useIntl();

    return (
        <FormComponent.FormikWrapper
            onSubmit={onValidSubmit}
            initialValues={{}}
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

                const sisteGyldigeDagForInntektstap: Date = getSisteGyldigeDagForInntektstapIPeriode(currentPeriode);

                const canContinueToSoknad =
                    areAllQuestionsAnswered() && (selvstendigIsOk || frilanserIsOk) && alderIsOk && harAlleredeSøktIsOk;

                return (
                    <FormComponent.Form
                        includeValidationSummary={true}
                        includeButtons={canContinueToSoknad}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        submitButtonLabel="Gå videre til søknaden">
                        {isVisible(IntroFormField.fødselsdato) && (
                            <>
                                <FormBlock margin="l">
                                    <FormComponent.DatePicker
                                        showYearSelector={true}
                                        name={IntroFormField.fødselsdato}
                                        label="Når er du født?"
                                        dayPickerProps={{ initialMonth: new Date(1995, 0, 1) }}
                                        dateLimitations={{ maksDato: moment.utc().subtract(17, 'years').toDate() }}
                                    />
                                </FormBlock>
                            </>
                        )}
                        {hasValue(values.fødselsdato) && !alderIsOk && (
                            <StopMessage>
                                <Info.ikkeGyldigAlder periode={currentPeriode} />
                            </StopMessage>
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
                                    <StopMessage>
                                        <Info.selvstendigIkkeTapPgaKorona />
                                    </StopMessage>
                                )}
                            </>
                        )}
                        {isVisible(IntroFormField.selvstendigInntektstapStartetFørFrist) && (
                            <>
                                <FormBlock>
                                    <FormComponent.YesOrNoQuestion
                                        name={IntroFormField.selvstendigInntektstapStartetFørFrist}
                                        legend={
                                            <span>
                                                Startet inntektstapet ditt før{' '}
                                                <DateView date={sisteGyldigeDagForInntektstap} />?
                                            </span>
                                        }
                                        description={
                                            <ExpandableInfo title="Hva er startdato for inntektstap?">
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
                                                laudantium sapiente illum perferendis distinctio, praesentium, culpa
                                                repellendus nulla corporis commodi explicabo! Quidem quibusdam vitae
                                                repellendus voluptate similique corrupti atque! Debitis!
                                            </ExpandableInfo>
                                        }
                                    />
                                </FormBlock>
                                {values.selvstendigInntektstapStartetFørFrist === YesOrNo.NO && (
                                    <StopMessage>
                                        <Info.selvstendigForSentInntektstap />
                                    </StopMessage>
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
                                    <StopMessage>
                                        <Info.selvstendigFårDekketTapet />
                                    </StopMessage>
                                )}
                                {values.selvstendigFårDekketTapet === YesOrNo.NO && (
                                    <FormBlock>
                                        <AlertStripeSuksess>
                                            <Element>Du kan søke som selvstendig næringsdrivende</Element>
                                        </AlertStripeSuksess>
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
                                    <StopMessage>
                                        <Info.frilanserIkkeTapPgaKorona />
                                    </StopMessage>
                                )}
                            </>
                        )}
                        {isVisible(IntroFormField.frilanserInntektstapStartetFørFrist) && (
                            <>
                                <FormBlock>
                                    <FormComponent.YesOrNoQuestion
                                        name={IntroFormField.frilanserInntektstapStartetFørFrist}
                                        legend={
                                            <span>
                                                Startet inntektstapet ditt før{' '}
                                                <DateView date={sisteGyldigeDagForInntektstap} />?
                                            </span>
                                        }
                                        description={
                                            <ExpandableInfo title="Hva er startdato for inntektstap?">
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
                                                laudantium sapiente illum perferendis distinctio, praesentium, culpa
                                                repellendus nulla corporis commodi explicabo! Quidem quibusdam vitae
                                                repellendus voluptate similique corrupti atque! Debitis!
                                            </ExpandableInfo>
                                        }
                                    />
                                </FormBlock>
                                {values.frilanserInntektstapStartetFørFrist === YesOrNo.NO && (
                                    <StopMessage>
                                        <Info.frilanserForSentInntektstap />
                                    </StopMessage>
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
                                    <StopMessage>
                                        <Info.frilanserFårDekketTapet />
                                    </StopMessage>
                                )}
                                {values.frilanserFårDekketTapet === YesOrNo.NO && (
                                    <FormBlock>
                                        <AlertStripeSuksess>
                                            <Element>Du kan søke som frilanser</Element>
                                        </AlertStripeSuksess>
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

                        {values.erFrilanser === YesOrNo.NO && values.erSelvstendigNæringsdrivende === YesOrNo.NO && (
                            <FormBlock>
                                <AlertStripeAdvarsel>Då må velge</AlertStripeAdvarsel>
                            </FormBlock>
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

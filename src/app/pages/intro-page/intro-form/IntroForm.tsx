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
import ExpandableInfo from '../../../components/expandable-content/ExpandableInfo';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';

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

const renderSelvstendigRejection = ({
    selvstendigFårDekketTapet,
    selvstendigHarTaptInntektPgaKorona,
}: IntroFormData): string | null => {
    if (selvstendigHarTaptInntektPgaKorona === YesOrNo.NO) {
        return 'Som selvstendig næringsdrivende må du ha hatt inntektstap på grunn av korona-pandemien for å søke om kompensasjon her.';
    }
    if (selvstendigFårDekketTapet === YesOrNo.YES) {
        return 'Som selvstendig næringsdrivende kan du ikke søke om kompensasjon her når du allerede får dekket inntektstapet.';
    }
    return null;
};
const renderFrilanserRejection = ({
    frilanserFårDekketTapet,
    frilanserHarTaptInntektPgaKorona,
}: IntroFormData): string | null => {
    if (frilanserHarTaptInntektPgaKorona === YesOrNo.NO) {
        return 'Som frilanser du ha hatt inntektstap på grunn av korona-pandemien for å søke om kompensasjon her.';
    }
    if (frilanserFårDekketTapet === YesOrNo.YES) {
        return 'Som frilanser kan du ikke søke om kompensasjon her når du allerede får dekket inntektstapet.';
    }
    return null;
};

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
                                        legend={'Er du selvstendig næringsdrivende med ENK, DA/ANS?'}
                                        description={
                                            'Foretaket må ha vært registert i Brønnøysundregisteret før 1. mars for at du kan trykke ja her'
                                        }
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
                                    info="inntektstapet er det reelle tapet du har hatt i mars og april, ikke fremtige tap; det søker du om neste måned."
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
                            <>
                                <FormBlock>
                                    <CounsellorPanel>
                                        Basert på hva du har svart, kan du søke om kompensasjon for tapt inntekt som{' '}
                                        {selvstendigIsOk ? <strong>selvstendig næringsdrivende</strong> : null}
                                        {selvstendigIsOk && frilanserIsOk ? <> og </> : null}
                                        {frilanserIsOk ? <strong>frilanser</strong> : null}.
                                        {values.erSelvstendigNæringsdrivende === YesOrNo.YES && !selvstendigIsOk ? (
                                            <p>{renderSelvstendigRejection(values)}</p>
                                        ) : null}
                                        {values.erFrilanser === YesOrNo.YES && !frilanserIsOk ? (
                                            <p>{renderFrilanserRejection(values)}</p>
                                        ) : null}
                                    </CounsellorPanel>
                                </FormBlock>
                                <FormBlock>
                                    <EkspanderbartPanel tittel="Sjekkliste: ting du trenger for å fylle ut søknaden">
                                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab iste nemo quas
                                        sequi cum corporis id
                                        <ul>
                                            <li>inventore laudantium</li>
                                            <li>repellendus odit distinctio delectus animi tempora</li>
                                            <li>officia reiciendis et error veniam possimus</li>
                                        </ul>
                                    </EkspanderbartPanel>
                                </FormBlock>
                            </>
                        )}
                    </FormComponent.Form>
                );
            }}
        />
    );
};

export default IntroForm;

import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import moment from 'moment';
import DateView from '../../../components/date-view/DateView';
import { DateRange, getSisteGyldigeDagForInntektstapIPeriode } from '../../../utils/dateUtils';
import { hasValue } from '../../../validation/fieldValidations';
import FormSection from '../FormSection';
import InfoMessage from '../../../components/InfoMessage';
import IntroCheckList from '../IntroCheckList';
import FormQuestion from '../IntroFormQuestion';
import StopMessage from '../../../components/StopMessage';
import SuksessMessage from '../../../components/SuksessMessage';
import { IntroFormData, IntroFormField, IntroFormQuestions } from './introFormConfig';
import Info from './IntroFormInfo';
import introFormUtils from './introFormUtils';
import { QuestionVisibilityContext } from '../../../context/QuestionVisibilityContext';

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
                const visibility = IntroFormQuestions.getVisbility({
                    ...values,
                    soknadsperiode,
                });
                const { isVisible, areAllQuestionsAnswered } = visibility;

                const {
                    fødselsdato,
                    harAlleredeSøkt,
                    vilFortsetteTilSøknad,
                    erFrilanser,
                    erSelvstendigNæringsdrivende,
                    selvstendigFårDekketTapet,
                    selvstendigHarTaptInntektPgaKorona,
                    selvstendigInntektstapStartetFørFrist,
                    frilanserFårDekketTapet,
                    frilanserInntektstapStartetFørFrist,
                    frilanserHarTaptInntektPgaKorona,
                } = values;

                const alderIsOk = introFormUtils.birthdateIsValid(fødselsdato, soknadsperiode);
                const selvstendigIsOk = introFormUtils.canApplyAsSelvstendig(values);
                const frilanserIsOk = introFormUtils.canApplyAsFrilanser(values);
                const harAlleredeSøktIsOk = harAlleredeSøkt === YesOrNo.NO || vilFortsetteTilSøknad === YesOrNo.YES;

                const sisteGyldigeDagForInntektstap: Date = getSisteGyldigeDagForInntektstapIPeriode(soknadsperiode);

                const canContinueToSoknad =
                    areAllQuestionsAnswered() && (selvstendigIsOk || frilanserIsOk) && alderIsOk && harAlleredeSøktIsOk;

                return (
                    <FormComponent.Form
                        includeValidationSummary={true}
                        includeButtons={canContinueToSoknad}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        submitButtonLabel="Gå videre til søknaden">
                        <QuestionVisibilityContext.Provider value={{ visibility }}>
                            <FormSection>
                                <FormQuestion question={IntroFormField.fødselsdato}>
                                    <FormComponent.DatePicker
                                        name={IntroFormField.fødselsdato}
                                        label="Når er du født?"
                                        showYearSelector={true}
                                        dayPickerProps={{ initialMonth: new Date(1995, 0, 1) }}
                                        dateLimitations={{ maksDato: moment.utc().subtract(17, 'years').toDate() }}
                                    />
                                    {hasValue(fødselsdato) && !alderIsOk && (
                                        <StopMessage>
                                            <Info.ikkeGyldigAlder periode={soknadsperiode} />
                                        </StopMessage>
                                    )}
                                </FormQuestion>
                            </FormSection>

                            {isVisible(IntroFormField.erSelvstendigNæringsdrivende) && (
                                <FormSection title="Selvstendig næringsdrivende">
                                    <FormQuestion question={IntroFormField.erSelvstendigNæringsdrivende}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.erSelvstendigNæringsdrivende}
                                            legend={'Er du selvstendig næringsdrivende med ENK, DA/ANS?'}
                                            description={
                                                'Foretaket må ha vært registert i Brønnøysundregisteret før 1. mars 2020.'
                                            }
                                        />
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.selvstendigHarTaptInntektPgaKorona}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.selvstendigHarTaptInntektPgaKorona}
                                            legend={
                                                'Har du tapt inntekt som selvstendig næringsdrivende i perioden på grunn av koronasituasjonen?'
                                            }
                                            description={
                                                <Info.hvaRegnesSomInntektstap soknadsperiode={soknadsperiode} />
                                            }
                                        />
                                        {selvstendigHarTaptInntektPgaKorona === YesOrNo.NO && (
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
                                            description={<Info.hvaErStartdatoForInntektstap />}
                                        />
                                        {selvstendigInntektstapStartetFørFrist === YesOrNo.NO && (
                                            <StopMessage>
                                                <Info.selvstendigForSentInntektstap />
                                            </StopMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.selvstendigFårDekketTapet}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.selvstendigFårDekketTapet}
                                            legend={
                                                'Får du allerede dekket inntektstapet som selvstendig næringsdrivende fra NAV?'
                                            }
                                            description={<Info.fårDekketTapetForklaring />}
                                        />
                                        {selvstendigFårDekketTapet === YesOrNo.YES && (
                                            <StopMessage>
                                                <Info.selvstendigFårDekketTapet />
                                            </StopMessage>
                                        )}
                                    </FormQuestion>
                                    {selvstendigFårDekketTapet === YesOrNo.NO && (
                                        <SuksessMessage>Du kan søke som selvstendig næringsdrivende</SuksessMessage>
                                    )}
                                </FormSection>
                            )}
                            {isVisible(IntroFormField.erFrilanser) && (
                                <FormSection title="Frilanser">
                                    <FormQuestion question={IntroFormField.erFrilanser}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.erFrilanser}
                                            legend={'Er du frilanser pr. NAVs definisjon?'}
                                            description={<Info.frilanserNAVsDefinisjon />}
                                        />
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.frilanserHarTaptInntektPgaKorona}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.frilanserHarTaptInntektPgaKorona}
                                            legend={
                                                'Har du tapt inntekt som frilanser i perioden på grunn av koronasituasjonen?'
                                            }
                                        />
                                        {frilanserHarTaptInntektPgaKorona === YesOrNo.NO && (
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
                                            description={<Info.hvaErStartdatoForInntektstap />}
                                        />
                                        {frilanserInntektstapStartetFørFrist === YesOrNo.NO && (
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
                                        {frilanserFårDekketTapet === YesOrNo.YES && (
                                            <StopMessage>
                                                <Info.frilanserFårDekketTapet />
                                            </StopMessage>
                                        )}
                                        {frilanserFårDekketTapet === YesOrNo.NO && (
                                            <SuksessMessage>Du kan søke som frilanser</SuksessMessage>
                                        )}
                                    </FormQuestion>
                                </FormSection>
                            )}

                            {isVisible(IntroFormField.harAlleredeSøkt) && (
                                <FormSection title="Har du allerede søkt?">
                                    <FormQuestion question={IntroFormField.harAlleredeSøkt}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.harAlleredeSøkt}
                                            legend={
                                                'Har du allerede søkt (og/eller venter på svar) fra NAV for det samme inntektstapet du ønsker å søke om i denne søknaden??'
                                            }
                                        />
                                        {harAlleredeSøkt === YesOrNo.YES && (
                                            <InfoMessage>
                                                <Info.harAlleredeSøkt />
                                            </InfoMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.vilFortsetteTilSøknad}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.vilFortsetteTilSøknad}
                                            legend={'Vil du likevel gå videre til søknaden?'}
                                        />
                                    </FormQuestion>
                                </FormSection>
                            )}

                            {erFrilanser === YesOrNo.NO && erSelvstendigNæringsdrivende === YesOrNo.NO && (
                                <StopMessage>
                                    <Info.ikkeValgtSelvstendigEllerFrilanser />
                                </StopMessage>
                            )}
                            {erFrilanser === YesOrNo.NO &&
                                erSelvstendigNæringsdrivende === YesOrNo.YES &&
                                !selvstendigIsOk && (
                                    <StopMessage>
                                        <Info.selvstendigIkkeOkOgErIkkeFrilanser />
                                    </StopMessage>
                                )}
                            {canContinueToSoknad && (
                                <FormBlock>
                                    <IntroCheckList />
                                </FormBlock>
                            )}
                        </QuestionVisibilityContext.Provider>
                    </FormComponent.Form>
                );
            }}
        />
    );
};

export default IntroForm;

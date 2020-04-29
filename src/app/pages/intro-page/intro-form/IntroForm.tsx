import React from 'react';
import { useIntl } from 'react-intl';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import moment from 'moment';
import InfoMessage from '../../../components/info-message/InfoMessage';
import StopMessage from '../../../components/stop-message/StopMessage';
import SuksessMessage from '../../../components/suksess-message/SuksessMessage';
import { QuestionVisibilityContext } from '../../../context/QuestionVisibilityContext';
import { DateRange, getSisteGyldigeDagForInntektstapIPeriode } from '../../../utils/dateUtils';
import { hasValue } from '../../../validation/fieldValidations';
import FormSection from '../FormSection';
import { IntroFormData, IntroFormField, IntroFormQuestions } from './introFormConfig';
import Info from './IntroFormInfo';
import FormQuestion from './IntroFormQuestion';
import introFormUtils from './introFormUtils';
import { IntroResultProps } from '../IntroPage';
import { introFormText } from './introFormTexts';

const FormComponent = getTypedFormComponents<IntroFormField, IntroFormData>();

interface Props {
    soknadsperiode: DateRange;
    onValidSubmit: (values: IntroResultProps) => void;
}
const IntroForm = ({ onValidSubmit, soknadsperiode }: Props) => {
    const intl = useIntl();
    return (
        <FormComponent.FormikWrapper
            onSubmit={() => null}
            initialValues={{}}
            renderForm={({ values }) => {
                const visibility = IntroFormQuestions.getVisbility({
                    ...values,
                    soknadsperiode,
                });
                const { isVisible, areAllQuestionsAnswered } = visibility;

                const {
                    fødselsdato,
                    erFrilanser,
                    erSelvstendigNæringsdrivende,
                    selvstendigFårDekketTapet,
                    selvstendigHarTaptInntektPgaKorona,
                    selvstendigHarTattUtInntektFraSelskap,
                    selvstendigInntektstapStartetFørFrist,
                    selvstendigHarAlleredeSøkt,
                    frilanserFårDekketTapet,
                    frilanserInntektstapStartetFørFrist,
                    frilanserHarTaptInntektPgaKorona,
                    frilansHarAlleredeSøkt,
                    frilansVilFortsetteTilSøknad,
                    selvstendigVilFortsetteTilSøknad,
                } = values;

                const alderIsOk = introFormUtils.birthdateIsValid(fødselsdato, soknadsperiode);
                const selvstendigIsOk = introFormUtils.canApplyAsSelvstendig(values);
                const frilanserIsOk = introFormUtils.canApplyAsFrilanser(values);

                const sisteGyldigeDagForInntektstap: Date = getSisteGyldigeDagForInntektstapIPeriode(soknadsperiode);

                const canContinueToSoknad =
                    areAllQuestionsAnswered() && (selvstendigIsOk || frilanserIsOk) && alderIsOk;

                return (
                    <FormComponent.Form
                        includeValidationSummary={true}
                        includeButtons={canContinueToSoknad}
                        onValidSubmit={() => {
                            onValidSubmit({
                                canApplyAsFrilanser: frilanserIsOk,
                                canApplyAsSelvstending: selvstendigIsOk,
                            });
                        }}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        submitButtonLabel="Gå videre">
                        <QuestionVisibilityContext.Provider value={{ visibility }}>
                            <FormSection>
                                <FormQuestion question={IntroFormField.fødselsdato}>
                                    <FormComponent.DatePicker
                                        name={IntroFormField.fødselsdato}
                                        label={introFormText.fødselsdato}
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
                                            legend={introFormText.erSelvstendigNæringsdrivende}
                                        />
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.selvstendigHarTattUtInntektFraSelskap}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.selvstendigHarTattUtInntektFraSelskap}
                                            legend={introFormText.selvstendigHarTattUtInntektFraSelskap}
                                            description={<Info.selvstendigHvaMenesMedInntekt />}
                                        />
                                        {selvstendigHarTattUtInntektFraSelskap === YesOrNo.NO && (
                                            <StopMessage>
                                                <Info.selvstendigIkkeTattUtInntekt />
                                            </StopMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.selvstendigHarTaptInntektPgaKorona}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.selvstendigHarTaptInntektPgaKorona}
                                            legend={introFormText.selvstendigHarTaptInntektPgaKorona}
                                            description={<Info.hvaRegnesSomInntektstap />}
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
                                            legend={introFormText.selvstendigInntektstapStartetFørFrist(
                                                sisteGyldigeDagForInntektstap
                                            )}
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
                                            legend={introFormText.selvstendigFårDekketTapet}
                                            description={<Info.fårDekketTapetSomSelvstendigForklaring />}
                                        />
                                        {selvstendigFårDekketTapet === YesOrNo.YES && (
                                            <StopMessage>
                                                <Info.selvstendigFårDekketTapet />
                                            </StopMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.selvstendigHarAlleredeSøkt}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.selvstendigHarAlleredeSøkt}
                                            legend={introFormText.selvstendigHarAlleredeSøkt}
                                        />
                                        {selvstendigHarAlleredeSøkt === YesOrNo.YES && (
                                            <InfoMessage margin="l">
                                                <Info.harAlleredeSøkt />
                                            </InfoMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.selvstendigVilFortsetteTilSøknad}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.selvstendigVilFortsetteTilSøknad}
                                            legend={introFormText.selvstendigVilFortsetteTilSøknad}
                                        />
                                    </FormQuestion>

                                    {(selvstendigVilFortsetteTilSøknad === YesOrNo.YES ||
                                        selvstendigHarAlleredeSøkt === YesOrNo.NO) && (
                                        <SuksessMessage margin="l">
                                            <Info.selvstendigKanSøke
                                                visInfoOmTrekkeSøknad={
                                                    selvstendigVilFortsetteTilSøknad === YesOrNo.YES &&
                                                    selvstendigHarAlleredeSøkt === YesOrNo.YES
                                                }
                                            />
                                        </SuksessMessage>
                                    )}
                                    {selvstendigVilFortsetteTilSøknad === YesOrNo.NO &&
                                        selvstendigHarAlleredeSøkt === YesOrNo.YES && (
                                            <StopMessage>
                                                <Info.vilIkkeTrekkeAnnenSøknadSelvstendig />
                                            </StopMessage>
                                        )}
                                </FormSection>
                            )}
                            {isVisible(IntroFormField.erFrilanser) && (
                                <FormSection title="Frilanser">
                                    <FormQuestion question={IntroFormField.erFrilanser}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.erFrilanser}
                                            legend={introFormText.erFrilanser}
                                            description={<Info.frilanserNAVsDefinisjon />}
                                        />
                                    </FormQuestion>
                                    {erSelvstendigNæringsdrivende === YesOrNo.NO && erFrilanser === YesOrNo.NO && (
                                        <StopMessage>
                                            <Info.ikkeFrilanserOgIkkeRettSomSelvstendig />
                                        </StopMessage>
                                    )}
                                    <FormQuestion question={IntroFormField.frilanserHarTaptInntektPgaKorona}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.frilanserHarTaptInntektPgaKorona}
                                            legend={introFormText.frilanserHarTaptInntektPgaKorona}
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
                                            legend={introFormText.frilanserInntektstapStartetFørFrist(
                                                sisteGyldigeDagForInntektstap
                                            )}
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
                                            legend={introFormText.frilanserFårDekketTapet}
                                            description={<Info.fårDekketTapetSomFrilanserForklaring />}
                                        />
                                        {frilanserFårDekketTapet === YesOrNo.YES && (
                                            <StopMessage>
                                                <Info.frilanserFårDekketTapet />
                                            </StopMessage>
                                        )}
                                    </FormQuestion>

                                    <FormQuestion question={IntroFormField.frilansHarAlleredeSøkt}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.frilansHarAlleredeSøkt}
                                            legend={introFormText.frilansHarAlleredeSøkt}
                                        />
                                        {frilansHarAlleredeSøkt === YesOrNo.YES && (
                                            <InfoMessage margin="l">
                                                <Info.harAlleredeSøkt />
                                            </InfoMessage>
                                        )}
                                    </FormQuestion>
                                    <FormQuestion question={IntroFormField.frilansVilFortsetteTilSøknad}>
                                        <FormComponent.YesOrNoQuestion
                                            name={IntroFormField.frilansVilFortsetteTilSøknad}
                                            legend={introFormText.frilansVilFortsetteTilSøknad}
                                        />
                                    </FormQuestion>

                                    {(frilansVilFortsetteTilSøknad === YesOrNo.YES ||
                                        frilansHarAlleredeSøkt === YesOrNo.NO) && (
                                        <SuksessMessage margin="l">
                                            <Info.frilanserKanSøke
                                                visInfoOmTrekkeSøknad={
                                                    selvstendigVilFortsetteTilSøknad === YesOrNo.YES &&
                                                    selvstendigHarAlleredeSøkt === YesOrNo.YES
                                                }
                                            />
                                        </SuksessMessage>
                                    )}
                                    {frilansVilFortsetteTilSøknad === YesOrNo.NO &&
                                        frilansHarAlleredeSøkt === YesOrNo.YES && (
                                            <StopMessage>
                                                <Info.vilIkkeTrekkeAnnenSøknadFrilanser />
                                            </StopMessage>
                                        )}
                                </FormSection>
                            )}

                            {erFrilanser === YesOrNo.NO &&
                                erSelvstendigNæringsdrivende === YesOrNo.YES &&
                                !selvstendigIsOk && (
                                    <StopMessage>
                                        <Info.selvstendigIkkeOkOgErIkkeFrilanser />
                                    </StopMessage>
                                )}
                        </QuestionVisibilityContext.Provider>
                    </FormComponent.Form>
                );
            }}
        />
    );
};

export default IntroForm;

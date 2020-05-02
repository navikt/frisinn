import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import moment from 'moment';
import StopMessage from '../../../components/stop-message/StopMessage';
import SuksessMessage from '../../../components/suksess-message/SuksessMessage';
import { QuestionVisibilityContext } from '../../../context/QuestionVisibilityContext';
import { DateRange, getSisteGyldigeDagForInntektstapIPeriode } from '../../../utils/dateUtils';
import { hasValue } from '../../../validation/fieldValidations';
import FormSection from '../FormSection';
import { IntroResultProps } from '../IntroPage';
import { IntroFormData, IntroFormField, IntroFormQuestions } from './introFormConfig';
import Info from './IntroFormInfo';
import IntroFormQuestion from './IntroFormQuestion';
import { introFormText } from './introFormTexts';
import introFormUtils from './introFormUtils';
import useAccessCheck from '../../../hooks/useAccessKrav';
import { apenAlderAccessCheck } from '../../../utils/apiAccessCheck';
import LoadWrapper from '../../../components/load-wrapper/LoadWrapper';

const FormComponent = getTypedFormComponents<IntroFormField, IntroFormData>();

interface Props {
    soknadsperiode: DateRange;
    onValidSubmit: (values: IntroResultProps) => void;
}

const IntroForm = ({ onValidSubmit, soknadsperiode, values }: Props & { values: IntroFormData }) => {
    const intl = useIntl();

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

    const alderCheck = useAccessCheck(apenAlderAccessCheck(fødselsdato));
    const { isLoading } = alderCheck;

    useEffect(() => {
        alderCheck.check();
    }, [fødselsdato]);

    const alderIsOk = alderCheck.result?.passes === true;
    const selvstendigIsOk = introFormUtils.canApplyAsSelvstendig(values);
    const frilanserIsOk = introFormUtils.canApplyAsFrilanser(values);

    const sisteGyldigeDagForInntektstap: Date = getSisteGyldigeDagForInntektstapIPeriode(soknadsperiode);

    const canContinueToSoknad = areAllQuestionsAnswered() && (selvstendigIsOk || frilanserIsOk) && alderIsOk;

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
                    <IntroFormQuestion
                        name={IntroFormField.fødselsdato}
                        showStop={hasValue(fødselsdato) && !alderIsOk}
                        stopMessage={<Info.ikkeGyldigAlder periode={soknadsperiode} />}>
                        <FormComponent.DatePicker
                            name={IntroFormField.fødselsdato}
                            label={introFormText.fødselsdato}
                            showYearSelector={true}
                            dayPickerProps={{ initialMonth: new Date(1995, 0, 1) }}
                            dateLimitations={{ maksDato: moment.utc().subtract(17, 'years').toDate() }}
                        />
                    </IntroFormQuestion>
                </FormSection>
                <LoadWrapper
                    isLoading={isLoading}
                    contentRenderer={() => {
                        if (
                            fødselsdato !== undefined &&
                            alderCheck &&
                            alderCheck.result &&
                            alderCheck.result.passes === false
                        ) {
                            return <StopMessage>{alderCheck.result.info}</StopMessage>;
                        }
                        return (
                            <>
                                {isVisible(IntroFormField.erSelvstendigNæringsdrivende) && (
                                    <FormSection title="Selvstendig næringsdrivende">
                                        <IntroFormQuestion name={IntroFormField.erSelvstendigNæringsdrivende} />
                                        <IntroFormQuestion
                                            name={IntroFormField.selvstendigHarTattUtInntektFraSelskap}
                                            showStop={selvstendigHarTattUtInntektFraSelskap === YesOrNo.NO}
                                            description={<Info.selvstendigHvaMenesMedInntekt />}
                                            stopMessage={<Info.selvstendigIkkeTattUtInntekt />}
                                        />
                                        <IntroFormQuestion
                                            name={IntroFormField.selvstendigHarTaptInntektPgaKorona}
                                            showStop={selvstendigHarTaptInntektPgaKorona === YesOrNo.NO}
                                            description={<Info.hvaRegnesSomInntektstap />}
                                            stopMessage={<Info.selvstendigIkkeTapPgaKorona />}
                                        />
                                        <IntroFormQuestion
                                            name={IntroFormField.selvstendigInntektstapStartetFørFrist}
                                            showStop={selvstendigInntektstapStartetFørFrist === YesOrNo.NO}
                                            legend={introFormText.selvstendigInntektstapStartetFørFrist(
                                                sisteGyldigeDagForInntektstap
                                            )}
                                            description={<Info.hvaErStartdatoForInntektstap />}
                                            stopMessage={<Info.selvstendigForSentInntektstap />}
                                        />
                                        <IntroFormQuestion
                                            name={IntroFormField.selvstendigFårDekketTapet}
                                            showStop={selvstendigFårDekketTapet === YesOrNo.YES}
                                            description={<Info.fårDekketTapetSomSelvstendigForklaring />}
                                            stopMessage={<Info.selvstendigFårDekketTapet />}
                                        />
                                        <IntroFormQuestion
                                            name={IntroFormField.selvstendigHarAlleredeSøkt}
                                            showInfo={selvstendigHarAlleredeSøkt === YesOrNo.YES}
                                            infoMessage={<Info.harAlleredeSøkt />}
                                        />
                                        <IntroFormQuestion
                                            name={IntroFormField.selvstendigVilFortsetteTilSøknad}
                                            showStop={
                                                selvstendigVilFortsetteTilSøknad === YesOrNo.NO &&
                                                selvstendigHarAlleredeSøkt === YesOrNo.YES
                                            }
                                            stopMessage={<Info.vilIkkeTrekkeAnnenSøknadSelvstendig />}
                                        />
                                        {selvstendigIsOk && (
                                            <SuksessMessage margin="l">
                                                <Info.selvstendigKanSøke
                                                    visInfoOmTrekkeSøknad={
                                                        selvstendigVilFortsetteTilSøknad === YesOrNo.YES &&
                                                        selvstendigHarAlleredeSøkt === YesOrNo.YES
                                                    }
                                                />
                                            </SuksessMessage>
                                        )}
                                    </FormSection>
                                )}
                                {isVisible(IntroFormField.erFrilanser) && (
                                    <FormSection title="Frilanser">
                                        <IntroFormQuestion
                                            name={IntroFormField.erFrilanser}
                                            showStop={
                                                erSelvstendigNæringsdrivende === YesOrNo.NO &&
                                                erFrilanser === YesOrNo.NO
                                            }
                                            description={<Info.frilanserNAVsDefinisjon />}
                                            stopMessage={<Info.ikkeFrilanserOgIkkeRettSomSelvstendig />}
                                        />
                                        <IntroFormQuestion
                                            name={IntroFormField.frilanserHarTaptInntektPgaKorona}
                                            showStop={frilanserHarTaptInntektPgaKorona === YesOrNo.NO}
                                            stopMessage={<Info.frilanserIkkeTapPgaKorona />}
                                        />
                                        <IntroFormQuestion
                                            name={IntroFormField.frilanserInntektstapStartetFørFrist}
                                            legend={introFormText.frilanserInntektstapStartetFørFrist(
                                                sisteGyldigeDagForInntektstap
                                            )}
                                            description={<Info.hvaErStartdatoForInntektstap />}
                                            showStop={frilanserInntektstapStartetFørFrist === YesOrNo.NO}
                                            stopMessage={<Info.frilanserForSentInntektstap />}
                                        />
                                        <IntroFormQuestion
                                            name={IntroFormField.frilanserFårDekketTapet}
                                            description={<Info.fårDekketTapetSomFrilanserForklaring />}
                                            showStop={frilanserFårDekketTapet === YesOrNo.YES}
                                            stopMessage={<Info.frilanserFårDekketTapet />}
                                        />
                                        <IntroFormQuestion
                                            name={IntroFormField.frilansHarAlleredeSøkt}
                                            description={<Info.fårDekketTapetSomFrilanserForklaring />}
                                            showInfo={frilansHarAlleredeSøkt === YesOrNo.YES}
                                            infoMessage={<Info.harAlleredeSøkt />}
                                        />
                                        <IntroFormQuestion
                                            name={IntroFormField.frilansVilFortsetteTilSøknad}
                                            showStop={
                                                frilansVilFortsetteTilSøknad === YesOrNo.NO &&
                                                frilansHarAlleredeSøkt === YesOrNo.YES
                                            }
                                            stopMessage={<Info.vilIkkeTrekkeAnnenSøknadFrilanser />}
                                        />
                                        {frilanserIsOk && (
                                            <SuksessMessage margin="l">
                                                <Info.frilanserKanSøke
                                                    visInfoOmTrekkeSøknad={
                                                        frilansVilFortsetteTilSøknad === YesOrNo.YES &&
                                                        frilansHarAlleredeSøkt === YesOrNo.YES
                                                    }
                                                />
                                            </SuksessMessage>
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
                            </>
                        );
                    }}
                />
            </QuestionVisibilityContext.Provider>
        </FormComponent.Form>
    );
};

const IntroFormWrapper = (props: Props) => {
    return (
        <FormComponent.FormikWrapper
            onSubmit={() => null}
            initialValues={{}}
            renderForm={({ values }) => <IntroForm values={values} {...props} />}
        />
    );
};

export default IntroFormWrapper;

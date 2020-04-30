import React, { useEffect } from 'react';
import { validateRequiredNumber } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import Guide from '../../components/guide/Guide';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import { QuestionVisibilityContext } from '../../context/QuestionVisibilityContext';
import useAvailableSøknadsperiode, { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import FormSection from '../../pages/intro-page/FormSection';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { MAX_INNTEKT } from '../../validation/fieldValidations';
import AvailableDateRangeInfo from '../content/AvailableDateRangeInfo';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadQuestion from '../SoknadQuestion';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { cleanupFrilanserStep } from './cleanupFrilanserStep';
import { FrilanserFormQuestions } from './frilanserFormConfig';
import FrilanserInfo from './FrilanserInfo';
import { frilanserStepTexts } from './frilanserStepTexts';
import StopMessage from '../../components/stop-message/StopMessage';
import { MIN_DATE_PERIODEVELGER } from '../../utils/dateUtils';

const FrilanserStep = ({ soknadEssentials, resetSoknad, onValidSubmit }: StepConfigProps) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();

    const {
        frilanserInntektstapStartetDato,
        frilanserHarTaptInntektPgaKorona,
        frilanserYtelseFraNavDekkerHeleTapet,
        søkerOmTaptInntektSomSelvstendigNæringsdrivende,
    } = values;
    const { currentSøknadsperiode } = soknadEssentials;

    const { availableDateRange, isLoading: availableDateRangeIsLoading } = useAvailableSøknadsperiode(
        frilanserInntektstapStartetDato,
        currentSøknadsperiode
    );

    const isLoading = availableDateRangeIsLoading;
    const visibility = FrilanserFormQuestions.getVisbility({
        ...values,
        ...soknadEssentials,
    });
    const { isVisible, areAllQuestionsAnswered } = visibility;
    const allQuestionsAreAnswered = areAllQuestionsAnswered();

    const frilanserSoknadIsOk: boolean =
        allQuestionsAreAnswered &&
        isValidDateRange(availableDateRange) &&
        frilanserHarTaptInntektPgaKorona === YesOrNo.YES &&
        frilanserYtelseFraNavDekkerHeleTapet !== YesOrNo.YES;

    useEffect(() => {
        setFieldValue(SoknadFormField.frilanserBeregnetTilgjengeligSønadsperiode, availableDateRange);
        setFieldValue(SoknadFormField.frilanserSoknadIsOk, frilanserSoknadIsOk);
    }, [availableDateRange, frilanserSoknadIsOk]);

    console.log(values);
    return (
        <SoknadStep
            id={StepID.FRILANSER}
            onValidFormSubmit={onValidSubmit}
            resetSoknad={resetSoknad}
            stepCleanup={(values) => cleanupFrilanserStep(values, frilanserSoknadIsOk)}
            showSubmitButton={
                !isLoading &&
                (frilanserSoknadIsOk ||
                    (allQuestionsAreAnswered && søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES))
            }>
            <QuestionVisibilityContext.Provider value={{ visibility }}>
                <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                    <p>
                        Du er frilanser når du mottar lønn for enkeltstående oppdrag uten å være fast eller midlertidig
                        ansatt hos den du utfører oppdraget for. Du må sjekke om oppdragene dine er registrert som
                        frilansoppdrag, på{' '}
                        <Lenke
                            href="https://www.skatteetaten.no/skjema/mine-inntekter-og-arbeidsforhold/"
                            target="_blank">
                            skatteetaten sine nettsider
                        </Lenke>{' '}
                        (åpnes i nytt vindu).
                    </p>
                </Guide>

                <SoknadQuestion
                    name={SoknadFormField.frilanserHarTaptInntektPgaKorona}
                    legend={frilanserStepTexts.frilanserHarTaptInntektPgaKorona(currentSøknadsperiode)}
                    description={<FrilanserInfo.koronaTaptInntekt />}
                    showStop={frilanserHarTaptInntektPgaKorona === YesOrNo.NO}
                    stopMessage={<FrilanserInfo.advarselIkkeTapPgaKorona />}
                />

                <SoknadQuestion name={SoknadFormField.frilanserErNyetablert} />

                <SoknadQuestion
                    name={SoknadFormField.frilanserInntektstapStartetDato}
                    showInfo={isValidDateRange(availableDateRange)}
                    infoMessage={
                        <AvailableDateRangeInfo
                            inntektstapStartetDato={frilanserInntektstapStartetDato}
                            availableDateRange={availableDateRange}
                        />
                    }>
                    <SoknadFormComponents.DatePicker
                        name={SoknadFormField.frilanserInntektstapStartetDato}
                        label={frilanserStepTexts.frilanserInntektstapStartetDato}
                        dateLimitations={{
                            minDato: MIN_DATE_PERIODEVELGER,
                            maksDato: currentSøknadsperiode.to,
                        }}
                    />
                </SoknadQuestion>

                {values.frilanserHarTaptInntektPgaKorona === YesOrNo.YES && (
                    <LoadWrapper
                        isLoading={isLoading}
                        contentRenderer={() => {
                            if (availableDateRange === undefined) {
                                return null;
                            }
                            if (availableDateRange === 'NO_AVAILABLE_DATERANGE') {
                                return (
                                    <StopMessage>
                                        <FrilanserInfo.advarselForSentInntektstap
                                            currentSøknadsperiode={currentSøknadsperiode}
                                        />
                                    </StopMessage>
                                );
                            }
                            return (
                                <>
                                    {isVisible(SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet) && (
                                        <FormSection title="Andre utbetalinger fra NAV">
                                            <SoknadQuestion
                                                name={SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet}
                                                description={<FrilanserInfo.andreUtbetalingerFraNAV />}
                                            />
                                            <SoknadQuestion
                                                name={SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet}
                                                showStop={frilanserYtelseFraNavDekkerHeleTapet === YesOrNo.YES}
                                                stopMessage={<FrilanserInfo.ytelseDekkerHeleTapet />}
                                            />
                                        </FormSection>
                                    )}

                                    {isVisible(SoknadFormField.frilanserInntektIPerioden) && (
                                        <FormSection title={`Inntekt som frilanser i perioden du søker for`}>
                                            <SoknadQuestion name={SoknadFormField.frilanserInntektIPerioden}>
                                                <SoknadFormComponents.Input
                                                    name={SoknadFormField.frilanserInntektIPerioden}
                                                    type="number"
                                                    bredde="S"
                                                    description={<FrilanserInfo.hvordanBeregneInntekt />}
                                                    label={frilanserStepTexts.frilanserInntektIPerioden(
                                                        availableDateRange
                                                    )}
                                                    validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                />
                                            </SoknadQuestion>
                                        </FormSection>
                                    )}

                                    {isVisible(SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden) && (
                                        <FormSection title="Selvstendig næringsdrivende">
                                            <SoknadQuestion
                                                name={SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden}
                                            />
                                            <SoknadQuestion
                                                name={SoknadFormField.frilanserInntektSomSelvstendigIPerioden}>
                                                <SoknadFormComponents.Input
                                                    name={SoknadFormField.frilanserInntektSomSelvstendigIPerioden}
                                                    type="number"
                                                    bredde="S"
                                                    label={frilanserStepTexts.frilanserInntektSomSelvstendigIPerioden}
                                                    validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                />
                                            </SoknadQuestion>
                                        </FormSection>
                                    )}
                                </>
                            );
                        }}
                    />
                )}
            </QuestionVisibilityContext.Provider>
        </SoknadStep>
    );
};

export default FrilanserStep;

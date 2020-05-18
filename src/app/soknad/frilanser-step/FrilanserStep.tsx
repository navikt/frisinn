import React, { useEffect } from 'react';
import { validateRequiredNumber } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import Guide from '../../components/guide/Guide';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import StopMessage from '../../components/stop-message/StopMessage';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import { QuestionVisibilityContext } from '../../context/QuestionVisibilityContext';
import useAvailableSøknadsperiode, { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import FormSection from '../../pages/intro-page/FormSection';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { MIN_DATE_PERIODEVELGER } from '../../utils/dateUtils';
import { MAX_INNTEKT } from '../../validation/fieldValidations';
import AvailableDateRangeInfo from '../info/AvailableDateRangeInfo';
import FrilanserInfo from '../info/FrilanserInfo';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadQuestion from '../SoknadQuestion';
import { soknadQuestionText } from '../soknadQuestionText';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { cleanupFrilanserStep } from './cleanupFrilanserStep';
import { FrilanserAvslagStatus, FrilanserAvslagÅrsak, kontrollerFrilanserSvar } from './frilanserAvslag';
import { FrilanserFormQuestions } from './frilanserFormConfig';
import SelvstendigInfo from '../info/SelvstendigInfo';

const getStopReason = (status: FrilanserAvslagStatus): FrilanserAvslagÅrsak | undefined => {
    const feil = Object.keys(status).filter((key) => status[key] === true);
    return feil ? (feil[0] as FrilanserAvslagÅrsak) : undefined;
};

const FrilanserStep = ({ soknadEssentials, resetSoknad, onValidSubmit }: StepConfigProps) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();

    const {
        frilanserInntektstapStartetDato,
        frilanserHarTaptInntektPgaKorona,
        frilanserHarYtelseFraNavSomDekkerTapet,
        søkerOmTaptInntektSomSelvstendigNæringsdrivende,
        frilanserBeregnetTilgjengeligSøknadsperiode,
    } = values;
    const { currentSøknadsperiode } = soknadEssentials;

    const { availableDateRange, isLoading: availableDateRangeIsLoading } = useAvailableSøknadsperiode(
        frilanserInntektstapStartetDato,
        currentSøknadsperiode,
        frilanserBeregnetTilgjengeligSøknadsperiode
    );

    const isLoading = availableDateRangeIsLoading;
    const avslag = kontrollerFrilanserSvar(values);

    const payload = {
        ...values,
        ...soknadEssentials,
        avslag,
    };

    const visibility = FrilanserFormQuestions.getVisbility(payload);

    const { isVisible, areAllQuestionsAnswered } = visibility;
    const allQuestionsAreAnswered = areAllQuestionsAnswered();

    const frilanserSoknadIsOk: boolean =
        allQuestionsAreAnswered &&
        isValidDateRange(availableDateRange) &&
        frilanserHarTaptInntektPgaKorona === YesOrNo.YES &&
        frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.NO;

    useEffect(() => {
        setFieldValue(
            SoknadFormField.frilanserBeregnetTilgjengeligSøknadsperiode,
            isValidDateRange(availableDateRange) ? availableDateRange : undefined
        );
        setFieldValue(SoknadFormField.frilanserSoknadIsOk, frilanserSoknadIsOk);
    }, [availableDateRange, frilanserSoknadIsOk]);

    return (
        <SoknadStep
            id={StepID.FRILANSER}
            onValidFormSubmit={onValidSubmit}
            resetSoknad={resetSoknad}
            stepCleanup={(values) => {
                const v = { ...values };
                v.frilanserSoknadIsOk = frilanserSoknadIsOk;
                v.frilanserStopReason = frilanserSoknadIsOk ? undefined : getStopReason(avslag);
                return cleanupFrilanserStep(v, avslag);
            }}
            showSubmitButton={
                !isLoading &&
                (frilanserSoknadIsOk ||
                    (allQuestionsAreAnswered && søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES))
            }>
            <QuestionVisibilityContext.Provider value={{ visibility }}>
                <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                    Du er frilanser når du mottar lønn for enkeltstående oppdrag uten å være fast eller midlertidig
                    ansatt hos den du utfører oppdraget for.
                    <p>
                        <strong>Har du sjekket om du er frilanser?</strong> Det gjør du ved å sjekke om oppdragene dine
                        er registrert som frilansoppdrag på{' '}
                        <Lenke
                            href="https://www.skatteetaten.no/skjema/mine-inntekter-og-arbeidsforhold/"
                            target="_blank">
                            skatteetaten sine nettsider
                        </Lenke>{' '}
                        (åpnes i nytt vindu).
                    </p>
                </Guide>

                <SoknadQuestion
                    name={SoknadFormField.frilanserErNyetablert}
                    description={<FrilanserInfo.infoErNyetablert />}
                />

                <SoknadQuestion
                    name={SoknadFormField.frilanserHarTaptInntektPgaKorona}
                    legend={soknadQuestionText.frilanserHarTaptInntektPgaKorona(currentSøknadsperiode)}
                    description={<FrilanserInfo.infoTaptInntektPgaKorona />}
                    showStop={avslag.harIkkeHattInntektstapPgaKorona}
                    stopMessage={<FrilanserInfo.StoppIkkeTapPgaKorona />}
                />

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
                        label={soknadQuestionText.frilanserInntektstapStartetDato}
                        description={<SelvstendigInfo.infoNårStartetInntektstapet />}
                        dateLimitations={{
                            minDato: MIN_DATE_PERIODEVELGER,
                            maksDato: currentSøknadsperiode.to,
                        }}
                        dayPickerProps={{
                            initialMonth: currentSøknadsperiode.to,
                        }}
                        useErrorBoundary={true}
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
                                        <FrilanserInfo.StoppForSentInntektstap />
                                    </StopMessage>
                                );
                            }
                            return (
                                <>
                                    <SoknadQuestion name={SoknadFormField.frilanserInntektIPerioden}>
                                        <SoknadFormComponents.Input
                                            name={SoknadFormField.frilanserInntektIPerioden}
                                            type="number"
                                            bredde="S"
                                            description={
                                                <FrilanserInfo.infoHvordanBeregneInntekt periode={availableDateRange} />
                                            }
                                            label={soknadQuestionText.frilanserInntektIPerioden(availableDateRange)}
                                            validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                            maxLength={8}
                                            max={MAX_INNTEKT}
                                        />
                                    </SoknadQuestion>

                                    {isVisible(SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet) && (
                                        <FormSection title="Andre utbetalinger fra NAV">
                                            <SoknadQuestion
                                                name={SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet}
                                                description={<FrilanserInfo.infoAndreUtbetalingerFraNAV />}
                                                showStop={avslag.utebetalingFraNAVDekkerHeleInntektstapet}
                                                stopMessage={<FrilanserInfo.StoppYtelseDekkerHeleTapet />}
                                            />
                                        </FormSection>
                                    )}

                                    {isVisible(SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden) && (
                                        <FormSection title="Selvstendig næringsdrivende">
                                            <SoknadQuestion
                                                name={SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden}
                                                legend={soknadQuestionText.frilanserHarHattInntektSomSelvstendigIPerioden(
                                                    availableDateRange
                                                )}
                                            />
                                            <SoknadQuestion
                                                name={SoknadFormField.frilanserInntektSomSelvstendigIPerioden}>
                                                <SoknadFormComponents.Input
                                                    name={SoknadFormField.frilanserInntektSomSelvstendigIPerioden}
                                                    type="number"
                                                    bredde="S"
                                                    label={soknadQuestionText.frilanserInntektSomSelvstendigIPerioden(
                                                        availableDateRange
                                                    )}
                                                    maxLength={8}
                                                    max={MAX_INNTEKT}
                                                    description={
                                                        <SelvstendigInfo.infoHvordanBeregneInntekt
                                                            periode={availableDateRange}
                                                        />
                                                    }
                                                    validate={validateRequiredNumber({ min: 1, max: MAX_INNTEKT })}
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

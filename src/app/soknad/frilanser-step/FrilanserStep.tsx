import React, { useEffect } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { validateRequiredNumber } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import Guide from '../../components/guide/Guide';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import useAvailableSøknadsperiode, { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { apiStringDateToDate } from '../../utils/dateUtils';
import { ensureString } from '../../utils/ensureString';
import { MAX_INNTEKT } from '../../validation/fieldValidations';
import AvailableDateRangeInfo from '../content/AvailableDateRangeInfo';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { FrilanserFormQuestions } from './frilanserFormConfig';
import { frilanserStepTexts } from './frilanserStepTexts';
import { QuestionVisibilityContext } from '../../context/QuestionVisibilityContext';
import FrilanserFormQuestion from './FrilanserFormQuestion';
import FrilanserInfo from './FrilanserInfo';
import StopMessage from '../../components/StopMessage';
import FormSection from '../../pages/intro-page/FormSection';
import { cleanupFrilanserStep } from './cleanupFrilanserStep';

const MIN_DATE: Date = apiStringDateToDate('2020-02-01');

const txt = frilanserStepTexts;

const FrilanserStep = ({ soknadEssentials, resetSoknad, onValidSubmit }: StepConfigProps) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();

    const {
        frilanserInntektstapStartetDato,
        frilanserHarTaptInntektPgaKorona,
        frilanserYtelseFraNavDekkerHeleTapet,
        søkerOmTaptInntektSomSelvstendigNæringsdrivende,
    } = values;
    const { currentSøknadsperiode } = soknadEssentials;

    const {
        availableDateRange,
        isLimitedDateRange,
        isLoading: availableDateRangeIsLoading,
    } = useAvailableSøknadsperiode(frilanserInntektstapStartetDato, currentSøknadsperiode);

    const isLoading = availableDateRangeIsLoading;
    const visibility = FrilanserFormQuestions.getVisbility({
        ...values,
        ...soknadEssentials,
    });
    const { isVisible, areAllQuestionsAnswered } = visibility;

    const hasValidFrilanserFormData: boolean =
        areAllQuestionsAnswered() &&
        isValidDateRange(availableDateRange) &&
        frilanserHarTaptInntektPgaKorona === YesOrNo.YES &&
        frilanserYtelseFraNavDekkerHeleTapet !== YesOrNo.YES;

    useEffect(() => {
        setFieldValue(SoknadFormField.frilanserCalculatedDateRange, availableDateRange);
    }, [availableDateRange]);

    return (
        <SoknadStep
            id={StepID.FRILANSER}
            onValidFormSubmit={onValidSubmit}
            resetSoknad={resetSoknad}
            stepCleanup={(values) => cleanupFrilanserStep(values, hasValidFrilanserFormData)}
            showSubmitButton={
                !isLoading &&
                (hasValidFrilanserFormData || søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES)
            }>
            <QuestionVisibilityContext.Provider value={{ visibility }}>
                <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                    <p>Skal det være noe informasjon som introduserer steget?</p>
                </Guide>
                <FrilanserFormQuestion question={SoknadFormField.frilanserHarTaptInntektPgaKorona}>
                    <SoknadFormComponents.YesOrNoQuestion
                        name={SoknadFormField.frilanserHarTaptInntektPgaKorona}
                        legend={ensureString(txt.frilanserHarTaptInntektPgaKorona(currentSøknadsperiode))}
                    />
                </FrilanserFormQuestion>
                {frilanserHarTaptInntektPgaKorona === YesOrNo.NO && (
                    <StopMessage>
                        <FrilanserInfo.advarselIkkeTapPgaKorona />
                    </StopMessage>
                )}
                <FrilanserFormQuestion question={SoknadFormField.frilanserErNyetablert}>
                    <SoknadFormComponents.YesOrNoQuestion
                        name={SoknadFormField.frilanserErNyetablert}
                        legend={ensureString(txt.frilanserErNyetablert)}
                    />
                </FrilanserFormQuestion>

                <FrilanserFormQuestion question={SoknadFormField.frilanserInntektstapStartetDato}>
                    <SoknadFormComponents.DatePicker
                        name={SoknadFormField.frilanserInntektstapStartetDato}
                        label={ensureString(txt.frilanserInntektstapStartetDato)}
                        dateLimitations={{
                            minDato: MIN_DATE,
                            maksDato: currentSøknadsperiode.to,
                        }}
                    />
                    {isValidDateRange(availableDateRange) && (
                        <Box margin="l" padBottom="xxl">
                            <AvailableDateRangeInfo
                                inntektstapStartetDato={frilanserInntektstapStartetDato}
                                availableDateRange={availableDateRange}
                                isLimitedDateRange={isLimitedDateRange}
                            />
                        </Box>
                    )}
                </FrilanserFormQuestion>

                {values.frilanserHarTaptInntektPgaKorona === YesOrNo.YES && (
                    <LoadWrapper
                        isLoading={isLoading}
                        contentRenderer={() => {
                            if (availableDateRange === undefined) {
                                return null;
                            }
                            if (availableDateRange === 'NO_AVAILABLE_DATERANGE') {
                                return (
                                    <FormBlock>
                                        <AlertStripeAdvarsel>
                                            Du kan ikke søke for denne perioden fordi du får dekket først fra og med den
                                            17. dagen etter inntektsstapet startet.{' '}
                                        </AlertStripeAdvarsel>
                                    </FormBlock>
                                );
                            }
                            return (
                                <>
                                    <FormSection title="Ytelser fra NAV">
                                        <FrilanserFormQuestion
                                            question={SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet}>
                                            <SoknadFormComponents.YesOrNoQuestion
                                                name={SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet}
                                                legend={ensureString(txt.frilanserHarYtelseFraNavSomDekkerTapet)}
                                            />
                                        </FrilanserFormQuestion>

                                        <FrilanserFormQuestion
                                            question={SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet}>
                                            <SoknadFormComponents.YesOrNoQuestion
                                                name={SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet}
                                                legend={ensureString(txt.frilanserYtelseFraNavDekkerHeleTapet)}
                                            />
                                        </FrilanserFormQuestion>
                                        {frilanserYtelseFraNavDekkerHeleTapet === YesOrNo.YES && (
                                            <StopMessage>
                                                <FrilanserInfo.ytelseDekkerHeleTapet />
                                            </StopMessage>
                                        )}
                                    </FormSection>

                                    {isVisible(SoknadFormField.frilanserInntektIPerioden) && (
                                        <FormSection title="Frilanserinntekt i perioden du søker for">
                                            <FrilanserFormQuestion question={SoknadFormField.frilanserInntektIPerioden}>
                                                <SoknadFormComponents.Input
                                                    name={SoknadFormField.frilanserInntektIPerioden}
                                                    type="number"
                                                    bredde="S"
                                                    description={<FrilanserInfo.hvordanBeregneInntekt />}
                                                    label={
                                                        <span>
                                                            Hvilken inntekt har du hatt som frilanser i perioden{' '}
                                                            <DateRangeView
                                                                extendedFormat={true}
                                                                dateRange={availableDateRange}
                                                            />
                                                            ?
                                                        </span>
                                                    }
                                                    validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                />
                                            </FrilanserFormQuestion>
                                        </FormSection>
                                    )}

                                    {isVisible(SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden) && (
                                        <FormSection title="Selvstendig næringsdrivende">
                                            <FrilanserFormQuestion
                                                question={
                                                    SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden
                                                }>
                                                <SoknadFormComponents.YesOrNoQuestion
                                                    name={
                                                        SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden
                                                    }
                                                    legend={ensureString(
                                                        txt.frilanserHarHattInntektSomSelvstendigIPerioden(
                                                            availableDateRange
                                                        )
                                                    )}
                                                />
                                            </FrilanserFormQuestion>
                                            <FrilanserFormQuestion
                                                question={SoknadFormField.frilanserInntektSomSelvstendigIPerioden}>
                                                <SoknadFormComponents.Input
                                                    name={SoknadFormField.frilanserInntektSomSelvstendigIPerioden}
                                                    type="number"
                                                    bredde="S"
                                                    label={ensureString(txt.frilanserInntektSomSelvstendigIPerioden)}
                                                    validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                />
                                            </FrilanserFormQuestion>
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

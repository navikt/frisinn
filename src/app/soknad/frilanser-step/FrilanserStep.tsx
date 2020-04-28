import React, { useEffect } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { validateRequiredNumber } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Guide from '../../components/guide/Guide';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import useAvailableSøknadsperiode, { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { apiStringDateToDate } from '../../utils/dateUtils';
import { MAX_INNTEKT } from '../../validation/fieldValidations';
import AvailableDateRangeInfo from '../content/AvailableDateRangeInfo';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { FrilanserFormQuestions } from './frilanserFormConfig';
import { QuestionVisibilityContext } from '../../context/QuestionVisibilityContext';
import FrilanserFormQuestion from './FrilanserFormQuestion';
import FrilanserInfo from './FrilanserInfo';
import StopMessage from '../../components/stop-message/StopMessage';
import FormSection from '../../pages/intro-page/FormSection';
import { cleanupFrilanserStep } from './cleanupFrilanserStep';
import Lenke from 'nav-frontend-lenker';
import { frilanserStepTexts } from './frilanserStepTexts';

const MIN_DATE: Date = apiStringDateToDate('2020-02-01');

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
                <FrilanserFormQuestion question={SoknadFormField.frilanserHarTaptInntektPgaKorona}>
                    <SoknadFormComponents.YesOrNoQuestion
                        name={SoknadFormField.frilanserHarTaptInntektPgaKorona}
                        legend={frilanserStepTexts.frilanserHarTaptInntektPgaKorona(currentSøknadsperiode)}
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
                        legend={frilanserStepTexts.frilanserErNyetablert}
                    />
                </FrilanserFormQuestion>

                <FrilanserFormQuestion question={SoknadFormField.frilanserInntektstapStartetDato}>
                    <SoknadFormComponents.DatePicker
                        name={SoknadFormField.frilanserInntektstapStartetDato}
                        label={frilanserStepTexts.frilanserInntektstapStartetDato}
                        dateLimitations={{
                            minDato: MIN_DATE,
                            maksDato: currentSøknadsperiode.to,
                        }}
                    />
                    {isValidDateRange(availableDateRange) && (
                        <Box margin="l">
                            <AvailableDateRangeInfo
                                inntektstapStartetDato={frilanserInntektstapStartetDato}
                                availableDateRange={availableDateRange}
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
                                    <FormSection title="Andre utbetalinger fra NAV">
                                        <FrilanserFormQuestion
                                            question={SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet}>
                                            <SoknadFormComponents.YesOrNoQuestion
                                                name={SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet}
                                                legend={frilanserStepTexts.frilanserHarYtelseFraNavSomDekkerTapet}
                                                description={<FrilanserInfo.andreUtbetalingerFraNAV />}
                                            />
                                        </FrilanserFormQuestion>

                                        <FrilanserFormQuestion
                                            question={SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet}>
                                            <SoknadFormComponents.YesOrNoQuestion
                                                name={SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet}
                                                legend={frilanserStepTexts.frilanserYtelseFraNavDekkerHeleTapet}
                                            />
                                        </FrilanserFormQuestion>
                                        {frilanserYtelseFraNavDekkerHeleTapet === YesOrNo.YES && (
                                            <StopMessage>
                                                <FrilanserInfo.ytelseDekkerHeleTapet />
                                            </StopMessage>
                                        )}
                                    </FormSection>

                                    {isVisible(SoknadFormField.frilanserInntektIPerioden) && (
                                        <FormSection title={`Inntekt som frilanser i perioden du søker for`}>
                                            <FrilanserFormQuestion question={SoknadFormField.frilanserInntektIPerioden}>
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
                                                    legend={
                                                        frilanserStepTexts.frilanserHarHattInntektSomSelvstendigIPerioden
                                                    }
                                                />
                                            </FrilanserFormQuestion>
                                            <FrilanserFormQuestion
                                                question={SoknadFormField.frilanserInntektSomSelvstendigIPerioden}>
                                                <SoknadFormComponents.Input
                                                    name={SoknadFormField.frilanserInntektSomSelvstendigIPerioden}
                                                    type="number"
                                                    bredde="S"
                                                    label={frilanserStepTexts.frilanserInntektSomSelvstendigIPerioden}
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

import React, { useEffect } from 'react';
import { validateRequiredNumber } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import Guide from '../../../components/guide/Guide';
import LoadWrapper from '../../../components/load-wrapper/LoadWrapper';
import VeilederSVG from '../../../components/veileder-svg/VeilederSVG';
import { QuestionVisibilityContext } from '../../../context/QuestionVisibilityContext';
import useAvailableSøknadsperiode, { isValidDateRange } from '../../../hooks/useAvailableSøknadsperiode';
import FormSection from '../../../pages/intro-page/FormSection';
import { SoknadFormData, SoknadFormField } from '../../../types/SoknadFormData';
import { MIN_DATE_PERIODEVELGER } from '../../../utils/dateUtils';
import { hasValue, MAX_INNTEKT } from '../../../validation/fieldValidations';
import AvailableDateRangeInfo from '../../info/AvailableDateRangeInfo';
import FrilanserInfo from '../../info/FrilanserInfo';
import SelvstendigInfo from '../../info/SelvstendigInfo';
import SoknadErrors from '../../soknad-errors/SoknadErrors';
import FormComponents from '../../SoknadFormComponents';
import SoknadQuestion from '../../SoknadQuestion';
import { soknadQuestionText } from '../../soknadQuestionText';
import SoknadStep from '../../SoknadStep';
import { StepConfigProps, StepID } from '../../stepConfig';
import { getAvslagÅrsak, kontrollerSelvstendigAndregangsSvar } from '../selvstendigAvslag';
import { cleanupSelvstendigAndregangStep } from './cleanupSelvstendigAndregangStep';
import { SelvstendigAndregangFormConfigPayload, SelvstendigFormQuestions } from './selvstendigAndregangFormConfig';

const txt = soknadQuestionText;

const SelvstendigAndregangStep = ({ resetSoknad, onValidSubmit, soknadEssentials }: StepConfigProps) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();
    const { søkerOmTaptInntektSomFrilanser, selvstendigHarYtelseFraNavSomDekkerTapet } = values;
    const { personligeForetak } = soknadEssentials;

    if (personligeForetak === undefined) {
        return <SoknadErrors.MissingApiDataError />;
    }
    const { foretak = [] } = personligeForetak;
    const antallForetak = foretak.length;
    const { currentSøknadsperiode } = soknadEssentials;
    const { selvstendigInntektstapStartetDato, selvstendigBeregnetTilgjengeligSøknadsperiode } = values;

    const avslag = kontrollerSelvstendigAndregangsSvar(values);

    const payload: SelvstendigAndregangFormConfigPayload = {
        ...values,
        ...soknadEssentials,
        avslag,
    };
    const visibility = SelvstendigFormQuestions.getVisbility(payload);
    const { isVisible, areAllQuestionsAnswered } = visibility;
    const allQuestionsAreAnswered = areAllQuestionsAnswered();

    const { availableDateRange, isLoading: availableDateRangeIsLoading } = useAvailableSøknadsperiode({
        inntektstapStartDato: selvstendigInntektstapStartetDato,
        currentSøknadsperiode,
        currentAvailableSøknadsperiode: selvstendigBeregnetTilgjengeligSøknadsperiode,
        startetSøknad: values.startetSøknadTidspunkt,
    });

    const hasValidSelvstendigAndregangsFormData: boolean =
        allQuestionsAreAnswered &&
        isValidDateRange(availableDateRange) &&
        selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.NO;

    useEffect(() => {
        setFieldValue(
            SoknadFormField.selvstendigBeregnetTilgjengeligSøknadsperiode,
            isValidDateRange(availableDateRange) ? availableDateRange : undefined
        );
    }, [availableDateRange]);

    return (
        <SoknadStep
            id={StepID.SELVSTENDIG}
            resetSoknad={resetSoknad}
            onValidFormSubmit={onValidSubmit}
            stepCleanup={(values) => {
                const v: SoknadFormData = { ...values };
                v.selvstendigSoknadIsOk = hasValidSelvstendigAndregangsFormData;
                v.selvstendigStopReason = hasValidSelvstendigAndregangsFormData ? undefined : getAvslagÅrsak(avslag);
                return cleanupSelvstendigAndregangStep(v, avslag);
            }}
            showSubmitButton={
                hasValidSelvstendigAndregangsFormData ||
                (allQuestionsAreAnswered && søkerOmTaptInntektSomFrilanser === YesOrNo.YES)
            }>
            <QuestionVisibilityContext.Provider value={{ visibility }}>
                <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                    <SelvstendigInfo.intro antallForetak={antallForetak} foretak={foretak} />
                </Guide>
                <SoknadQuestion
                    name={SoknadFormField.selvstendigHarTaptInntektPgaKorona}
                    legend={txt.selvstendigHarTaptInntektPgaKorona(currentSøknadsperiode)}
                    description={<SelvstendigInfo.infoTaptInntektPgaKorona />}
                    showStop={avslag.harIkkeHattInntektstapPgaKorona}
                    stopMessage={<SelvstendigInfo.StoppIkkeTapPgaKorona />}
                />
                <SoknadQuestion
                    name={SoknadFormField.selvstendigInntektstapStartetDato}
                    showInfo={isValidDateRange(availableDateRange)}
                    infoMessage={
                        <AvailableDateRangeInfo
                            inntektstapStartetDato={selvstendigInntektstapStartetDato}
                            availableDateRange={availableDateRange}
                        />
                    }
                    showStop={
                        availableDateRangeIsLoading === false &&
                        hasValue(selvstendigInntektstapStartetDato) &&
                        (avslag.søkerIkkeForGyldigTidsrom === true || availableDateRange === 'NO_AVAILABLE_DATERANGE')
                    }
                    stopMessage={<SelvstendigInfo.StoppForSentInntektstap />}>
                    <FormComponents.DatePicker
                        name={SoknadFormField.selvstendigInntektstapStartetDato}
                        label={txt.selvstendigInntektstapStartetDato}
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
                <LoadWrapper
                    isLoading={availableDateRangeIsLoading}
                    contentRenderer={() => {
                        if (availableDateRange === undefined || availableDateRange === 'NO_AVAILABLE_DATERANGE') {
                            return null;
                        }
                        return (
                            <>
                                <SoknadQuestion
                                    name={SoknadFormField.selvstendigInntektIPerioden}
                                    description={<SelvstendigInfo.infoAndreUtbetalingerFraNAV />}>
                                    <FormComponents.Input
                                        name={SoknadFormField.selvstendigInntektIPerioden}
                                        label={txt.selvstendigInntektIPerioden(availableDateRange)}
                                        type="number"
                                        bredde="S"
                                        maxLength={8}
                                        max={MAX_INNTEKT}
                                        description={
                                            <SelvstendigInfo.infoHvordanBeregneInntekt periode={availableDateRange} />
                                        }
                                        validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                    />
                                </SoknadQuestion>
                                {isVisible(SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet) && (
                                    <FormSection title="Andre utbetalinger fra NAV ">
                                        <SoknadQuestion
                                            name={SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet}
                                            description={<SelvstendigInfo.infoAndreUtbetalingerFraNAV />}
                                            showStop={selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES}
                                            stopMessage={<SelvstendigInfo.StoppYtelseDekkerHeleTapet />}
                                        />
                                    </FormSection>
                                )}
                                {isVisible(SoknadFormField.selvstendigErFrilanser) && (
                                    <FormSection title="Frilanser">
                                        <SoknadQuestion name={SoknadFormField.selvstendigErFrilanser} />
                                        <SoknadQuestion
                                            name={SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden}
                                            legend={txt.selvstendigHarHattInntektSomFrilanserIPerioden(
                                                availableDateRange
                                            )}
                                        />
                                        <SoknadQuestion name={SoknadFormField.selvstendigInntektSomFrilanserIPerioden}>
                                            <FormComponents.Input
                                                name={SoknadFormField.selvstendigInntektSomFrilanserIPerioden}
                                                type="number"
                                                bredde="S"
                                                maxLength={8}
                                                max={MAX_INNTEKT}
                                                label={txt.selvstendigInntektSomFrilanserIPerioden(availableDateRange)}
                                                validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                description={
                                                    <FrilanserInfo.infoHvordanBeregneInntekt
                                                        periode={availableDateRange}
                                                    />
                                                }
                                            />
                                        </SoknadQuestion>
                                    </FormSection>
                                )}
                            </>
                        );
                    }}
                />
            </QuestionVisibilityContext.Provider>
        </SoknadStep>
    );
};

export default SelvstendigAndregangStep;

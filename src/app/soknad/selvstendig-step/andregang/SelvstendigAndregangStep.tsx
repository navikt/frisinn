import React, { useEffect } from 'react';
import { validateRequiredNumber } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import Guide from '../../../components/guide/Guide';
import LoadWrapper from '../../../components/load-wrapper/LoadWrapper';
import VeilederSVG from '../../../components/veileder-svg/VeilederSVG';
import { QuestionVisibilityContext } from '../../../context/QuestionVisibilityContext';
import useTilgjengeligSøkeperiode, { isValidDateRange } from '../../../hooks/useTilgjengeligSøkeperiode';
import FormSection from '../../../pages/intro-page/FormSection';
import { SoknadFormData, SoknadFormField } from '../../../types/SoknadFormData';
import { MIN_DATE_PERIODEVELGER } from '../../../utils/dateUtils';
import { hasValue, MAX_INNTEKT } from '../../../validation/fieldValidations';
import TilgjengeligSøkeperiodeInfo from '../../info/TilgjengeligSøkeperiodeInfo';
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

const SelvstendigAndregangStep = ({ resetSoknad, onValidSubmit, soknadEssentials, stepConfig }: StepConfigProps) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();
    const { søkerOmTaptInntektSomFrilanser, selvstendigHarYtelseFraNavSomDekkerTapet } = values;
    const {
        tidligerePerioder: { harSøktSomSelvstendigNæringsdrivende },
    } = soknadEssentials;

    if (harSøktSomSelvstendigNæringsdrivende === false) {
        return <SoknadErrors.MissingApiDataError />;
    }
    const { søknadsperiode } = soknadEssentials;
    const { selvstendigInntektstapStartetDato, selvstendigBeregnetTilgjengeligSøknadsperiode } = values;

    const avslag = kontrollerSelvstendigAndregangsSvar({ ...values, ...soknadEssentials });

    const payload: SelvstendigAndregangFormConfigPayload = {
        ...values,
        ...soknadEssentials,
        avslag,
    };
    const visibility = SelvstendigFormQuestions.getVisbility(payload);
    const { isVisible, areAllQuestionsAnswered } = visibility;
    const allQuestionsAreAnswered = areAllQuestionsAnswered();

    const { tilgjengeligSøkeperiode, isLoading: tilgjengeligSøkeperiodeIsLoading } = useTilgjengeligSøkeperiode({
        inntektstapStartDato: selvstendigInntektstapStartetDato,
        søknadsperiode: søknadsperiode,
        currentAvailableSøknadsperiode: selvstendigBeregnetTilgjengeligSøknadsperiode,
        startetSøknad: values.startetSøknadTidspunkt,
    });

    const hasValidSelvstendigAndregangsFormData: boolean =
        allQuestionsAreAnswered &&
        isValidDateRange(tilgjengeligSøkeperiode) &&
        selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.NO;

    useEffect(() => {
        setFieldValue(
            SoknadFormField.selvstendigBeregnetTilgjengeligSøknadsperiode,
            isValidDateRange(tilgjengeligSøkeperiode) ? tilgjengeligSøkeperiode : undefined
        );
    }, [tilgjengeligSøkeperiode]);

    return (
        <SoknadStep
            id={StepID.SELVSTENDIG}
            resetSoknad={resetSoknad}
            stepConfig={stepConfig}
            onValidFormSubmit={onValidSubmit}
            stepCleanup={(values) => {
                const v: SoknadFormData = { ...values };
                v.selvstendigSoknadIsOk = hasValidSelvstendigAndregangsFormData;
                v.selvstendigStopReason = hasValidSelvstendigAndregangsFormData ? undefined : getAvslagÅrsak(avslag);
                return cleanupSelvstendigAndregangStep(v, avslag);
            }}
            showSubmitButton={
                hasValidSelvstendigAndregangsFormData ||
                (allQuestionsAreAnswered && søkerOmTaptInntektSomFrilanser === YesOrNo.YES) ||
                avslag.ingenUttaksdager === true
            }>
            <QuestionVisibilityContext.Provider value={{ visibility }}>
                <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                    <SelvstendigInfo.introAndregangssøknad />
                </Guide>
                <SoknadQuestion
                    name={SoknadFormField.selvstendigHarTaptInntektPgaKorona}
                    legend={txt.selvstendigHarTaptInntektPgaKorona(søknadsperiode)}
                    description={<SelvstendigInfo.infoTaptInntektPgaKorona />}
                    showStop={avslag.harIkkeHattInntektstapPgaKorona}
                    stopMessage={<SelvstendigInfo.StoppIkkeTapPgaKorona />}
                />
                <SoknadQuestion
                    name={SoknadFormField.selvstendigInntektstapStartetDato}
                    showInfo={isValidDateRange(tilgjengeligSøkeperiode) && avslag.ingenUttaksdager === false}
                    infoMessage={
                        <TilgjengeligSøkeperiodeInfo
                            inntektstapStartetDato={selvstendigInntektstapStartetDato}
                            tilgjengeligSøkeperiode={tilgjengeligSøkeperiode}
                        />
                    }
                    showStop={
                        avslag.ingenUttaksdager === true ||
                        (tilgjengeligSøkeperiodeIsLoading === false &&
                            hasValue(selvstendigInntektstapStartetDato) &&
                            (avslag.søkerIkkeForGyldigTidsrom === true ||
                                tilgjengeligSøkeperiode === 'NO_AVAILABLE_DATERANGE'))
                    }
                    stopMessage={
                        avslag.ingenUttaksdager ? (
                            <SelvstendigInfo.stopIngenUttaksdager />
                        ) : (
                            <SelvstendigInfo.StoppForSentInntektstap
                                søknadsperiodeinfo={soknadEssentials.søknadsperiodeinfo}
                            />
                        )
                    }>
                    <FormComponents.DatePicker
                        name={SoknadFormField.selvstendigInntektstapStartetDato}
                        label={txt.selvstendigInntektstapStartetDato}
                        description={
                            <SelvstendigInfo.infoNårStartetInntektstapet
                                søknadsperiode={soknadEssentials.søknadsperiode}
                            />
                        }
                        dateLimitations={{
                            minDato: MIN_DATE_PERIODEVELGER,
                            maksDato: søknadsperiode.to,
                        }}
                        dayPickerProps={{
                            initialMonth: søknadsperiode.to,
                        }}
                        useErrorBoundary={true}
                    />
                </SoknadQuestion>
                <LoadWrapper
                    isLoading={tilgjengeligSøkeperiodeIsLoading}
                    contentRenderer={() => {
                        if (
                            tilgjengeligSøkeperiode === undefined ||
                            tilgjengeligSøkeperiode === 'NO_AVAILABLE_DATERANGE' ||
                            avslag.ingenUttaksdager === true
                        ) {
                            return null;
                        }
                        return (
                            <>
                                <SoknadQuestion
                                    name={SoknadFormField.selvstendigInntektIPerioden}
                                    description={<SelvstendigInfo.infoAndreUtbetalingerFraNAV />}>
                                    <FormComponents.Input
                                        name={SoknadFormField.selvstendigInntektIPerioden}
                                        label={txt.selvstendigInntektIPerioden(tilgjengeligSøkeperiode)}
                                        type="number"
                                        bredde="S"
                                        maxLength={8}
                                        max={MAX_INNTEKT}
                                        description={
                                            <SelvstendigInfo.infoHvordanBeregneInntekt
                                                periode={tilgjengeligSøkeperiode}
                                                søknadsperiodeinfo={soknadEssentials.søknadsperiodeinfo}
                                            />
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
                                                tilgjengeligSøkeperiode
                                            )}
                                        />
                                        <SoknadQuestion name={SoknadFormField.selvstendigInntektSomFrilanserIPerioden}>
                                            <FormComponents.Input
                                                name={SoknadFormField.selvstendigInntektSomFrilanserIPerioden}
                                                type="number"
                                                bredde="S"
                                                maxLength={8}
                                                max={MAX_INNTEKT}
                                                label={txt.selvstendigInntektSomFrilanserIPerioden(
                                                    tilgjengeligSøkeperiode
                                                )}
                                                validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                description={
                                                    <FrilanserInfo.infoHvordanBeregneInntekt
                                                        periode={tilgjengeligSøkeperiode}
                                                        søknadsperiodeinfo={soknadEssentials.søknadsperiodeinfo}
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

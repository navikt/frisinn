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
import useTilgjengeligSøkeperiode, { isValidDateRange } from '../../hooks/useTilgjengeligSøkeperiode';
import FormSection from '../../pages/intro-page/FormSection';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { MIN_DATE_PERIODEVELGER } from '../../utils/dateUtils';
import { MAX_INNTEKT } from '../../validation/fieldValidations';
import TilgjengeligSøkeperiodeInfo from '../info/TilgjengeligSøkeperiodeInfo';
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
import { FellesStopIngentUttaksdagerIPeriode } from '../info/FellesInfo';

const getStopReason = (status: FrilanserAvslagStatus): FrilanserAvslagÅrsak | undefined => {
    const feil = Object.keys(status).filter((key) => status[key] === true);
    return feil ? (feil[0] as FrilanserAvslagÅrsak) : undefined;
};

const FrilanserStep = ({ soknadEssentials, stepConfig, resetSoknad, onValidSubmit }: StepConfigProps) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();

    const {
        frilanserInntektstapStartetDato,
        frilanserHarTaptInntektPgaKorona,
        frilanserHarYtelseFraNavSomDekkerTapet,
        frilanserBeregnetTilgjengeligSøknadsperiode,
        frilanserHarMottattUtbetalingTidligere,
    } = values;
    const {
        søknadsperiode,
        tidligerePerioder: { harSøktSomFrilanser },
    } = soknadEssentials;
    const { tilgjengeligSøkeperiode, isLoading: tilgjengeligSøkeperiodeIsLoading } = useTilgjengeligSøkeperiode({
        inntektstapStartDato: frilanserInntektstapStartetDato,
        søknadsperiode: søknadsperiode,
        currentAvailableSøknadsperiode: frilanserBeregnetTilgjengeligSøknadsperiode,
        startetSøknad: values.startetSøknadTidspunkt,
        harMottattUtbetalingTidligere: frilanserHarMottattUtbetalingTidligere,
    });

    const isLoading = tilgjengeligSøkeperiodeIsLoading;
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
        isValidDateRange(tilgjengeligSøkeperiode) &&
        frilanserHarTaptInntektPgaKorona === YesOrNo.YES &&
        frilanserHarYtelseFraNavSomDekkerTapet === YesOrNo.NO &&
        avslag.ingenUttaksdager === false;

    useEffect(() => {
        setFieldValue(
            SoknadFormField.frilanserBeregnetTilgjengeligSøknadsperiode,
            isValidDateRange(tilgjengeligSøkeperiode) ? tilgjengeligSøkeperiode : undefined
        );
        setFieldValue(SoknadFormField.frilanserSoknadIsOk, frilanserSoknadIsOk);
    }, [tilgjengeligSøkeperiode, frilanserSoknadIsOk]);

    return (
        <SoknadStep
            id={StepID.FRILANSER}
            onValidFormSubmit={onValidSubmit}
            resetSoknad={resetSoknad}
            stepConfig={stepConfig}
            stepCleanup={(values) => {
                const v = { ...values };
                v.frilanserSoknadIsOk = frilanserSoknadIsOk;
                v.frilanserStopReason = frilanserSoknadIsOk ? undefined : getStopReason(avslag);
                return cleanupFrilanserStep(v, avslag, harSøktSomFrilanser);
            }}
            showSubmitButton={!isLoading && (frilanserSoknadIsOk || allQuestionsAreAnswered)}>
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
                    name={SoknadFormField.frilanserHarTaptInntektPgaKorona}
                    legend={soknadQuestionText.frilanserHarTaptInntektPgaKorona(søknadsperiode)}
                    description={<FrilanserInfo.infoTaptInntektPgaKorona />}
                    showStop={avslag.harIkkeHattInntektstapPgaKorona}
                    stopMessage={<FrilanserInfo.StoppIkkeTapPgaKorona />}
                />

                <SoknadQuestion
                    name={SoknadFormField.frilanserHarMottattUtbetalingTidligere}
                    legend={soknadQuestionText.frilanserHarMottattUtbetalingTidligere}
                    showInfo={frilanserHarMottattUtbetalingTidligere === YesOrNo.YES}
                    infoMessage={
                        <TilgjengeligSøkeperiodeInfo
                            inntektstapStartetDato={frilanserInntektstapStartetDato}
                            tilgjengeligSøkeperiode={tilgjengeligSøkeperiode}
                            harAlleredeMottatUtbetalingFraOrdning={true}
                        />
                    }
                />

                <SoknadQuestion
                    name={SoknadFormField.frilanserInntektstapStartetDato}
                    showInfo={isValidDateRange(tilgjengeligSøkeperiode) && avslag.ingenUttaksdager === false}
                    infoMessage={
                        <TilgjengeligSøkeperiodeInfo
                            inntektstapStartetDato={frilanserInntektstapStartetDato}
                            tilgjengeligSøkeperiode={tilgjengeligSøkeperiode}
                        />
                    }
                    stopMessage={<FellesStopIngentUttaksdagerIPeriode />}
                    showStop={avslag.ingenUttaksdager}>
                    <SoknadFormComponents.DatePicker
                        name={SoknadFormField.frilanserInntektstapStartetDato}
                        label={soknadQuestionText.frilanserInntektstapStartetDato}
                        description={
                            <SelvstendigInfo.infoNårStartetInntektstapet
                                søknadsperiode={soknadEssentials.søknadsperiode}
                            />
                        }
                        minDate={MIN_DATE_PERIODEVELGER}
                        maxDate={søknadsperiode.to}
                        dayPickerProps={{
                            initialMonth: søknadsperiode.to,
                        }}
                        useErrorBoundary={true}
                    />
                </SoknadQuestion>

                {values.frilanserHarTaptInntektPgaKorona === YesOrNo.YES && (
                    <LoadWrapper
                        isLoading={isLoading}
                        contentRenderer={() => {
                            if (tilgjengeligSøkeperiode === undefined) {
                                return null;
                            }

                            if (tilgjengeligSøkeperiode === 'NO_AVAILABLE_DATERANGE') {
                                return (
                                    <StopMessage>
                                        <FrilanserInfo.StoppForSentInntektstap
                                            søknadsperiodeinfo={soknadEssentials.søknadsperiodeinfo}
                                        />
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
                                                <FrilanserInfo.infoHvordanBeregneInntekt
                                                    periode={tilgjengeligSøkeperiode}
                                                    søknadsperiodeinfo={soknadEssentials.søknadsperiodeinfo}
                                                />
                                            }
                                            label={soknadQuestionText.frilanserInntektIPerioden(
                                                tilgjengeligSøkeperiode
                                            )}
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
                                                    tilgjengeligSøkeperiode
                                                )}
                                            />
                                            <SoknadQuestion
                                                name={SoknadFormField.frilanserInntektSomSelvstendigIPerioden}>
                                                <SoknadFormComponents.Input
                                                    name={SoknadFormField.frilanserInntektSomSelvstendigIPerioden}
                                                    type="number"
                                                    bredde="S"
                                                    label={soknadQuestionText.frilanserInntektSomSelvstendigIPerioden(
                                                        tilgjengeligSøkeperiode
                                                    )}
                                                    maxLength={8}
                                                    max={MAX_INNTEKT}
                                                    description={
                                                        <SelvstendigInfo.infoHvordanBeregneInntekt
                                                            periode={tilgjengeligSøkeperiode}
                                                            søknadsperiodeinfo={soknadEssentials.søknadsperiodeinfo}
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

import React, { useEffect } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { validateRequiredField, validateRequiredNumber } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import moment from 'moment';
import ResponsivePanel from 'common/components/responsive-panel/ResponsivePanel';
import Guide from '../../components/guide/Guide';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import StopMessage from '../../components/stop-message/StopMessage';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import { QuestionVisibilityContext } from '../../context/QuestionVisibilityContext';
import useAvailableSøknadsperiode, { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import FormSection from '../../pages/intro-page/FormSection';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { hasValidHistoriskInntekt, selvstendigSkalOppgiInntekt2019 } from '../../utils/selvstendigUtils';
import { MAX_INNTEKT, validateAll, validatePhoneNumber } from '../../validation/fieldValidations';
import AvailableDateRangeInfo from '../content/AvailableDateRangeInfo';
import FormComponents from '../SoknadFormComponents';
import SoknadQuestion from '../SoknadQuestion';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { cleanupSelvstendigStep } from './cleanupSelvstendigStep';
import { SelvstendigFormPayload, SelvstendigFormQuestions } from './selvstendigFormConfig';
import SelvstendigInfo from './SelvstendigInfo';
import { selvstendigStepTexts } from './selvstendigStepTexts';

const MIN_DATE: Date = apiStringDateToDate('2020-02-01');

const txt = selvstendigStepTexts;

const SelvstendigStep = ({ resetSoknad: resetSoknad, onValidSubmit, soknadEssentials }: StepConfigProps) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();
    const {
        selvstendigInntektstapStartetDato,
        selvstendigHarHattInntektFraForetak,
        selvstendigHarTaptInntektPgaKorona,
        søkerOmTaptInntektSomFrilanser,
        selvstendigYtelseFraNavDekkerHeleTapet,
        selvstendigInntekt2019,
        selvstendigInntekt2020,
        selvstendigHarYtelseFraNavSomDekkerTapet,
    } = values;
    const { currentSøknadsperiode, personligeForetak } = soknadEssentials;
    const { foretak = [] } = personligeForetak || {};
    const antallForetak = foretak.length;

    const { availableDateRange, isLoading: availableDateRangeIsLoading } = useAvailableSøknadsperiode(
        selvstendigInntektstapStartetDato,
        currentSøknadsperiode
    );

    const isLoading = availableDateRangeIsLoading;

    const inntektÅrstall = selvstendigSkalOppgiInntekt2019(personligeForetak) ? 2019 : 2020;
    const payload: SelvstendigFormPayload = {
        ...values,
        ...soknadEssentials,
        availableDateRange,
        inntektÅrstall,
    };
    const visibility = SelvstendigFormQuestions.getVisbility(payload);

    const { isVisible, areAllQuestionsAnswered } = visibility;

    const allQuestionsAreAnswered = areAllQuestionsAnswered();

    const hasValidSelvstendigFormData: boolean =
        allQuestionsAreAnswered &&
        isValidDateRange(availableDateRange) &&
        hasValidHistoriskInntekt(values, inntektÅrstall) &&
        selvstendigHarHattInntektFraForetak === YesOrNo.YES &&
        selvstendigHarTaptInntektPgaKorona === YesOrNo.YES &&
        selvstendigYtelseFraNavDekkerHeleTapet !== YesOrNo.YES;

    useEffect(() => {
        setFieldValue(SoknadFormField.selvstendigBeregnetTilgjengeligSøknadsperiode, availableDateRange);
        setFieldValue(SoknadFormField.selvstendigSoknadIsOk, hasValidSelvstendigFormData);
    }, [availableDateRange, hasValidSelvstendigFormData]);

    return (
        <SoknadStep
            id={StepID.SELVSTENDIG}
            resetSoknad={resetSoknad}
            onValidFormSubmit={onValidSubmit}
            stepCleanup={(values) => cleanupSelvstendigStep(values)}
            showSubmitButton={
                !isLoading &&
                (hasValidSelvstendigFormData ||
                    (allQuestionsAreAnswered && søkerOmTaptInntektSomFrilanser === YesOrNo.YES))
            }>
            <QuestionVisibilityContext.Provider value={{ visibility }}>
                <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                    <SelvstendigInfo.intro antallForetak={antallForetak} foretak={foretak} />
                </Guide>

                <SoknadQuestion
                    name={SoknadFormField.selvstendigHarHattInntektFraForetak}
                    legend={txt.selvstendigHarHattInntektFraForetak(inntektÅrstall)}
                    description={<SelvstendigInfo.infoInntektÅrstall inntektÅrstall={inntektÅrstall} />}
                    showStop={selvstendigHarHattInntektFraForetak === YesOrNo.NO}
                    stopMessage={<SelvstendigInfo.advarselIkkeHattInntektFraForetak inntektÅrstall={inntektÅrstall} />}
                />
                <SoknadQuestion
                    name={SoknadFormField.selvstendigHarTaptInntektPgaKorona}
                    legend={txt.selvstendigHarTaptInntektPgaKorona(currentSøknadsperiode)}
                    description={<SelvstendigInfo.koronaTaptInntekt />}
                    showStop={
                        selvstendigHarHattInntektFraForetak === YesOrNo.YES &&
                        selvstendigHarTaptInntektPgaKorona === YesOrNo.NO
                    }
                    stopMessage={<SelvstendigInfo.advarselIkkeTapPgaKorona />}
                />
                <SoknadQuestion
                    name={SoknadFormField.selvstendigInntektstapStartetDato}
                    showInfo={isValidDateRange(availableDateRange)}
                    infoMessage={
                        isValidDateRange(availableDateRange) ? (
                            <AvailableDateRangeInfo
                                inntektstapStartetDato={selvstendigInntektstapStartetDato}
                                availableDateRange={availableDateRange}
                            />
                        ) : null
                    }>
                    <FormComponents.DatePicker
                        name={SoknadFormField.selvstendigInntektstapStartetDato}
                        label={txt.selvstendigInntektstapStartetDato}
                        dateLimitations={{
                            minDato: MIN_DATE,
                            maksDato: currentSøknadsperiode.to,
                        }}
                    />
                </SoknadQuestion>
                {selvstendigHarTaptInntektPgaKorona === YesOrNo.YES && (
                    <LoadWrapper
                        isLoading={isLoading}
                        contentRenderer={() => {
                            if (availableDateRange === undefined) {
                                return null;
                            }
                            if (availableDateRange === 'NO_AVAILABLE_DATERANGE') {
                                return (
                                    <StopMessage>
                                        <SelvstendigInfo.advarselForSentInntektstap
                                            nesteMaaned={moment(currentSøknadsperiode.to).add(1, 'day').toDate()}
                                        />
                                    </StopMessage>
                                );
                            }
                            return (
                                <>
                                    {isVisible(SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet) && (
                                        <FormSection title="Andre utbetalinger fra NAV ">
                                            <SoknadQuestion
                                                name={SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet}
                                                description={<SelvstendigInfo.andreUtbetalingerFraNAV />}
                                            />
                                            <SoknadQuestion
                                                name={SoknadFormField.selvstendigYtelseFraNavDekkerHeleTapet}
                                                description={<SelvstendigInfo.andreUtbetalingerFraNAV />}
                                                showStop={
                                                    selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES &&
                                                    selvstendigYtelseFraNavDekkerHeleTapet === YesOrNo.YES
                                                }
                                                stopMessage={<SelvstendigInfo.ytelseDekkerHeleTapet />}
                                            />
                                        </FormSection>
                                    )}
                                    {isVisible(SoknadFormField.selvstendigInntektIPerioden) && (
                                        <FormSection title={`Inntekt du har tatt ut i perioden`}>
                                            <SoknadQuestion
                                                name={SoknadFormField.selvstendigInntektIPerioden}
                                                description={<SelvstendigInfo.andreUtbetalingerFraNAV />}>
                                                <FormComponents.Input
                                                    name={SoknadFormField.selvstendigInntektIPerioden}
                                                    label={txt.selvstendigInntektIPerioden(availableDateRange)}
                                                    type="number"
                                                    bredde="S"
                                                    description={<SelvstendigInfo.infoInntektForetak />}
                                                    validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                />
                                            </SoknadQuestion>
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
                                            <SoknadQuestion
                                                name={SoknadFormField.selvstendigInntektSomFrilanserIPerioden}>
                                                <FormComponents.Input
                                                    name={SoknadFormField.selvstendigInntektSomFrilanserIPerioden}
                                                    type="number"
                                                    bredde="S"
                                                    label={txt.selvstendigInntektSomFrilanserIPerioden(
                                                        availableDateRange
                                                    )}
                                                    validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                />
                                            </SoknadQuestion>
                                        </FormSection>
                                    )}
                                    {isVisible(SoknadFormField.selvstendigInntekt2019) && (
                                        <FormSection title="Inntekter du har tatt ut av selskap i 2019">
                                            <SoknadQuestion
                                                name={SoknadFormField.selvstendigInntekt2019}
                                                showStop={selvstendigInntekt2019 === 0}
                                                stopMessage={<SelvstendigInfo.ingenInntektStopp årstall={2019} />}>
                                                <FormComponents.Input
                                                    name={SoknadFormField.selvstendigInntekt2019}
                                                    type="number"
                                                    bredde="S"
                                                    label={txt.selvstendigInntekt2019}
                                                    validate={validateAll([
                                                        validateRequiredNumber({ min: 0, max: MAX_INNTEKT }),
                                                    ])}
                                                    description={
                                                        antallForetak > 1 ? (
                                                            <SelvstendigInfo.infoInntektFlereSelskaper />
                                                        ) : undefined
                                                    }
                                                />
                                            </SoknadQuestion>
                                        </FormSection>
                                    )}
                                    {isVisible(SoknadFormField.selvstendigInntekt2020) && (
                                        <FormSection title="Inntekter du har tatt ut av selskap i 2020">
                                            <SoknadQuestion
                                                name={SoknadFormField.selvstendigInntekt2020}
                                                showStop={selvstendigInntekt2020 === 0}
                                                stopMessage={<SelvstendigInfo.ingenInntektStopp årstall={2020} />}>
                                                <FormComponents.Input
                                                    name={SoknadFormField.selvstendigInntekt2020}
                                                    type="number"
                                                    bredde="S"
                                                    label={txt.selvstendigInntekt2020}
                                                    validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                    description={
                                                        antallForetak > 1 ? (
                                                            <SelvstendigInfo.infoInntektFlereSelskaper />
                                                        ) : undefined
                                                    }
                                                />
                                            </SoknadQuestion>
                                        </FormSection>
                                    )}
                                    {isVisible(SoknadFormField.selvstendigHarRegnskapsfører) && (
                                        <FormSection title="Regnskapsfører">
                                            <SoknadQuestion name={SoknadFormField.selvstendigHarRegnskapsfører} />
                                            {isVisible(SoknadFormField.selvstendigRegnskapsførerNavn) && (
                                                <Box margin="l">
                                                    <ResponsivePanel>
                                                        <Box padBottom="l">
                                                            {antallForetak >= 1 && (
                                                                <>
                                                                    Hvis du har flere regnskapsførere, gir du
                                                                    opplysninger om den som er din hovedregnskapsfører.
                                                                </>
                                                            )}
                                                            <SoknadQuestion
                                                                name={SoknadFormField.selvstendigRegnskapsførerNavn}>
                                                                <FormComponents.Input
                                                                    name={SoknadFormField.selvstendigRegnskapsførerNavn}
                                                                    label={txt.selvstendigRegnskapsførerNavn}
                                                                    validate={validateRequiredField}
                                                                />
                                                            </SoknadQuestion>

                                                            <SoknadQuestion
                                                                name={SoknadFormField.selvstendigRegnskapsførerTelefon}
                                                                margin="l">
                                                                <FormComponents.Input
                                                                    name={
                                                                        SoknadFormField.selvstendigRegnskapsførerTelefon
                                                                    }
                                                                    label={txt.selvstendigRegnskapsførerTelefon}
                                                                    bredde="M"
                                                                    maxLength={12}
                                                                    validate={validatePhoneNumber}
                                                                />
                                                            </SoknadQuestion>
                                                        </Box>
                                                    </ResponsivePanel>
                                                </Box>
                                            )}
                                        </FormSection>
                                    )}
                                    {isVisible(SoknadFormField.selvstendigHarRevisor) && (
                                        <FormSection title="Revisor">
                                            <SoknadQuestion name={SoknadFormField.selvstendigHarRevisor} />
                                            {isVisible(SoknadFormField.selvstendigRevisorNavn) && (
                                                <Box margin="l">
                                                    <ResponsivePanel>
                                                        <Box padBottom="l">
                                                            {antallForetak >= 1 && (
                                                                <>
                                                                    Dersom du har flere revisorer, kan du oppgi
                                                                    informasjon om din hoverrevisor.
                                                                </>
                                                            )}
                                                            <SoknadQuestion
                                                                name={SoknadFormField.selvstendigRevisorNavn}
                                                                margin="l">
                                                                <FormComponents.Input
                                                                    name={SoknadFormField.selvstendigRevisorNavn}
                                                                    label={txt.selvstendigRevisorNavn}
                                                                    validate={validateRequiredField}
                                                                />
                                                            </SoknadQuestion>
                                                            <SoknadQuestion
                                                                name={SoknadFormField.selvstendigRevisorTelefon}
                                                                margin="l">
                                                                <FormComponents.Input
                                                                    label={txt.selvstendigRevisorTelefon}
                                                                    name={SoknadFormField.selvstendigRevisorTelefon}
                                                                    bredde="M"
                                                                    maxLength={12}
                                                                    validate={validatePhoneNumber}
                                                                />
                                                            </SoknadQuestion>
                                                            <SoknadQuestion
                                                                name={SoknadFormField.selvstendigRevisorNAVKanTaKontakt}
                                                                margin="l"
                                                            />
                                                        </Box>
                                                    </ResponsivePanel>
                                                </Box>
                                            )}
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

export default SelvstendigStep;

import React, { useEffect } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    validateRequiredNumber,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import ResponsivePanel from 'common/components/responsive-panel/ResponsivePanel';
import Guide from '../../components/guide/Guide';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import StopMessage from '../../components/StopMessage';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import useAlderCheck from '../../hooks/useAlderCheck';
import useAvailableSøknadsperiode, { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import FormSection from '../../pages/intro-page/FormSection';
import { SoknadFormData, SoknadFormField as Field } from '../../types/SoknadFormData';
import { ensureString } from '../../utils/ensureString';
import { MAX_INNTEKT, validateAll } from '../../validation/fieldValidations';
import AvailableDateRangeInfo from '../content/AvailableDateRangeInfo';
import FormComponents from '../SoknadFormComponents';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { SelvstendigFormQuestions } from './selvstendigFormConfig';
import SelvstendigInfo from './SelvstendigInfo';
import SelvstendigQuestion from './SelvstendigFormQuestion';
import { selvstendigStepTexts } from './selvstendigStepTexts';
import { cleanupSelvstendigStep } from './cleanupSelvstendigStep';
import { QuestionVisibilityContext } from '../../context/QuestionVisibilityContext';

const MIN_DATE: Date = apiStringDateToDate('2020-02-01');

const txt = selvstendigStepTexts;

const SelvstendigStep = ({ resetSoknad: resetSoknad, onValidSubmit, soknadEssentials }: StepConfigProps) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();
    const {
        selvstendigInntektstapStartetDato,
        selvstendigHarTaptInntektPgaKorona,
        søkerOmTaptInntektSomFrilanser,
    } = values;
    const { currentSøknadsperiode, personligeForetak } = soknadEssentials;
    const { foretak = [] } = personligeForetak || {};
    const antallForetak = foretak.length;

    const {
        availableDateRange,
        isLimitedDateRange,
        isLoading: availableDateRangeIsLoading,
    } = useAvailableSøknadsperiode(selvstendigInntektstapStartetDato, currentSøknadsperiode);

    const { result: alderCheckResult, isLoading: alderCheckIsLoading } = useAlderCheck(
        isValidDateRange(availableDateRange) ? availableDateRange : undefined
    );

    const isLoading = availableDateRangeIsLoading || alderCheckIsLoading;

    const visibility = SelvstendigFormQuestions.getVisbility({
        ...values,
        ...soknadEssentials,
        availableDateRange,
    });
    const { isVisible, areAllQuestionsAnswered } = visibility;

    const hasValidSelvstendigFormData: boolean =
        areAllQuestionsAnswered() &&
        isValidDateRange(availableDateRange) &&
        alderCheckResult?.innfrirKrav === true &&
        selvstendigHarTaptInntektPgaKorona === YesOrNo.YES;

    useEffect(() => {
        setFieldValue(Field.selvstendigCalculatedDateRange, availableDateRange);
    }, [availableDateRange]);

    return (
        <SoknadStep
            id={StepID.SELVSTENDIG}
            resetSoknad={resetSoknad}
            onValidFormSubmit={onValidSubmit}
            stepCleanup={(values) => cleanupSelvstendigStep(values, hasValidSelvstendigFormData)}
            showSubmitButton={
                !isLoading && (hasValidSelvstendigFormData || søkerOmTaptInntektSomFrilanser === YesOrNo.YES)
            }>
            <QuestionVisibilityContext.Provider value={{ visibility }}>
                <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                    <SelvstendigInfo.intro antallForetak={antallForetak} foretak={foretak} />
                </Guide>
                <SelvstendigQuestion question={Field.selvstendigHarTaptInntektPgaKorona}>
                    <FormComponents.YesOrNoQuestion
                        name={Field.selvstendigHarTaptInntektPgaKorona}
                        legend={ensureString(txt.selvstendigHarTaptInntektPgaKorona(currentSøknadsperiode))}
                        validate={validateYesOrNoIsAnswered}
                    />
                </SelvstendigQuestion>
                {selvstendigHarTaptInntektPgaKorona === YesOrNo.NO && (
                    <StopMessage>
                        <SelvstendigInfo.advarselIkkeTapPgaKorona />
                    </StopMessage>
                )}
                <SelvstendigQuestion question={Field.selvstendigInntektstapStartetDato}>
                    <FormComponents.DatePicker
                        name={Field.selvstendigInntektstapStartetDato}
                        label={ensureString(txt.selvstendigInntektstapStartetDato)}
                        dateLimitations={{
                            minDato: MIN_DATE,
                            maksDato: currentSøknadsperiode.to,
                        }}
                    />
                    {isValidDateRange(availableDateRange) &&
                        alderCheckIsLoading === false &&
                        alderCheckResult?.innfrirKrav === true && (
                            <Box margin="l" padBottom="xxl">
                                <AvailableDateRangeInfo
                                    inntektstapStartetDato={selvstendigInntektstapStartetDato}
                                    availableDateRange={availableDateRange}
                                    isLimitedDateRange={isLimitedDateRange}
                                />
                            </Box>
                        )}
                </SelvstendigQuestion>
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
                                        <SelvstendigInfo.advarselForSentInntektstap />
                                    </StopMessage>
                                );
                            }
                            if (alderCheckResult?.innfrirKrav === false) {
                                return (
                                    <StopMessage>
                                        <SelvstendigInfo.advarselAlderSjekkFeiler />
                                    </StopMessage>
                                );
                            }
                            return (
                                <>
                                    <FormSection title="Ytelser fra NAV">
                                        <SelvstendigQuestion question={Field.selvstendigHarYtelseFraNavSomDekkerTapet}>
                                            <FormComponents.YesOrNoQuestion
                                                name={Field.selvstendigHarYtelseFraNavSomDekkerTapet}
                                                legend={ensureString(txt.selvstendigHarYtelseFraNavSomDekkerTapet)}
                                            />
                                        </SelvstendigQuestion>
                                        <SelvstendigQuestion question={Field.selvstendigYtelseFraNavDekkerHeleTapet}>
                                            <FormComponents.YesOrNoQuestion
                                                name={Field.selvstendigYtelseFraNavDekkerHeleTapet}
                                                legend={ensureString(txt.selvstendigYtelseFraNavDekkerHeleTapet)}
                                            />
                                        </SelvstendigQuestion>
                                    </FormSection>
                                    {isVisible(Field.selvstendigInntektIPerioden) && (
                                        <FormSection title="Inntekt i perioden du søker for">
                                            <SelvstendigQuestion question={Field.selvstendigInntektIPerioden}>
                                                <FormComponents.Input
                                                    name={Field.selvstendigInntektIPerioden}
                                                    label={ensureString(
                                                        txt.selvstendigInntektIPerioden(availableDateRange)
                                                    )}
                                                    type="number"
                                                    bredde="S"
                                                    description={<SelvstendigInfo.infoInntektForetak />}
                                                    validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                />
                                            </SelvstendigQuestion>
                                        </FormSection>
                                    )}
                                    {isVisible(Field.selvstendigErFrilanser) && (
                                        <FormSection title="Frilanser">
                                            <SelvstendigQuestion question={Field.selvstendigErFrilanser}>
                                                <FormComponents.YesOrNoQuestion
                                                    name={Field.selvstendigErFrilanser}
                                                    legend={ensureString(txt.selvstendigErFrilanser)}
                                                />
                                            </SelvstendigQuestion>
                                            <SelvstendigQuestion
                                                question={Field.selvstendigHarHattInntektSomFrilanserIPerioden}>
                                                <FormComponents.YesOrNoQuestion
                                                    name={Field.selvstendigHarHattInntektSomFrilanserIPerioden}
                                                    legend={ensureString(
                                                        txt.selvstendigHarHattInntektSomFrilanserIPerioden(
                                                            availableDateRange
                                                        )
                                                    )}
                                                />
                                            </SelvstendigQuestion>
                                            <SelvstendigQuestion
                                                question={Field.selvstendigInntektSomFrilanserIPerioden}>
                                                <FormComponents.Input
                                                    name={Field.selvstendigInntektSomFrilanserIPerioden}
                                                    type="number"
                                                    bredde="S"
                                                    label={ensureString(
                                                        txt.selvstendigInntektSomFrilanserIPerioden(availableDateRange)
                                                    )}
                                                    validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                />
                                            </SelvstendigQuestion>
                                        </FormSection>
                                    )}
                                    {isVisible(Field.selvstendigInntekt2019) && (
                                        <FormSection title="Inntekt i 2019">
                                            <SelvstendigQuestion question={Field.selvstendigInntekt2019}>
                                                <FormComponents.Input
                                                    name={Field.selvstendigInntekt2019}
                                                    type="number"
                                                    bredde="S"
                                                    label={ensureString(txt.selvstendigInntekt2019)}
                                                    validate={validateAll([
                                                        validateRequiredNumber({ min: 0, max: MAX_INNTEKT }),
                                                    ])}
                                                />
                                            </SelvstendigQuestion>
                                        </FormSection>
                                    )}
                                    {isVisible(Field.selvstendigInntekt2020) && (
                                        <FormSection title="Inntekt i 2020">
                                            <SelvstendigQuestion question={Field.selvstendigInntekt2020}>
                                                <FormComponents.Input
                                                    name={Field.selvstendigInntekt2020}
                                                    type="number"
                                                    bredde="S"
                                                    label={ensureString(
                                                        txt.selvstendigInntekt2020(selvstendigInntektstapStartetDato)
                                                    )}
                                                    validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                />
                                            </SelvstendigQuestion>
                                        </FormSection>
                                    )}
                                    {isVisible(Field.selvstendigHarRegnskapsfører) && (
                                        <FormSection title="Regnskapsfører">
                                            <SelvstendigQuestion question={Field.selvstendigHarRegnskapsfører}>
                                                <FormComponents.YesOrNoQuestion
                                                    name={Field.selvstendigHarRegnskapsfører}
                                                    legend={ensureString(txt.selvstendigHarRegnskapsfører)}
                                                />
                                            </SelvstendigQuestion>
                                            {isVisible(Field.selvstendigRegnskapsførerNavn) && (
                                                <Box margin="l">
                                                    <ResponsivePanel>
                                                        {antallForetak >= 1 && (
                                                            <Box padBottom="l">
                                                                Dersom du har flere regnskapsførere, kan du oppgi
                                                                informasjon om din hovedregnskapsfører.
                                                            </Box>
                                                        )}
                                                        <SelvstendigQuestion
                                                            question={Field.selvstendigRegnskapsførerNavn}>
                                                            <FormComponents.Input
                                                                name={Field.selvstendigRegnskapsførerNavn}
                                                                label={ensureString(txt.selvstendigRegnskapsførerNavn)}
                                                            />
                                                        </SelvstendigQuestion>
                                                        <SelvstendigQuestion
                                                            question={Field.selvstendigRegnskapsførerTelefon}>
                                                            <FormComponents.Input
                                                                name={Field.selvstendigRegnskapsførerTelefon}
                                                                label={ensureString(
                                                                    txt.selvstendigRegnskapsførerTelefon
                                                                )}
                                                                bredde="M"
                                                                maxLength={12}
                                                            />
                                                        </SelvstendigQuestion>
                                                    </ResponsivePanel>
                                                </Box>
                                            )}
                                        </FormSection>
                                    )}
                                    {isVisible(Field.selvstendigHarRevisor) && (
                                        <FormSection title="Revisor">
                                            <SelvstendigQuestion question={Field.selvstendigHarRevisor}>
                                                <FormComponents.YesOrNoQuestion
                                                    name={Field.selvstendigHarRevisor}
                                                    legend={ensureString(txt.selvstendigHarRevisor)}
                                                />
                                            </SelvstendigQuestion>
                                            {isVisible(Field.selvstendigRevisorNavn) && (
                                                <Box margin="l">
                                                    <ResponsivePanel>
                                                        {antallForetak >= 1 && (
                                                            <Box padBottom="l">
                                                                Dersom du har flere revisorer, kan du oppgi informasjon
                                                                om din hoverrevisor.
                                                            </Box>
                                                        )}
                                                        <SelvstendigQuestion question={Field.selvstendigRevisorNavn}>
                                                            <FormComponents.Input
                                                                name={Field.selvstendigRevisorNavn}
                                                                label={ensureString(txt.selvstendigRevisorNavn)}
                                                            />
                                                        </SelvstendigQuestion>
                                                        <SelvstendigQuestion question={Field.selvstendigRevisorTelefon}>
                                                            <FormComponents.Input
                                                                label={ensureString(txt.selvstendigRevisorTelefon)}
                                                                name={Field.selvstendigRevisorTelefon}
                                                                bredde="M"
                                                                maxLength={12}
                                                            />
                                                        </SelvstendigQuestion>
                                                        <SelvstendigQuestion
                                                            question={Field.selvstendigRevisorNAVKanTaKontakt}>
                                                            <FormComponents.YesOrNoQuestion
                                                                name={Field.selvstendigRevisorNAVKanTaKontakt}
                                                                legend={ensureString(
                                                                    txt.selvstendigRevisorNAVKanTaKontakt
                                                                )}
                                                            />
                                                        </SelvstendigQuestion>
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

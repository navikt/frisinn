import React, { useEffect } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { validateRequiredNumber } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import ResponsivePanel from 'common/components/responsive-panel/ResponsivePanel';
import Guide from '../../components/guide/Guide';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import StopMessage from '../../components/StopMessage';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import { QuestionVisibilityContext } from '../../context/QuestionVisibilityContext';
import useAvailableSøknadsperiode, { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import FormSection from '../../pages/intro-page/FormSection';
import { SoknadFormData, SoknadFormField as Field } from '../../types/SoknadFormData';
import { ensureString } from '../../utils/ensureString';
import { MAX_INNTEKT, validateAll } from '../../validation/fieldValidations';
import AvailableDateRangeInfo from '../content/AvailableDateRangeInfo';
import FormComponents from '../SoknadFormComponents';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { cleanupSelvstendigStep } from './cleanupSelvstendigStep';
import { SelvstendigFormQuestions, SelvstendigFormPayload } from './selvstendigFormConfig';
import SelvstendigQuestion from './SelvstendigFormQuestion';
import SelvstendigInfo from './SelvstendigInfo';
import { selvstendigStepTexts } from './selvstendigStepTexts';
import { selvstendigSkalOppgiInntekt2019, hasValidHistoriskInntekt } from '../../utils/selvstendigUtils';
// import selvstendigRegler from './selvstendigRegler';

const MIN_DATE: Date = apiStringDateToDate('2020-02-01');

const txt = selvstendigStepTexts;

// const kjørRegler = (payload: SelvstendigFormPayload) => {
//     return selvstendigRegler.map((regel) => {
//         const resultat = regel.test(payload);
//         return {
//             key: regel.key,
//             passerer: resultat.passerer,
//         };
//     });
// };

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
    // console.log(kjørRegler(payload));

    const hasValidSelvstendigFormData: boolean =
        areAllQuestionsAnswered() &&
        isValidDateRange(availableDateRange) &&
        selvstendigHarHattInntektFraForetak === YesOrNo.YES &&
        selvstendigHarTaptInntektPgaKorona === YesOrNo.YES &&
        hasValidHistoriskInntekt(values, inntektÅrstall) &&
        selvstendigYtelseFraNavDekkerHeleTapet !== YesOrNo.YES;

    useEffect(() => {
        setFieldValue(Field.selvstendigCalculatedDateRange, availableDateRange);
    }, [availableDateRange]);

    return (
        <SoknadStep
            id={StepID.SELVSTENDIG}
            resetSoknad={resetSoknad}
            onValidFormSubmit={onValidSubmit}
            stepCleanup={(values) => cleanupSelvstendigStep(values)}
            showSubmitButton={
                !isLoading &&
                (hasValidSelvstendigFormData ||
                    (areAllQuestionsAnswered() && søkerOmTaptInntektSomFrilanser === YesOrNo.YES))
            }>
            <QuestionVisibilityContext.Provider value={{ visibility }}>
                <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                    <SelvstendigInfo.intro antallForetak={antallForetak} foretak={foretak} />
                </Guide>
                <SelvstendigQuestion question={Field.selvstendigHarHattInntektFraForetak}>
                    <FormComponents.YesOrNoQuestion
                        name={Field.selvstendigHarHattInntektFraForetak}
                        legend={ensureString(txt.selvstendigHarHattInntektFraForetak(inntektÅrstall))}
                        description={
                            <SelvstendigInfo.infoInntektÅrstall foretak={foretak} inntektÅrstall={inntektÅrstall} />
                        }
                    />
                </SelvstendigQuestion>
                {selvstendigHarHattInntektFraForetak === YesOrNo.NO && (
                    <StopMessage>
                        <SelvstendigInfo.advarselIkkeHattInntektFraForetak inntektÅrstall={inntektÅrstall} />
                    </StopMessage>
                )}
                <SelvstendigQuestion question={Field.selvstendigHarTaptInntektPgaKorona}>
                    <FormComponents.YesOrNoQuestion
                        name={Field.selvstendigHarTaptInntektPgaKorona}
                        legend={ensureString(txt.selvstendigHarTaptInntektPgaKorona(currentSøknadsperiode))}
                    />
                </SelvstendigQuestion>
                {selvstendigHarHattInntektFraForetak === YesOrNo.YES &&
                    selvstendigHarTaptInntektPgaKorona === YesOrNo.NO && (
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
                    {isValidDateRange(availableDateRange) && (
                        <Box margin="l" padBottom="xxl">
                            <AvailableDateRangeInfo
                                inntektstapStartetDato={selvstendigInntektstapStartetDato}
                                availableDateRange={availableDateRange}
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
                            return (
                                <>
                                    {isVisible(Field.selvstendigHarYtelseFraNavSomDekkerTapet) && (
                                        <FormSection title="Ytelser fra NAV">
                                            <SelvstendigQuestion
                                                question={Field.selvstendigHarYtelseFraNavSomDekkerTapet}>
                                                <FormComponents.YesOrNoQuestion
                                                    name={Field.selvstendigHarYtelseFraNavSomDekkerTapet}
                                                    legend={ensureString(txt.selvstendigHarYtelseFraNavSomDekkerTapet)}
                                                />
                                            </SelvstendigQuestion>
                                            <SelvstendigQuestion
                                                question={Field.selvstendigYtelseFraNavDekkerHeleTapet}>
                                                <FormComponents.YesOrNoQuestion
                                                    name={Field.selvstendigYtelseFraNavDekkerHeleTapet}
                                                    legend={ensureString(txt.selvstendigYtelseFraNavDekkerHeleTapet)}
                                                />
                                            </SelvstendigQuestion>
                                            {values.selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES &&
                                                selvstendigYtelseFraNavDekkerHeleTapet === YesOrNo.YES && (
                                                    <StopMessage>
                                                        <SelvstendigInfo.ytelseDekkerHeleTapet />
                                                    </StopMessage>
                                                )}
                                        </FormSection>
                                    )}
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
                                            {selvstendigInntekt2019 === 0 && (
                                                <StopMessage>
                                                    Du må ha hatt inntekt i 2019 for å kunne søke på denne ytelsen
                                                </StopMessage>
                                            )}
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
                                            {selvstendigInntekt2020 === 0 && (
                                                <StopMessage>
                                                    Du må ha hatt inntekt i 2020 for å kunne søke på denne ytelsen
                                                </StopMessage>
                                            )}
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

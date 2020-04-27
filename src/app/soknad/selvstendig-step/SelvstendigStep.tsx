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
import { MAX_INNTEKT, validateAll } from '../../validation/fieldValidations';
import AvailableDateRangeInfo from '../content/AvailableDateRangeInfo';
import FormComponents from '../SoknadFormComponents';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { cleanupSelvstendigStep } from './cleanupSelvstendigStep';
import { SelvstendigFormQuestions, SelvstendigFormPayload } from './selvstendigFormConfig';
import SelvstendigFormQuestion from './SelvstendigFormQuestion';
import SelvstendigInfo from './SelvstendigInfo';
import { selvstendigStepTexts } from './selvstendigStepTexts';
import { selvstendigSkalOppgiInntekt2019, hasValidHistoriskInntekt } from '../../utils/selvstendigUtils';
import moment from 'moment';
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
        hasValidHistoriskInntekt(values, inntektÅrstall) &&
        selvstendigHarHattInntektFraForetak === YesOrNo.YES &&
        selvstendigHarTaptInntektPgaKorona === YesOrNo.YES &&
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
                <SelvstendigFormQuestion question={Field.selvstendigHarHattInntektFraForetak}>
                    <FormComponents.YesOrNoQuestion
                        name={Field.selvstendigHarHattInntektFraForetak}
                        legend={txt.selvstendigHarHattInntektFraForetak(inntektÅrstall)}
                        description={
                            <SelvstendigInfo.infoInntektÅrstall foretak={foretak} inntektÅrstall={inntektÅrstall} />
                        }
                    />
                </SelvstendigFormQuestion>
                {selvstendigHarHattInntektFraForetak === YesOrNo.NO && (
                    <StopMessage>
                        <SelvstendigInfo.advarselIkkeHattInntektFraForetak inntektÅrstall={inntektÅrstall} />
                    </StopMessage>
                )}
                <SelvstendigFormQuestion question={Field.selvstendigHarTaptInntektPgaKorona}>
                    <FormComponents.YesOrNoQuestion
                        name={Field.selvstendigHarTaptInntektPgaKorona}
                        legend={txt.selvstendigHarTaptInntektPgaKorona(currentSøknadsperiode)}
                    />
                </SelvstendigFormQuestion>
                {selvstendigHarHattInntektFraForetak === YesOrNo.YES &&
                    selvstendigHarTaptInntektPgaKorona === YesOrNo.NO && (
                        <StopMessage>
                            <SelvstendigInfo.advarselIkkeTapPgaKorona />
                        </StopMessage>
                    )}
                <SelvstendigFormQuestion question={Field.selvstendigInntektstapStartetDato}>
                    <FormComponents.DatePicker
                        name={Field.selvstendigInntektstapStartetDato}
                        label={txt.selvstendigInntektstapStartetDato}
                        dateLimitations={{
                            minDato: MIN_DATE,
                            maksDato: currentSøknadsperiode.to,
                        }}
                    />
                    {isValidDateRange(availableDateRange) && (
                        <Box margin="l">
                            <AvailableDateRangeInfo
                                inntektstapStartetDato={selvstendigInntektstapStartetDato}
                                availableDateRange={availableDateRange}
                            />
                        </Box>
                    )}
                </SelvstendigFormQuestion>
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
                                    {isVisible(Field.selvstendigHarYtelseFraNavSomDekkerTapet) && (
                                        <FormSection title="Andre utbetalinger fra NAV ">
                                            <SelvstendigFormQuestion
                                                question={Field.selvstendigHarYtelseFraNavSomDekkerTapet}>
                                                <FormComponents.YesOrNoQuestion
                                                    name={Field.selvstendigHarYtelseFraNavSomDekkerTapet}
                                                    legend={txt.selvstendigHarYtelseFraNavSomDekkerTapet}
                                                    description={<SelvstendigInfo.andreUtbetalingerFraNAV />}
                                                />
                                            </SelvstendigFormQuestion>
                                            <SelvstendigFormQuestion
                                                question={Field.selvstendigYtelseFraNavDekkerHeleTapet}>
                                                <FormComponents.YesOrNoQuestion
                                                    name={Field.selvstendigYtelseFraNavDekkerHeleTapet}
                                                    legend={txt.selvstendigYtelseFraNavDekkerHeleTapet}
                                                />
                                            </SelvstendigFormQuestion>
                                            {values.selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.YES &&
                                                selvstendigYtelseFraNavDekkerHeleTapet === YesOrNo.YES && (
                                                    <StopMessage>
                                                        <SelvstendigInfo.ytelseDekkerHeleTapet />
                                                    </StopMessage>
                                                )}
                                        </FormSection>
                                    )}
                                    {isVisible(Field.selvstendigInntektIPerioden) && (
                                        <FormSection title="Inntekter du har tatt ut som lønn av selskap">
                                            <SelvstendigFormQuestion question={Field.selvstendigInntektIPerioden}>
                                                <FormComponents.Input
                                                    name={Field.selvstendigInntektIPerioden}
                                                    label={txt.selvstendigInntektIPerioden(availableDateRange)}
                                                    type="number"
                                                    bredde="S"
                                                    description={<SelvstendigInfo.infoInntektForetak />}
                                                    validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                />
                                            </SelvstendigFormQuestion>
                                        </FormSection>
                                    )}
                                    {isVisible(Field.selvstendigErFrilanser) && (
                                        <FormSection title="Frilanser">
                                            <SelvstendigFormQuestion question={Field.selvstendigErFrilanser}>
                                                <FormComponents.YesOrNoQuestion
                                                    name={Field.selvstendigErFrilanser}
                                                    legend={txt.selvstendigErFrilanser}
                                                />
                                            </SelvstendigFormQuestion>
                                            <SelvstendigFormQuestion
                                                question={Field.selvstendigHarHattInntektSomFrilanserIPerioden}>
                                                <FormComponents.YesOrNoQuestion
                                                    name={Field.selvstendigHarHattInntektSomFrilanserIPerioden}
                                                    legend={txt.selvstendigHarHattInntektSomFrilanserIPerioden(
                                                        availableDateRange
                                                    )}
                                                />
                                            </SelvstendigFormQuestion>
                                            <SelvstendigFormQuestion
                                                question={Field.selvstendigInntektSomFrilanserIPerioden}>
                                                <FormComponents.Input
                                                    name={Field.selvstendigInntektSomFrilanserIPerioden}
                                                    type="number"
                                                    bredde="S"
                                                    label={txt.selvstendigInntektSomFrilanserIPerioden(
                                                        availableDateRange
                                                    )}
                                                    validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                />
                                            </SelvstendigFormQuestion>
                                        </FormSection>
                                    )}
                                    {isVisible(Field.selvstendigInntekt2019) && (
                                        <FormSection title="Inntekter du har tatt ut av selskap i 2019">
                                            <SelvstendigFormQuestion question={Field.selvstendigInntekt2019}>
                                                <FormComponents.Input
                                                    name={Field.selvstendigInntekt2019}
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
                                            </SelvstendigFormQuestion>
                                            {selvstendigInntekt2019 === 0 && (
                                                <StopMessage>
                                                    Du må ha hatt inntekt i 2019 for å kunne søke på denne ytelsen
                                                </StopMessage>
                                            )}
                                        </FormSection>
                                    )}
                                    {isVisible(Field.selvstendigInntekt2020) && (
                                        <FormSection title="Inntekter du har tatt ut av selskap i 2020">
                                            <SelvstendigFormQuestion question={Field.selvstendigInntekt2020}>
                                                <FormComponents.Input
                                                    name={Field.selvstendigInntekt2020}
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
                                            </SelvstendigFormQuestion>
                                            {selvstendigInntekt2020 === 0 && (
                                                <StopMessage>
                                                    Du må ha hatt inntekt i 2020 for å kunne søke på denne ytelsen
                                                </StopMessage>
                                            )}
                                        </FormSection>
                                    )}
                                    {isVisible(Field.selvstendigHarRegnskapsfører) && (
                                        <FormSection title="Regnskapsfører">
                                            <SelvstendigFormQuestion question={Field.selvstendigHarRegnskapsfører}>
                                                <FormComponents.YesOrNoQuestion
                                                    name={Field.selvstendigHarRegnskapsfører}
                                                    legend={txt.selvstendigHarRegnskapsfører}
                                                />
                                            </SelvstendigFormQuestion>
                                            {isVisible(Field.selvstendigRegnskapsførerNavn) && (
                                                <Box margin="l">
                                                    <ResponsivePanel>
                                                        {antallForetak >= 1 && (
                                                            <>
                                                                Hvis du har flere regnskapsførere, gir du opplysninger
                                                                om den som er din hovedregnskapsfører.
                                                            </>
                                                        )}
                                                        <SelvstendigFormQuestion
                                                            question={Field.selvstendigRegnskapsførerNavn}>
                                                            <FormComponents.Input
                                                                name={Field.selvstendigRegnskapsførerNavn}
                                                                label={txt.selvstendigRegnskapsførerNavn}
                                                            />
                                                        </SelvstendigFormQuestion>
                                                        <SelvstendigFormQuestion
                                                            question={Field.selvstendigRegnskapsførerTelefon}>
                                                            <FormComponents.Input
                                                                name={Field.selvstendigRegnskapsførerTelefon}
                                                                label={txt.selvstendigRegnskapsførerTelefon}
                                                                bredde="M"
                                                                maxLength={12}
                                                            />
                                                        </SelvstendigFormQuestion>
                                                    </ResponsivePanel>
                                                </Box>
                                            )}
                                        </FormSection>
                                    )}
                                    {isVisible(Field.selvstendigHarRevisor) && (
                                        <FormSection title="Revisor">
                                            <SelvstendigFormQuestion question={Field.selvstendigHarRevisor}>
                                                <FormComponents.YesOrNoQuestion
                                                    name={Field.selvstendigHarRevisor}
                                                    legend={txt.selvstendigHarRevisor}
                                                />
                                            </SelvstendigFormQuestion>
                                            {isVisible(Field.selvstendigRevisorNavn) && (
                                                <Box margin="l">
                                                    <ResponsivePanel>
                                                        {antallForetak >= 1 && (
                                                            <>
                                                                Dersom du har flere revisorer, kan du oppgi informasjon
                                                                om din hoverrevisor.
                                                            </>
                                                        )}
                                                        <SelvstendigFormQuestion
                                                            question={Field.selvstendigRevisorNavn}>
                                                            <FormComponents.Input
                                                                name={Field.selvstendigRevisorNavn}
                                                                label={txt.selvstendigRevisorNavn}
                                                            />
                                                        </SelvstendigFormQuestion>
                                                        <SelvstendigFormQuestion
                                                            question={Field.selvstendigRevisorTelefon}>
                                                            <FormComponents.Input
                                                                label={txt.selvstendigRevisorTelefon}
                                                                name={Field.selvstendigRevisorTelefon}
                                                                bredde="M"
                                                                maxLength={12}
                                                            />
                                                        </SelvstendigFormQuestion>
                                                        <SelvstendigFormQuestion
                                                            question={Field.selvstendigRevisorNAVKanTaKontakt}>
                                                            <FormComponents.YesOrNoQuestion
                                                                name={Field.selvstendigRevisorNAVKanTaKontakt}
                                                                legend={txt.selvstendigRevisorNAVKanTaKontakt}
                                                            />
                                                        </SelvstendigFormQuestion>
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

import React, { useEffect } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    validateRequiredField,
    validateRequiredNumber,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { Undertittel } from 'nav-frontend-typografi';
import AppVeilederSVG from '../../components/app-veileder-svg/AppVeilederSVG';
import Guide from '../../components/guide/Guide';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import useAvailableSøknadsperiode, { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import {
    ApplicationFormData,
    ApplicationFormField as Field,
    initialSelvstendigValues,
} from '../../types/ApplicationFormData';
import { MAX_INNTEKT, validateAll, validateDateInRange } from '../../validation/fieldValidations';
import FC from '../ApplicationFormComponents';
import ApplicationStep from '../ApplicationStep';
import AvailableDateRangeInfo from '../content/AvailableDateRangeInfo';
import { StepConfigProps, StepID } from '../stepConfig';
import { SelvstendigFormQuestions } from './selvstendigFormConfig';
import SelvstendigInfo from './SelvstendigInfo';
import { selvstendigStepTexts } from './selvstendigStepTexts';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import { ensureString } from '../../utils/ensureString';
import ResponsivePanel from 'common/components/responsive-panel/ResponsivePanel';

const MIN_DATE: Date = apiStringDateToDate('2020-02-01');

const txt = selvstendigStepTexts;

const SelvstendigStep = ({ resetApplication, onValidSubmit, applicationEssentials }: StepConfigProps) => {
    const { values, setFieldValue } = useFormikContext<ApplicationFormData>();

    const foretak = applicationEssentials.personligeForetak?.foretak || [];
    const antallForetak = foretak.length;
    const { selvstendigInntektstapStartetDato } = values;
    const { currentSøknadsperiode } = applicationEssentials;

    const { availableDateRange, isLimitedDateRange, isLoading } = useAvailableSøknadsperiode(
        selvstendigInntektstapStartetDato,
        currentSøknadsperiode
    );

    const { isVisible, areAllQuestionsAnswered } = SelvstendigFormQuestions.getVisbility({
        ...values,
        ...applicationEssentials,
    });

    useEffect(() => {
        setFieldValue(Field.selvstendigCalculatedDateRange, availableDateRange);
    }, [availableDateRange]);

    const cleanupSelvstendigstep = (values: ApplicationFormData): ApplicationFormData => {
        if (values.selvstendigHarTaptInntektPgaKorona === YesOrNo.NO) {
            const cleanedValues = {
                ...values,
                ...initialSelvstendigValues,
                selvstendigHarTaptInntektPgaKorona: YesOrNo.NO,
            };
            return cleanedValues;
        }
        return values;
    };

    return (
        <ApplicationStep
            id={StepID.SELVSTENDIG}
            resetApplication={resetApplication}
            onValidFormSubmit={onValidSubmit}
            stepCleanup={cleanupSelvstendigstep}
            showSubmitButton={
                areAllQuestionsAnswered() &&
                (values.selvstendigHarTaptInntektPgaKorona === YesOrNo.YES ||
                    values.søkerOmTaptInntektSomFrilanser === YesOrNo.YES)
            }>
            <Guide kompakt={true} type="normal" svg={<AppVeilederSVG />}>
                {SelvstendigInfo.intro(antallForetak, foretak)}
            </Guide>

            {isVisible(Field.selvstendigHarTaptInntektPgaKorona) && (
                <FormBlock>
                    <FC.YesOrNoQuestion
                        name={Field.selvstendigHarTaptInntektPgaKorona}
                        legend={ensureString(txt.selvstendigHarTaptInntektPgaKorona(currentSøknadsperiode))}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}

            {values.selvstendigHarTaptInntektPgaKorona === YesOrNo.NO && (
                <FormBlock>{SelvstendigInfo.advarselIkkeTapPgaKorona()}</FormBlock>
            )}

            {isVisible(Field.selvstendigInntektstapStartetDato) && (
                <FormBlock>
                    <FC.DatePicker
                        name={Field.selvstendigInntektstapStartetDato}
                        label={ensureString(txt.selvstendigInntektstapStartetDato)}
                        dateLimitations={{
                            minDato: MIN_DATE,
                            maksDato: currentSøknadsperiode.to,
                        }}
                        validate={validateAll([validateRequiredField, validateDateInRange(currentSøknadsperiode)])}
                    />
                    {isValidDateRange(availableDateRange) && (
                        <Box margin="l" padBottom="xxl">
                            <AvailableDateRangeInfo
                                inntektstapStartetDato={selvstendigInntektstapStartetDato}
                                availableDateRange={availableDateRange}
                                isLimitedDateRange={isLimitedDateRange}
                            />
                        </Box>
                    )}
                </FormBlock>
            )}
            {values.selvstendigHarTaptInntektPgaKorona === YesOrNo.YES && (
                <LoadWrapper
                    isLoading={isLoading}
                    contentRenderer={() => {
                        if (availableDateRange === undefined) {
                            return null;
                        }
                        if (availableDateRange === 'NO_AVAILABLE_DATERANGE') {
                            return <FormBlock>{SelvstendigInfo.advarselForSentInntektstap()}</FormBlock>;
                        }
                        return (
                            <>
                                <Undertittel className="sectionTitle">Ytelser fra NAV</Undertittel>
                                {isVisible(Field.selvstendigHarYtelseFraNavSomDekkerTapet) && (
                                    <FormBlock>
                                        <FC.YesOrNoQuestion
                                            name={Field.selvstendigHarYtelseFraNavSomDekkerTapet}
                                            legend={ensureString(txt.selvstendigHarYtelseFraNavSomDekkerTapet)}
                                        />
                                    </FormBlock>
                                )}
                                {isVisible(Field.selvstendigYtelseFraNavDekkerHeleTapet) && (
                                    <FormBlock>
                                        <FC.YesOrNoQuestion
                                            name={Field.selvstendigYtelseFraNavDekkerHeleTapet}
                                            legend={ensureString(txt.selvstendigYtelseFraNavDekkerHeleTapet)}
                                        />
                                    </FormBlock>
                                )}
                                {isVisible(Field.selvstendigInntektIPerioden) && (
                                    <>
                                        <Box margin="xxl">
                                            <Undertittel className="sectionTitle">
                                                Inntekt i perioden du søker for
                                            </Undertittel>
                                        </Box>
                                        <FormBlock>
                                            <FC.Input
                                                label={ensureString(
                                                    txt.selvstendigInntektIPerioden(availableDateRange)
                                                )}
                                                name={Field.selvstendigInntektIPerioden}
                                                type="number"
                                                bredde="S"
                                                description={
                                                    <ExpandableInfo title="Hvordan beregner du inntekt?">
                                                        {SelvstendigInfo.infoInntektForetak()}
                                                    </ExpandableInfo>
                                                }
                                                validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                            />
                                        </FormBlock>
                                    </>
                                )}

                                {isVisible(Field.selvstendigErFrilanser) && (
                                    <Box margin="xxl">
                                        <Undertittel className="sectionTitle">Frilanser</Undertittel>
                                        <FormBlock>
                                            <FC.YesOrNoQuestion
                                                legend={ensureString(txt.selvstendigErFrilanser)}
                                                name={Field.selvstendigErFrilanser}
                                            />
                                        </FormBlock>
                                    </Box>
                                )}
                                {isVisible(Field.selvstendigHarHattInntektSomFrilanserIPerioden) && (
                                    <FormBlock>
                                        <FC.YesOrNoQuestion
                                            legend={ensureString(
                                                txt.selvstendigHarHattInntektSomFrilanserIPerioden(availableDateRange)
                                            )}
                                            name={Field.selvstendigHarHattInntektSomFrilanserIPerioden}
                                        />
                                    </FormBlock>
                                )}
                                {isVisible(Field.selvstendigInntektSomFrilanserIPerioden) && (
                                    <FormBlock>
                                        <FC.Input
                                            name={Field.selvstendigInntektSomFrilanserIPerioden}
                                            type="number"
                                            bredde="S"
                                            label={ensureString(
                                                txt.selvstendigInntektSomFrilanserIPerioden(availableDateRange)
                                            )}
                                            validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                        />
                                    </FormBlock>
                                )}
                                {isVisible(Field.selvstendigInntekt2019) && (
                                    <Box margin="xxl">
                                        <Undertittel className="sectionTitle">Inntekt i 2019</Undertittel>
                                        <FormBlock>
                                            <FC.Input
                                                name={Field.selvstendigInntekt2019}
                                                type="number"
                                                bredde="S"
                                                label={ensureString(txt.selvstendigInntekt2019)}
                                                validate={validateAll([
                                                    validateRequiredNumber({ min: 0, max: MAX_INNTEKT }),
                                                ])}
                                            />
                                        </FormBlock>
                                    </Box>
                                )}
                                {isVisible(Field.selvstendigInntekt2020) && (
                                    <Box margin="xxl">
                                        <Undertittel className="sectionTitle">Inntekt i 2020</Undertittel>
                                        <FormBlock>
                                            <FC.Input
                                                name={Field.selvstendigInntekt2020}
                                                type="number"
                                                bredde="S"
                                                label={ensureString(
                                                    txt.selvstendigInntekt2020(selvstendigInntektstapStartetDato)
                                                )}
                                                validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                            />
                                        </FormBlock>
                                    </Box>
                                )}
                                {isVisible(Field.selvstendigHarRegnskapsfører) && (
                                    <Box margin="xxl">
                                        <Undertittel className="sectionTitle">Regnskapsfører</Undertittel>
                                        <FormBlock>
                                            <FC.YesOrNoQuestion
                                                legend={ensureString(txt.selvstendigHarRegnskapsfører)}
                                                name={Field.selvstendigHarRegnskapsfører}
                                            />
                                        </FormBlock>
                                    </Box>
                                )}
                                {isVisible(Field.selvstendigRegnskapsførerNavn) && (
                                    <Box margin="l">
                                        <ResponsivePanel>
                                            {antallForetak >= 1 && (
                                                <Box padBottom="l">
                                                    Dersom du har flere regnskapsførere, kan du oppgi informasjon om din
                                                    hovedregnskapsfører.
                                                </Box>
                                            )}
                                            <FormBlock margin="none">
                                                <FC.Input
                                                    label={ensureString(txt.selvstendigRegnskapsførerNavn)}
                                                    name={Field.selvstendigRegnskapsførerNavn}
                                                />
                                            </FormBlock>
                                            {isVisible(Field.selvstendigRegnskapsførerTelefon) && (
                                                <FormBlock>
                                                    <FC.Input
                                                        label={ensureString(txt.selvstendigRegnskapsførerTelefon)}
                                                        name={Field.selvstendigRegnskapsførerTelefon}
                                                        bredde="M"
                                                        maxLength={12}
                                                    />
                                                </FormBlock>
                                            )}
                                        </ResponsivePanel>
                                    </Box>
                                )}
                                {isVisible(Field.selvstendigHarRevisor) && (
                                    <Box margin="xxl">
                                        <Undertittel className="sectionTitle">Revisor</Undertittel>
                                        <FormBlock>
                                            <FC.YesOrNoQuestion
                                                legend={ensureString(txt.selvstendigHarRevisor)}
                                                name={Field.selvstendigHarRevisor}
                                            />
                                        </FormBlock>
                                    </Box>
                                )}
                                {isVisible(Field.selvstendigRevisorNavn) && (
                                    <Box margin="l">
                                        <ResponsivePanel>
                                            {antallForetak >= 1 && (
                                                <Box padBottom="l">
                                                    Dersom du har flere revisorer, kan du oppgi informasjon om din
                                                    hoverrevisor.
                                                </Box>
                                            )}
                                            <FormBlock margin="none">
                                                <FC.Input
                                                    label={ensureString(txt.selvstendigRevisorNavn)}
                                                    name={Field.selvstendigRevisorNavn}
                                                />
                                            </FormBlock>
                                            {isVisible(Field.selvstendigRevisorTelefon) && (
                                                <FormBlock>
                                                    <FC.Input
                                                        label={ensureString(txt.selvstendigRevisorTelefon)}
                                                        name={Field.selvstendigRevisorTelefon}
                                                        bredde="M"
                                                        maxLength={12}
                                                    />
                                                </FormBlock>
                                            )}
                                            {isVisible(Field.selvstendigRevisorNAVKanTaKontakt) && (
                                                <FormBlock>
                                                    <FC.YesOrNoQuestion
                                                        legend={ensureString(txt.selvstendigRevisorNAVKanTaKontakt)}
                                                        name={Field.selvstendigRevisorNAVKanTaKontakt}
                                                    />
                                                </FormBlock>
                                            )}
                                        </ResponsivePanel>
                                    </Box>
                                )}
                            </>
                        );
                    }}
                />
            )}
        </ApplicationStep>
    );
};

export default SelvstendigStep;

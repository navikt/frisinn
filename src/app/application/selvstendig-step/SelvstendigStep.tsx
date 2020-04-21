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
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import { MAX_INNTEKT, validateAll, validateDateInRange } from '../../validation/fieldValidations';
import ApplicationFormComponents from '../ApplicationFormComponents';
import ApplicationStep from '../ApplicationStep';
import AvailableDateRangeInfo from '../content/AvailableDateRangeInfo';
import { StepConfigProps, StepID } from '../stepConfig';
import { SelvstendigFormQuestions } from './selvstendigFormConfig';
import SelvstendigInfo from './SelvstendigInfo';
import { selvstendigStepTexts } from './selvstendigStepTexts';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';

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
        setFieldValue(ApplicationFormField.selvstendigCalculatedDateRange, availableDateRange);
    }, [availableDateRange]);

    const ensureString = (label: string) => label;

    return (
        <ApplicationStep
            id={StepID.SELVSTENDIG}
            resetApplication={resetApplication}
            onValidFormSubmit={onValidSubmit}
            showSubmitButton={areAllQuestionsAnswered() && values.selvstendigHarTaptInntektPgaKorona === YesOrNo.YES}>
            <Guide kompakt={true} type="normal" svg={<AppVeilederSVG />}>
                {SelvstendigInfo.intro(antallForetak, foretak)}
            </Guide>

            {isVisible(ApplicationFormField.selvstendigHarTaptInntektPgaKorona) && (
                <FormBlock>
                    <ApplicationFormComponents.YesOrNoQuestion
                        name={ApplicationFormField.selvstendigHarTaptInntektPgaKorona}
                        legend={ensureString(txt.selvstendigHarTaptInntektPgaKorona(currentSøknadsperiode))}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}

            {values.selvstendigHarTaptInntektPgaKorona === YesOrNo.NO && (
                <FormBlock>{SelvstendigInfo.advarselIkkeTapPgaKorona()}</FormBlock>
            )}

            {isVisible(ApplicationFormField.selvstendigInntektstapStartetDato) && (
                <FormBlock>
                    <ApplicationFormComponents.DatePicker
                        name={ApplicationFormField.selvstendigInntektstapStartetDato}
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
                                {isVisible(ApplicationFormField.selvstendigTapHeltEllerDelvisDekketAvNAV) && (
                                    <FormBlock>
                                        <ApplicationFormComponents.YesOrNoQuestion
                                            name={ApplicationFormField.selvstendigTapHeltEllerDelvisDekketAvNAV}
                                            legend="Har du ytelser fra NAV som dekker hele eller deler av inntektstapet?"
                                        />
                                    </FormBlock>
                                )}
                                {isVisible(ApplicationFormField.selvstendigTapHeltDekketAvNAV) && (
                                    <FormBlock>
                                        <ApplicationFormComponents.YesOrNoQuestion
                                            name={ApplicationFormField.selvstendigTapHeltDekketAvNAV}
                                            legend="Dekker disse ytelsene hele inntektstapet?"
                                        />
                                    </FormBlock>
                                )}
                                {isVisible(ApplicationFormField.selvstendigInntektIPerioden) && (
                                    <>
                                        <Box margin="xxl">
                                            <Undertittel className="sectionTitle">
                                                Inntekt i perioden du søker for
                                            </Undertittel>
                                        </Box>
                                        <FormBlock>
                                            <ApplicationFormComponents.Input
                                                label={ensureString(
                                                    txt.selvstendigInntektIPerioden(availableDateRange)
                                                )}
                                                name={ApplicationFormField.selvstendigInntektIPerioden}
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

                                {isVisible(ApplicationFormField.selvstendigErFrilanser) && (
                                    <Box margin="xxl">
                                        <Undertittel className="sectionTitle">Frilanser</Undertittel>
                                        <FormBlock>
                                            <ApplicationFormComponents.YesOrNoQuestion
                                                legend={ensureString(txt.selvstendigErFrilanser)}
                                                name={ApplicationFormField.selvstendigErFrilanser}
                                            />
                                        </FormBlock>
                                    </Box>
                                )}
                                {isVisible(ApplicationFormField.selvstendigHarHattInntektSomFrilanserIPerioden) && (
                                    <FormBlock>
                                        <ApplicationFormComponents.YesOrNoQuestion
                                            legend={ensureString(
                                                txt.selvstendigHarHattInntektSomFrilanserIPerioden(availableDateRange)
                                            )}
                                            name={ApplicationFormField.selvstendigHarHattInntektSomFrilanserIPerioden}
                                        />
                                    </FormBlock>
                                )}
                                {isVisible(ApplicationFormField.selvstendigInntektSomFrilanserIPerioden) && (
                                    <FormBlock>
                                        <ApplicationFormComponents.Input
                                            name={ApplicationFormField.selvstendigInntektSomFrilanserIPerioden}
                                            type="number"
                                            bredde="S"
                                            label={ensureString(
                                                txt.selvstendigInntektSomFrilanserIPerioden(availableDateRange)
                                            )}
                                            validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                        />
                                    </FormBlock>
                                )}
                                {isVisible(ApplicationFormField.selvstendigInntekt2019) && (
                                    <Box margin="xxl">
                                        <Undertittel className="sectionTitle">Inntekt i 2019</Undertittel>
                                        <FormBlock>
                                            <ApplicationFormComponents.Input
                                                name={ApplicationFormField.selvstendigInntekt2019}
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
                                {isVisible(ApplicationFormField.selvstendigInntekt2020) && (
                                    <Box margin="xxl">
                                        <Undertittel className="sectionTitle">Inntekt i 2020</Undertittel>
                                        <FormBlock>
                                            <ApplicationFormComponents.Input
                                                name={ApplicationFormField.selvstendigInntekt2020}
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
                            </>
                        );
                    }}
                />
            )}
        </ApplicationStep>
    );
};

export default SelvstendigStep;

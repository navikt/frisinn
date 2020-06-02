import React from 'react';
import {
    validateRequiredNumber,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import StopMessage from '../../components/stop-message/StopMessage';
import { QuestionVisibilityContext } from '../../context/QuestionVisibilityContext';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { MAX_INNTEKT } from '../../validation/fieldValidations';
import ArbeidstakerInfo from '../info/ArbeidstakerInfo';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadQuestion from '../SoknadQuestion';
import { soknadQuestionText } from '../soknadQuestionText';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { ArbeidstakerFormConfigPayload, ArbeidstakerFormQuestions } from './arbeidstakerFormConfig';
import { cleanupArbeidstakerStep, getInntektsperiodeForArbeidsinntekt } from './arbeidstakerUtils';

const ArbeidstakerStep = ({ soknadEssentials, stepConfig, resetSoknad, onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SoknadFormData>();

    const payload: ArbeidstakerFormConfigPayload = {
        ...soknadEssentials,
        ...values,
    };
    const visibility = ArbeidstakerFormQuestions.getVisbility(payload);
    const txt = soknadQuestionText;
    const inntektsperiodeSomArbeidstaker = getInntektsperiodeForArbeidsinntekt(values);

    return (
        <SoknadStep
            id={StepID.ARBEIDSTAKER}
            onValidFormSubmit={onValidSubmit}
            resetSoknad={resetSoknad}
            stepCleanup={cleanupArbeidstakerStep}
            stepConfig={stepConfig}
            showSubmitButton={visibility.areAllQuestionsAnswered()}>
            {inntektsperiodeSomArbeidstaker === undefined ? (
                <StopMessage>
                    Ingen inntektsperiode er registrert, vennligst kontroller informasjonen på foregående steg
                </StopMessage>
            ) : (
                <QuestionVisibilityContext.Provider value={{ visibility }}>
                    <SoknadQuestion
                        name={SoknadFormField.arbeidstakerErArbeidstaker}
                        legend={txt.arbeidstakerErArbeidstaker}
                        validate={validateYesOrNoIsAnswered}
                    />
                    <SoknadQuestion
                        name={SoknadFormField.arbeidstakerHarHattInntektIPerioden}
                        legend={txt.arbeidstakerHarHattInntektIPerioden(inntektsperiodeSomArbeidstaker)}
                        validate={validateYesOrNoIsAnswered}
                    />
                    <SoknadQuestion name={SoknadFormField.arbeidstakerInntektIPerioden}>
                        <SoknadFormComponents.Input
                            name={SoknadFormField.arbeidstakerInntektIPerioden}
                            label={txt.arbeidstakerInntektIPerioden(inntektsperiodeSomArbeidstaker)}
                            type="number"
                            bredde="S"
                            maxLength={8}
                            max={MAX_INNTEKT}
                            description={
                                <ArbeidstakerInfo.infoOmArbeidstakerinntektIPerioden
                                    søknadsperiodeinfo={soknadEssentials.søknadsperiodeinfo}
                                />
                            }
                            validate={validateRequiredNumber({ min: 1, max: MAX_INNTEKT })}
                        />
                    </SoknadQuestion>
                </QuestionVisibilityContext.Provider>
            )}
        </SoknadStep>
    );
};

export default ArbeidstakerStep;

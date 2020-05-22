import React from 'react';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import SoknadQuestion from '../SoknadQuestion';
import { SoknadFormField, SoknadFormData } from '../../types/SoknadFormData';
import { QuestionVisibilityContext } from '../../context/QuestionVisibilityContext';
import { ArbeidstakerFormQuestions, ArbeidstakerFormConfigPayload } from './arbeidstakerFormConfig';
import { useFormikContext } from 'formik';
import { soknadQuestionText } from '../soknadQuestionText';
import {
    validateYesOrNoIsAnswered,
    validateRequiredNumber,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { MAX_INNTEKT } from '../../validation/fieldValidations';
import { getInntektsperiodeForArbeidsinntekt, cleanupArbeidstakerStep } from './arbeidstakerUtils';
import StopMessage from '../../components/stop-message/StopMessage';
import SoknadFormComponents from '../SoknadFormComponents';
import ArbeidstakerInfo from '../info/ArbeidstakerInfo';

const ArbeidstakerStep = ({ soknadEssentials, resetSoknad, onValidSubmit }: StepConfigProps) => {
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
            showSubmitButton={visibility.areAllQuestionsAnswered()}>
            {inntektsperiodeSomArbeidstaker === undefined ? (
                <StopMessage>
                    Ingen inntektsperiode er registrert, vennligst kontroller informasjonen på foregående steg
                </StopMessage>
            ) : (
                <QuestionVisibilityContext.Provider value={{ visibility }}>
                    <SoknadQuestion
                        name={SoknadFormField.arbeidstakerHarHattInntektIPerioden}
                        legend={txt.arbeidstakerHarHattInntektIPerioden(inntektsperiodeSomArbeidstaker)}
                        validate={validateYesOrNoIsAnswered}
                        description={<ArbeidstakerInfo.infoHarHattArbeidstakerinntektIPerioden />}
                    />
                    <SoknadQuestion
                        name={SoknadFormField.arbeidstakerInntektIPerioden}
                        validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}>
                        <SoknadFormComponents.Input
                            name={SoknadFormField.arbeidstakerInntektIPerioden}
                            label={txt.arbeidstakerInntektIPerioden(inntektsperiodeSomArbeidstaker)}
                            type="number"
                            bredde="S"
                            maxLength={8}
                            max={MAX_INNTEKT}
                            description={<ArbeidstakerInfo.infoOmArbeidstakerinntektIPerioden />}
                            validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                        />
                    </SoknadQuestion>
                </QuestionVisibilityContext.Provider>
            )}
        </SoknadStep>
    );
};

export default ArbeidstakerStep;

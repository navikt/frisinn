import React, { useContext } from 'react';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import {
    validateRequiredField,
    validateRequiredNumber,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import MissingAppContext from '../../components/missing-app-context/MissingAppContext';
import { ApplicationContext } from '../../context/ApplicationContext';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import { MAX_INNTEKT } from '../../validation/fieldValidations';
import ApplicationFormComponents from '../ApplicationFormComponents';
import ApplicationStep from '../ApplicationStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { SelvstendigFormQuestions } from './selvstendigFormConfig';

const Q = ApplicationFormField;

const SelvstendigStep = ({ onValidSubmit }: StepConfigProps) => {
    const appContext = useContext(ApplicationContext);
    const { values } = useFormikContext<ApplicationFormData>();
    const { isVisible, areAllQuestionsAnswered } = SelvstendigFormQuestions.getVisbility(values);

    const dateRange = appContext?.applicationEssentials?.applicationDateRanges.selvstendigDateRange;
    if (!appContext || !dateRange) {
        return <MissingAppContext />;
    }

    return (
        <ApplicationStep
            id={StepID.SELVSTENDIG}
            onValidFormSubmit={onValidSubmit}
            showSubmitButton={areAllQuestionsAnswered()}>
            <CounsellorPanel>Info til steg</CounsellorPanel>
            {isVisible(Q.selvstendigHarHattInntektstapHelePerioden) && (
                <FormBlock>
                    <ApplicationFormComponents.YesOrNoQuestion
                        name={ApplicationFormField.selvstendigHarHattInntektstapHelePerioden}
                        legend={'Har du hatt inntektstap for hele perioden'}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {isVisible(Q.selvstendigInntektstapStartetDato) && (
                <FormBlock>
                    <ApplicationFormComponents.DatePicker
                        name={ApplicationFormField.selvstendigInntektstapStartetDato}
                        label={'Når startet inntektstapet?'}
                        dateLimitations={{
                            minDato: dateRange.from,
                            maksDato: dateRange.to,
                        }}
                        validate={validateRequiredField}
                    />
                </FormBlock>
            )}
            {isVisible(Q.selvstendigInntekt2019) && (
                <FormBlock>
                    <ApplicationFormComponents.Input
                        name={ApplicationFormField.selvstendigInntekt2019}
                        type="number"
                        bredde="S"
                        label={'Hvilken inntekt hadde du fra dine bedrifter i 2019?'}
                        validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                    />
                </FormBlock>
            )}
            {isVisible(Q.selvstendigInntekt2020) && (
                <FormBlock>
                    <ApplicationFormComponents.Input
                        name={ApplicationFormField.selvstendigInntekt2020}
                        type="number"
                        bredde="S"
                        label={'Hvilken inntekt hadde du fra dine bedrifter i 2020?'}
                        validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                    />
                </FormBlock>
            )}
            {isVisible(Q.selvstendigInntektIPerioden) && (
                <FormBlock>
                    <ApplicationFormComponents.Input
                        name={ApplicationFormField.selvstendigInntektIPerioden}
                        type="number"
                        bredde="S"
                        label={'Hvilken inntekt har du hatt i perioden du søker for?'}
                        validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                    />
                </FormBlock>
            )}
        </ApplicationStep>
    );
};

export default SelvstendigStep;

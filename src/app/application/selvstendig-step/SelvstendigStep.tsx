import React, { useContext, useState, useEffect } from 'react';
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
import { MAX_INNTEKT, validateDateInRange } from '../../validation/fieldValidations';
import ApplicationFormComponents from '../ApplicationFormComponents';
import ApplicationStep from '../ApplicationStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { SelvstendigFormQuestions } from './selvstendigFormConfig';
import { validateAll } from '../../validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { yesOrNoIsAnswered } from '../../utils/yesOrNoUtils';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getPerioder } from '../../api/perioder';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import moment from 'moment';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import { pluralize } from '../../utils/pluralize';

const Q = ApplicationFormField;

const getNumberOfDaysInDateRange = (dateRange: DateRange): number => {
    return moment(dateRange.to).diff(dateRange.from, 'days') + 1;
};

const SelvstendigStep = ({ onValidSubmit }: StepConfigProps) => {
    const { applicationEssentials } = useContext(ApplicationContext) || {};
    const { values } = useFormikContext<ApplicationFormData>();
    const [apiPeriode, setApiPeriode] = useState<DateRange | undefined>();
    const [pending, setPending] = useState<boolean>(false);
    const [noValidPeriod, setNoValidPeriod] = useState<boolean | undefined>();

    if (!applicationEssentials) {
        return <MissingAppContext />;
    }

    const dateRange = applicationEssentials.applicationDateRanges.applicationDateRange;
    const { isVisible, areAllQuestionsAnswered } = SelvstendigFormQuestions.getVisbility({
        ...values,
        ...applicationEssentials,
    });

    const tapErPgaKorona = yesOrNoIsAnswered(values.selvstendigInntektstapErPgaKorona)
        ? values.selvstendigInntektstapErPgaKorona === YesOrNo.YES
        : undefined;

    const { selvstendigInntektstapStartetDato } = values;

    async function getGyldigPeriode() {
        setPending(true);
        try {
            const perioder = await getPerioder(
                selvstendigInntektstapStartetDato ? [selvstendigInntektstapStartetDato] : undefined
            );
            setNoValidPeriod(false);
            setPending(false);
            setApiPeriode(perioder.applicationDateRange);
        } catch (error) {
            setNoValidPeriod(true);
            setPending(false);
        }
    }

    useEffect(() => {
        if (selvstendigInntektstapStartetDato) {
            getGyldigPeriode();
        } else {
            setApiPeriode(undefined);
        }
    }, [selvstendigInntektstapStartetDato]);

    return (
        <ApplicationStep
            id={StepID.SELVSTENDIG}
            onValidFormSubmit={onValidSubmit}
            showSubmitButton={areAllQuestionsAnswered() && tapErPgaKorona}>
            <CounsellorPanel>Info til steg</CounsellorPanel>
            {isVisible(Q.selvstendigInntektstapErPgaKorona) && (
                <FormBlock>
                    <ApplicationFormComponents.YesOrNoQuestion
                        name={ApplicationFormField.selvstendigInntektstapErPgaKorona}
                        legend={'Er årsaken til inntektstapet korona?'}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {tapErPgaKorona === false && (
                <FormBlock>
                    <AlertStripeAdvarsel>
                        Du kan ikke søke om kompensasjon for tap som ikke er forårsaket av Korona
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
            {tapErPgaKorona === true && (
                <>
                    {isVisible(Q.selvstendigInntektstapStartetDato) && (
                        <FormBlock>
                            <ApplicationFormComponents.DatePicker
                                name={ApplicationFormField.selvstendigInntektstapStartetDato}
                                label={'Når startet inntektstapet?'}
                                dateLimitations={{
                                    minDato: dateRange.from,
                                    maksDato: dateRange.to,
                                }}
                                validate={validateAll([validateRequiredField, validateDateInRange(dateRange)])}
                            />
                        </FormBlock>
                    )}
                    <LoadWrapper
                        isLoading={pending}
                        contentRenderer={() => {
                            if (noValidPeriod === true) {
                                return (
                                    <FormBlock>
                                        <AlertStripeAdvarsel>
                                            Du kan ikke søke for denne perioden fordi du får dekket først fra og med den
                                            17. dagen etter inntektsstapet startet
                                        </AlertStripeAdvarsel>
                                    </FormBlock>
                                );
                            }
                            if (apiPeriode === undefined) {
                                return null;
                            }
                            const numberOfDays = getNumberOfDaysInDateRange(apiPeriode);
                            return (
                                <>
                                    <FormBlock>
                                        <AlertStripeInfo>
                                            Du kan søke kompensasjon for {numberOfDays}{' '}
                                            {pluralize(numberOfDays, 'dag', 'dager')} i denne perioden (
                                            <DateRangeView dateRange={apiPeriode} />)
                                        </AlertStripeInfo>
                                    </FormBlock>
                                    {isVisible(Q.selvstendigInntekt2019) && (
                                        <FormBlock>
                                            <ApplicationFormComponents.Input
                                                name={ApplicationFormField.selvstendigInntekt2019}
                                                type="number"
                                                bredde="S"
                                                label={'Hvilken inntekt hadde du fra dine bedrifter i 2019?'}
                                                validate={validateAll([
                                                    validateRequiredNumber({ min: 0, max: MAX_INNTEKT }),
                                                ])}
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
                                </>
                            );
                        }}
                    />
                </>
            )}
        </ApplicationStep>
    );
};

export default SelvstendigStep;

import React, { useState, useEffect } from 'react';
import { StepConfigProps, StepID } from '../stepConfig';
import { useFormikContext } from 'formik';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { SelvstendigFormQuestions } from './selvstendigFormConfig';
import { getSøknadsperiode } from '../../api/perioder';
import ApplicationStep from '../ApplicationStep';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import {
    validateYesOrNoIsAnswered,
    validateRequiredField,
    validateRequiredNumber,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { validateAll, validateDateInRange, MAX_INNTEKT } from '../../validation/fieldValidations';
import DateView from '../../components/date-view/DateView';
import ApplicationFormComponents from '../ApplicationFormComponents';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import DateRangeView from '../../components/date-range-view/DateRangeView';

// interface AvailableDateRangeState {
//     selectedDate?: Date;
//     isPending?: boolean;
//     result?: {
//         dateRange: DateRange | undefined;
//     };
// }

const SelvstendigStep = ({ onValidSubmit, applicationEssentials }: StepConfigProps) => {
    const { values } = useFormikContext<ApplicationFormData>();
    // const [availableDateRangeState, setAvailoableDateRangeState] = useState<AvailableDateRangeState>();
    const [availableDateRange, setAvailableDateRange] = useState<DateRange | undefined>();
    const [getDateRangePending, setDateRangePending] = useState<boolean>(false);
    const [noValidPeriod, setNoValidPeriod] = useState<boolean | undefined>();

    const foretak = applicationEssentials.personligeForetak?.foretak || [];
    const antallForetak = foretak.length;
    const dateRange = applicationEssentials.currentSøknadsperiode;

    const { isVisible, areAllQuestionsAnswered } = SelvstendigFormQuestions.getVisbility({
        ...values,
        ...applicationEssentials,
        søkerForTaptInntektSomFrilanser: values.søkerOmTaptInntektSomFrilanser === YesOrNo.YES,
    });

    const { selvstendigInntektstapStartetDato } = values;

    async function getGyldigPeriode() {
        setDateRangePending(true);
        try {
            const søknadsperiode = await getSøknadsperiode(
                selvstendigInntektstapStartetDato ? [selvstendigInntektstapStartetDato] : undefined
            );
            setNoValidPeriod(false);
            setDateRangePending(false);
            setAvailableDateRange(søknadsperiode);
        } catch (error) {
            setNoValidPeriod(true);
            setDateRangePending(false);
        }
    }

    useEffect(() => {
        if (selvstendigInntektstapStartetDato) {
            getGyldigPeriode();
        } else {
            setAvailableDateRange(undefined);
        }
    }, [selvstendigInntektstapStartetDato]);

    return (
        <ApplicationStep
            id={StepID.SELVSTENDIG}
            onValidFormSubmit={onValidSubmit}
            showSubmitButton={areAllQuestionsAnswered()}>
            <CounsellorPanel>
                Vi har funnet {antallForetak} foretak registrert på deg som du kan søke om tapt inntekt for. Alle
                informasjon oppgir på denne siden gjelder for alle dine foretak samlet.
            </CounsellorPanel>
            {isVisible(ApplicationFormField.selvstendigHarTaptInntektPgaKorona) && (
                <FormBlock>
                    <ApplicationFormComponents.YesOrNoQuestion
                        name={ApplicationFormField.selvstendigHarTaptInntektPgaKorona}
                        legend={
                            <span>
                                Har du tapt inntekt som selvstendig næringsdrivende på grunn av koronatiltak i{' '}
                                <DateView format="monthAndYear" date={applicationEssentials.currentSøknadsperiode.to} />
                                ?
                            </span>
                        }
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {values.selvstendigHarTaptInntektPgaKorona === YesOrNo.NO && (
                <FormBlock>
                    <AlertStripeAdvarsel>
                        Du kan ikke søke om kompensasjon for tap som ikke er forårsaket av Korona
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
            {isVisible(ApplicationFormField.selvstendigInntektstapStartetDato) && (
                <FormBlock>
                    <ApplicationFormComponents.DatePicker
                        name={ApplicationFormField.selvstendigInntektstapStartetDato}
                        label={'Når startet inntektstapet ditt som selvstendig næringsdrivende?'}
                        dateLimitations={{
                            minDato: dateRange.from,
                            maksDato: dateRange.to,
                        }}
                        validate={validateAll([validateRequiredField, validateDateInRange(dateRange)])}
                    />
                </FormBlock>
            )}
            <LoadWrapper
                isLoading={getDateRangePending}
                contentRenderer={() => {
                    if (noValidPeriod === true) {
                        return (
                            <FormBlock>
                                <AlertStripeAdvarsel>
                                    Du kan ikke søke for denne perioden fordi du får dekket først fra og med den 17.
                                    dagen etter inntektsstapet startet
                                </AlertStripeAdvarsel>
                            </FormBlock>
                        );
                    }
                    if (availableDateRange === undefined) {
                        return null;
                    }
                    return (
                        <>
                            <FormBlock>
                                <AlertStripeInfo>
                                    Du kan søke kompensasjon for dagene i perioden{' '}
                                    <DateRangeView dateRange={availableDateRange} />)
                                </AlertStripeInfo>
                            </FormBlock>
                            {isVisible(ApplicationFormField.selvstendigInntektIPerioden) && (
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
                            {isVisible(ApplicationFormField.selvstendigInntekt2019) && (
                                <FormBlock>
                                    <ApplicationFormComponents.Input
                                        name={ApplicationFormField.selvstendigInntekt2019}
                                        type="number"
                                        bredde="S"
                                        label={'Hvilken inntekt hadde du fra dine bedrifter i 2019?'}
                                        validate={validateAll([validateRequiredNumber({ min: 0, max: MAX_INNTEKT })])}
                                    />
                                </FormBlock>
                            )}
                            {isVisible(ApplicationFormField.selvstendigInntekt2020) && (
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
                        </>
                    );
                }}
            />
        </ApplicationStep>
    );

    //         {tapErPgaKorona === true && (
    //             <>
    //                 {isVisible(Q.selvstendigInntektstapStartetDato) && (
    //                     <FormBlock>
    //                         <ApplicationFormComponents.DatePicker
    //                             name={ApplicationFormField.selvstendigInntektstapStartetDato}
    //                             label={'Når startet inntektstapet?'}
    //                             dateLimitations={{
    //                                 minDato: dateRange.from,
    //                                 maksDato: dateRange.to,
    //                             }}
    //                             validate={validateAll([validateRequiredField, validateDateInRange(dateRange)])}
    //                         />
    //                     </FormBlock>
    //                 )}
    //                 <LoadWrapper
    //                     isLoading={pending}
    //                     contentRenderer={() => {
    //                         if (noValidPeriod === true) {
    //                             return (
    //                                 <FormBlock>
    //                                     <AlertStripeAdvarsel>
    //                                         Du kan ikke søke for denne perioden fordi du får dekket først fra og med den
    //                                         17. dagen etter inntektsstapet startet
    //                                     </AlertStripeAdvarsel>
    //                                 </FormBlock>
    //                             );
    //                         }
    //                         if (apiPeriode === undefined) {
    //                             return null;
    //                         }
    //                         const numberOfDays = getNumberOfDaysInDateRange(apiPeriode);
    //                         return (
    //                             <>
    //                                 <FormBlock>
    //                                     <AlertStripeInfo>
    //                                         Du kan søke kompensasjon for {numberOfDays}{' '}
    //                                         {pluralize(numberOfDays, 'dag', 'dager')} i denne perioden (
    //                                         <DateRangeView dateRange={apiPeriode} />)
    //                                     </AlertStripeInfo>
    //                                 </FormBlock>
    //                                 {isVisible(Q.selvstendigInntekt2019) && (
    //                                     <FormBlock>
    //                                         <ApplicationFormComponents.Input
    //                                             name={ApplicationFormField.selvstendigInntekt2019}
    //                                             type="number"
    //                                             bredde="S"
    //                                             label={'Hvilken inntekt hadde du fra dine bedrifter i 2019?'}
    //                                             validate={validateAll([
    //                                                 validateRequiredNumber({ min: 0, max: MAX_INNTEKT }),
    //                                             ])}
    //                                         />
    //                                     </FormBlock>
    //                                 )}
    //                                 {isVisible(Q.selvstendigInntekt2020) && (
    //                                     <FormBlock>
    //                                         <ApplicationFormComponents.Input
    //                                             name={ApplicationFormField.selvstendigInntekt2020}
    //                                             type="number"
    //                                             bredde="S"
    //                                             label={'Hvilken inntekt hadde du fra dine bedrifter i 2020?'}
    //                                             validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
    //                                         />
    //                                     </FormBlock>
    //                                 )}
    //                                 {isVisible(Q.selvstendigInntektIPerioden) && (
    //                                     <FormBlock>
    //                                         <ApplicationFormComponents.Input
    //                                             name={ApplicationFormField.selvstendigInntektIPerioden}
    //                                             type="number"
    //                                             bredde="S"
    //                                             label={'Hvilken inntekt har du hatt i perioden du søker for?'}
    //                                             validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
    //                                         />
    //                                     </FormBlock>
    //                                 )}
    //                             </>
    //                         );
    //                     }}
    //                 />
    //             </>
    // )} */}
};

export default SelvstendigStep;

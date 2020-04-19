import React from 'react';
import ApplicationStep from '../ApplicationStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { useFormikContext } from 'formik';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import useAvailableSøknadsperiode, { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import { FrilanserFormQuestions } from './frilanserFormConfig';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import AppVeilederSVG from '../../components/app-veileder-svg/AppVeilederSVG';
import Guide from '../guide/Guide';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ApplicationFormComponents from '../ApplicationFormComponents';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import {
    validateYesOrNoIsAnswered,
    validateRequiredField,
    validateRequiredNumber,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { validateAll, validateDateInRange, MAX_INNTEKT } from '../../validation/fieldValidations';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { isDateBeforeKoronatiltak, KORONA_DATE } from '../../utils/koronaUtils';
import DateView from '../../components/date-view/DateView';
import { getNumberOfDaysInDateRange, apiStringDateToDate } from '../../utils/dateUtils';
import { pluralize } from '../../utils/pluralize';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import { Element, Undertittel } from 'nav-frontend-typografi';
import InfoPanel from '../info-panel/InfoPanel';

const MIN_DATE: Date = apiStringDateToDate('2020-02-01');

const FrilanserStep = ({ applicationEssentials, resetApplication, onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<ApplicationFormData>();

    const { frilanserInntektstapStartetDato } = values;
    const { currentSøknadsperiode } = applicationEssentials;

    const { availableDateRange, isLimitedDateRange, isLoading } = useAvailableSøknadsperiode(
        frilanserInntektstapStartetDato,
        currentSøknadsperiode
    );

    const { isVisible, areAllQuestionsAnswered } = FrilanserFormQuestions.getVisbility({
        ...values,
        ...applicationEssentials,
    });

    return (
        <ApplicationStep
            id={StepID.FRILANSER}
            onValidFormSubmit={onValidSubmit}
            resetApplication={resetApplication}
            showSubmitButton={areAllQuestionsAnswered() && values.frilanserHarTaptInntektPgaKorona === YesOrNo.YES}>
            <Guide kompakt={true} type="normal" svg={<AppVeilederSVG />}>
                <p>Skal det være noe informasjon som introduserer steget?</p>
            </Guide>
            {isVisible(ApplicationFormField.frilanserHarTaptInntektPgaKorona) && (
                <FormBlock>
                    <ApplicationFormComponents.YesOrNoQuestion
                        name={ApplicationFormField.frilanserHarTaptInntektPgaKorona}
                        legend={
                            <span>
                                Har du tapt inntekt som frilanser på grunn av koronatiltak i perioden{' '}
                                <DateRangeView dateRange={currentSøknadsperiode} />?
                            </span>
                        }
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {values.frilanserHarTaptInntektPgaKorona === YesOrNo.NO && (
                <FormBlock>
                    <AlertStripeAdvarsel>
                        Du kan ikke søke om kompensasjon for tap som ikke er forårsaket av Korona
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}
            {isVisible(ApplicationFormField.frilanserInntektstapStartetDato) && (
                <FormBlock>
                    <ApplicationFormComponents.DatePicker
                        name={ApplicationFormField.frilanserInntektstapStartetDato}
                        label={'Når startet inntektstapet ditt som frilanser?'}
                        dateLimitations={{
                            minDato: MIN_DATE,
                            maksDato: currentSøknadsperiode.to,
                        }}
                        validate={validateAll([validateRequiredField, validateDateInRange(currentSøknadsperiode)])}
                    />
                    {isValidDateRange(availableDateRange) && (
                        <Box margin="l" padBottom="xxl">
                            <AlertStripeInfo>
                                {isDateBeforeKoronatiltak(frilanserInntektstapStartetDato) && (
                                    <Box padBottom="l">
                                        Du har valgt en dato som er tidligere enn <DateView date={KORONA_DATE} />, som
                                        er første dag du kan få dekket gjennom denne ordningen.
                                    </Box>
                                )}
                                {isLimitedDateRange && (
                                    <>
                                        Du må selv dekke de 16 første dagene etter at inntektstapet startet. De{' '}
                                        {getNumberOfDaysInDateRange(availableDateRange)}{' '}
                                        {pluralize(getNumberOfDaysInDateRange(availableDateRange), 'dag', 'dagene')} du
                                        søker for er da perioden{' '}
                                        <strong>
                                            <DateRangeView dateRange={availableDateRange} extendedFormat={true} />
                                        </strong>{' '}
                                        .
                                    </>
                                )}
                            </AlertStripeInfo>
                        </Box>
                    )}
                </FormBlock>
            )}
            {values.frilanserHarTaptInntektPgaKorona === YesOrNo.YES && (
                <LoadWrapper
                    isLoading={isLoading}
                    contentRenderer={() => {
                        if (availableDateRange === undefined) {
                            return null;
                        }
                        if (availableDateRange === 'NO_AVAILABLE_DATERANGE') {
                            return (
                                <FormBlock>
                                    <AlertStripeAdvarsel>
                                        Du kan ikke søke for denne perioden fordi du får dekket først fra og med den 17.
                                        dagen etter inntektsstapet startet.{' '}
                                    </AlertStripeAdvarsel>
                                </FormBlock>
                            );
                        }
                        return (
                            <>
                                <InfoPanel>
                                    <Undertittel>Din inntekt som frilanser</Undertittel>
                                    <p>
                                        Vi trenger å vite hvilken inntekt du hadde som frilanser i perioden{' '}
                                        <strong>
                                            <DateRangeView dateRange={availableDateRange} />
                                        </strong>
                                        .
                                    </p>
                                    <Box margin="l">
                                        <Element>Inntekter som skal tas med:</Element>
                                        <ul>
                                            <li>Inntektene du har på ditt arbeid som frilanser</li>
                                            <li>Inntekter som er utbetalinger fra NAV som frilanser</li>
                                        </ul>
                                        <Element>Inntekter som IKKE skal tas med:</Element>
                                        <ul>
                                            <li>Eventuell uføretrygd</li>
                                            <li>Eventuell alderspensjon</li>
                                            <li>Eventuell inntekt som selvstendig næringsdrivende</li>
                                        </ul>
                                    </Box>
                                </InfoPanel>
                                {isVisible(ApplicationFormField.frilanserInntektIPerioden) && (
                                    <FormBlock>
                                        <ApplicationFormComponents.Input
                                            name={ApplicationFormField.frilanserInntektIPerioden}
                                            type="number"
                                            bredde="S"
                                            label={
                                                <span>
                                                    Hvilken inntekt har du hatt som frilanser i perioden{' '}
                                                    <DateRangeView
                                                        extendedFormat={true}
                                                        dateRange={availableDateRange}
                                                    />
                                                    ?
                                                </span>
                                            }
                                            validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                        />
                                    </FormBlock>
                                )}

                                {isVisible(ApplicationFormField.frilanserHarHattInntektSomSelvstendigIPerioden) && (
                                    <FormBlock>
                                        <ApplicationFormComponents.YesOrNoQuestion
                                            legend={
                                                <span>
                                                    Har du hatt inntekt som selvstendig i perioden{' '}
                                                    <DateRangeView dateRange={availableDateRange} />?
                                                </span>
                                            }
                                            name={ApplicationFormField.frilanserHarHattInntektSomSelvstendigIPerioden}
                                        />
                                    </FormBlock>
                                )}
                                {isVisible(ApplicationFormField.frilanserInntektSomSelvstendigIPerioden) && (
                                    <FormBlock>
                                        <ApplicationFormComponents.Input
                                            name={ApplicationFormField.frilanserInntektSomSelvstendigIPerioden}
                                            type="number"
                                            bredde="S"
                                            label={
                                                <span>
                                                    Hva hadde du i inntekt som selvstendig næringsdrivende i denne
                                                    perioden?
                                                </span>
                                            }
                                            validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                        />
                                    </FormBlock>
                                )}
                            </>
                        );
                    }}
                />
            )}
        </ApplicationStep>
    );
};

export default FrilanserStep;

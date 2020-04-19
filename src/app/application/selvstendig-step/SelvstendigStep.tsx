import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    validateRequiredField,
    validateRequiredNumber,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import moment from 'moment';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Element, Undertittel } from 'nav-frontend-typografi';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import DateView from '../../components/date-view/DateView';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import ForetakList from '../../components/foretak-list/ForetakList';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import useAvailableSøknadsperiode, { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import { ApplicationFormData, ApplicationFormField } from '../../types/ApplicationFormData';
import { isDateBeforeKoronatiltak, KORONA_DATE } from '../../utils/koronaUtils';
import { pluralize } from '../../utils/pluralize';
import { MAX_INNTEKT, validateAll, validateDateInRange } from '../../validation/fieldValidations';
import ApplicationFormComponents from '../ApplicationFormComponents';
import ApplicationStep from '../ApplicationStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { SelvstendigFormQuestions } from './selvstendigFormConfig';
import Guide from '../guide/Guide';
import AppVeileder from '../../components/app-veileder/AppVeileder';
import InfoPanel from '../info-panel/InfoPanel';

const getNumberOfDaysInDateRange = (dateRange: DateRange): number => {
    return moment(dateRange.to).diff(dateRange.from, 'days') + 1;
};

const MIN_DATE: Date = apiStringDateToDate('2020-02-01');

const SelvstendigStep = ({ onValidSubmit, applicationEssentials }: StepConfigProps) => {
    const { values } = useFormikContext<ApplicationFormData>();

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

    return (
        <ApplicationStep
            id={StepID.SELVSTENDIG}
            onValidFormSubmit={onValidSubmit}
            showSubmitButton={areAllQuestionsAnswered()}>
            <Guide kompakt={true} type="normal" svg={<AppVeileder />}>
                <p>
                    Vi har funnet {antallForetak} foretak registrert på deg som du kan søke om tapt inntekt for.
                    Informasjonen du oppgir på denne siden skal gjelde for alle foretakene dine samlet.
                </p>
                <ExpandableInfo closeTitle={'Skjul liste'} title={'Vis foretak vi har registrert'}>
                    <ForetakList foretak={foretak} />
                </ExpandableInfo>
            </Guide>
            {isVisible(ApplicationFormField.selvstendigHarTaptInntektPgaKorona) && (
                <FormBlock>
                    <ApplicationFormComponents.YesOrNoQuestion
                        name={ApplicationFormField.selvstendigHarTaptInntektPgaKorona}
                        legend={
                            <span>
                                Har du tapt inntekt som selvstendig næringsdrivende på grunn av koronatiltak i perioden{' '}
                                <DateRangeView dateRange={currentSøknadsperiode} />?
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
                            minDato: MIN_DATE,
                            maksDato: currentSøknadsperiode.to,
                        }}
                        validate={validateAll([validateRequiredField, validateDateInRange(currentSøknadsperiode)])}
                    />
                    {isValidDateRange(availableDateRange) && (
                        <Box margin="l" padBottom="xxl">
                            <AlertStripeInfo>
                                {isDateBeforeKoronatiltak(selvstendigInntektstapStartetDato) && (
                                    <Box padBottom="l">
                                        Du har valgt en dato som er tidligere enn <DateView date={KORONA_DATE} />, som
                                        er første dag du kan få dekket gjennom denne ordningen.
                                    </Box>
                                )}
                                {isLimitedDateRange && (
                                    <>
                                        Du må selv dekke de 16 første dagene etter at inntektstapet startet. De{' '}
                                        {getNumberOfDaysInDateRange(availableDateRange)}{' '}
                                        {pluralize(getNumberOfDaysInDateRange(availableDateRange), 'dag', 'dagene')} i
                                        du søker for er da perioden{' '}
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
            {values.selvstendigHarTaptInntektPgaKorona === YesOrNo.YES && (
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
                                    <Undertittel>Din inntekt som selvstendig næringsdrivende</Undertittel>
                                    <p>
                                        Vi trenger å vite hvilken inntekt du hadde som selvstendig næringsdrivende i
                                        perioden{' '}
                                        <strong>
                                            <DateRangeView dateRange={availableDateRange} />
                                        </strong>
                                        .
                                    </p>
                                    <Box margin="l">
                                        <Element>Inntekter som skal tas med:</Element>
                                        <ul>
                                            <li>Inntektene du har på dine foretak. Dette er omsetning - utgifter</li>
                                            <li>
                                                Inntekter som er utbetalinger fra NAV som selvstendig næringsdrivende
                                            </li>
                                        </ul>
                                        <Element>Inntekter som IKKE skal tas med:</Element>
                                        <ul>
                                            <li>Eventuell uføretrygd</li>
                                            <li>Eventuell alderspensjon</li>
                                            <li>Eventuell inntekt som frilanser</li>
                                        </ul>
                                    </Box>
                                </InfoPanel>
                                {isVisible(ApplicationFormField.selvstendigInntektIPerioden) && (
                                    <FormBlock>
                                        <ApplicationFormComponents.Input
                                            name={ApplicationFormField.selvstendigInntektIPerioden}
                                            type="number"
                                            bredde="S"
                                            label={
                                                <span>
                                                    Hvilken inntekt har du hatt i{' '}
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
                                {isVisible(ApplicationFormField.selvstendigErFrilanser) && (
                                    <FormBlock>
                                        <ApplicationFormComponents.YesOrNoQuestion
                                            legend="Er du frilanser?"
                                            name={ApplicationFormField.selvstendigErFrilanser}
                                        />
                                    </FormBlock>
                                )}
                                {isVisible(ApplicationFormField.selvstendigHarHattInntektSomFrilanserIPerioden) && (
                                    <FormBlock>
                                        <ApplicationFormComponents.YesOrNoQuestion
                                            legend={
                                                <span>
                                                    Har du hatt inntekt som frilanser i perioden{' '}
                                                    <DateRangeView dateRange={availableDateRange} />?
                                                </span>
                                            }
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
                                            label={<span>Hva hadde du i inntekt som frilanser i denne perioden?</span>}
                                            validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                        />
                                    </FormBlock>
                                )}

                                {isVisible(ApplicationFormField.selvstendigInntekt2019) && (
                                    <Box margin="xxl">
                                        <Undertittel>Inntekt som selvstendig næringsdrivende i 2019</Undertittel>
                                        <FormBlock margin="l">
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
                                    </Box>
                                )}
                                {isVisible(ApplicationFormField.selvstendigInntekt2020) && (
                                    <Box margin="xxl">
                                        <Undertittel>
                                            Inntekt som selvstendig næringsdrivende i januar og februar 2020
                                        </Undertittel>
                                        <FormBlock margin="l">
                                            <ApplicationFormComponents.Input
                                                name={ApplicationFormField.selvstendigInntekt2020}
                                                type="number"
                                                bredde="S"
                                                label={'Hvilken inntekt har du hatt fra dine foretak i 2020?'}
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

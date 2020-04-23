import React, { useEffect } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import {
    validateRequiredField,
    validateRequiredNumber,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Element, Undertittel } from 'nav-frontend-typografi';
import AppVeilederSVG from '../../components/app-veileder-svg/AppVeilederSVG';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import Guide from '../../components/guide/Guide';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import useAvailableSøknadsperiode, { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { apiStringDateToDate } from '../../utils/dateUtils';
import { MAX_INNTEKT, validateAll, validateDateInRange } from '../../validation/fieldValidations';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadStep from '../SoknadStep';
import AvailableDateRangeInfo from '../content/AvailableDateRangeInfo';
import { StepConfigProps, StepID } from '../stepConfig';
import { FrilanserFormQuestions } from './frilanserFormConfig';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import { frilanserStepTexts } from './frilanserStepTexts';
import { ensureString } from '../../utils/ensureString';
import useAlderCheck from '../../hooks/useAlderCheck';
import FrilanserInfo from './FrilanserInfo';

const MIN_DATE: Date = apiStringDateToDate('2020-02-01');

const txt = frilanserStepTexts;

const FrilanserStep = ({ soknadEssentials, resetSoknad: resetSoknad, onValidSubmit }: StepConfigProps) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();

    const { frilanserInntektstapStartetDato } = values;
    const { currentSøknadsperiode } = soknadEssentials;

    const {
        availableDateRange,
        isLimitedDateRange,
        isLoading: availableDateRangeIsLoading,
    } = useAvailableSøknadsperiode(frilanserInntektstapStartetDato, currentSøknadsperiode);

    const { result: alderCheckResult, isLoading: alderCheckIsLoading } = useAlderCheck(
        isValidDateRange(availableDateRange) ? availableDateRange : undefined
    );
    const isLoading = availableDateRangeIsLoading || alderCheckIsLoading;
    const { isVisible, areAllQuestionsAnswered } = FrilanserFormQuestions.getVisbility({
        ...values,
        ...soknadEssentials,
    });

    useEffect(() => {
        setFieldValue(SoknadFormField.frilanserCalculatedDateRange, availableDateRange);
    }, [availableDateRange]);

    return (
        <SoknadStep
            id={StepID.FRILANSER}
            onValidFormSubmit={onValidSubmit}
            resetSoknad={resetSoknad}
            showSubmitButton={
                areAllQuestionsAnswered() &&
                (values.frilanserHarTaptInntektPgaKorona === YesOrNo.YES ||
                    values.søkerOmTaptInntektSomSelvstendigNæringsdrivende === YesOrNo.YES)
            }>
            <Guide kompakt={true} type="normal" svg={<AppVeilederSVG />}>
                <p>Skal det være noe informasjon som introduserer steget?</p>
            </Guide>
            {isVisible(SoknadFormField.frilanserHarTaptInntektPgaKorona) && (
                <FormBlock>
                    <SoknadFormComponents.YesOrNoQuestion
                        name={SoknadFormField.frilanserHarTaptInntektPgaKorona}
                        legend={ensureString(txt.frilanserHarTaptInntektPgaKorona(currentSøknadsperiode))}
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
            {isVisible(SoknadFormField.frilanserErNyetablert) && (
                <FormBlock>
                    <SoknadFormComponents.YesOrNoQuestion
                        name={SoknadFormField.frilanserErNyetablert}
                        legend={ensureString(txt.frilanserErNyetablert)}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}
            {isVisible(SoknadFormField.frilanserInntektstapStartetDato) && (
                <FormBlock>
                    <SoknadFormComponents.DatePicker
                        name={SoknadFormField.frilanserInntektstapStartetDato}
                        label={ensureString(txt.frilanserInntektstapStartetDato)}
                        dateLimitations={{
                            minDato: MIN_DATE,
                            maksDato: currentSøknadsperiode.to,
                        }}
                        validate={validateAll([
                            validateRequiredField,
                            validateDateInRange({ from: MIN_DATE, to: currentSøknadsperiode.to }),
                        ])}
                    />
                    {isValidDateRange(availableDateRange) &&
                        alderCheckIsLoading === false &&
                        alderCheckResult?.innfrirKrav === true && (
                            <Box margin="l" padBottom="xxl">
                                <AvailableDateRangeInfo
                                    inntektstapStartetDato={frilanserInntektstapStartetDato}
                                    availableDateRange={availableDateRange}
                                    isLimitedDateRange={isLimitedDateRange}
                                />
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
                        if (alderCheckResult?.innfrirKrav === false) {
                            return <FormBlock>{FrilanserInfo.advarselAlderSjekkFeiler()}</FormBlock>;
                        }

                        return (
                            <>
                                <Undertittel className="sectionTitle">Ytelser fra NAV</Undertittel>
                                {isVisible(SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet) && (
                                    <FormBlock>
                                        <SoknadFormComponents.YesOrNoQuestion
                                            name={SoknadFormField.frilanserHarYtelseFraNavSomDekkerTapet}
                                            legend={ensureString(txt.frilanserHarYtelseFraNavSomDekkerTapet)}
                                        />
                                    </FormBlock>
                                )}
                                {isVisible(SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet) && (
                                    <FormBlock>
                                        <SoknadFormComponents.YesOrNoQuestion
                                            name={SoknadFormField.frilanserYtelseFraNavDekkerHeleTapet}
                                            legend={ensureString(txt.frilanserYtelseFraNavDekkerHeleTapet)}
                                        />
                                    </FormBlock>
                                )}
                                {isVisible(SoknadFormField.frilanserInntektIPerioden) && (
                                    <>
                                        <Box margin="xxl">
                                            <Undertittel className="sectionTitle">
                                                Frilanserinntekt i perioden du søker for
                                            </Undertittel>
                                        </Box>
                                        <FormBlock>
                                            <SoknadFormComponents.Input
                                                name={SoknadFormField.frilanserInntektIPerioden}
                                                type="number"
                                                bredde="S"
                                                description={
                                                    <ExpandableInfo title="Hvordan beregner du inntekt?">
                                                        <Box margin="l">
                                                            <Element>Inntekter som skal tas med:</Element>
                                                            <ul>
                                                                <li>Inntektene du har på ditt arbeid som frilanser</li>
                                                                <li>
                                                                    Inntekter som er utbetalinger fra NAV som frilanser
                                                                </li>
                                                            </ul>
                                                            <Element>Inntekter som IKKE skal tas med:</Element>
                                                            <ul>
                                                                <li>Eventuell uføretrygd</li>
                                                                <li>Eventuell alderspensjon</li>
                                                                <li>
                                                                    Eventuell inntekt som selvstendig næringsdrivende
                                                                </li>
                                                            </ul>
                                                        </Box>
                                                    </ExpandableInfo>
                                                }
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
                                    </>
                                )}

                                {isVisible(SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden) && (
                                    <Box margin="xxl">
                                        <Undertittel className="sectionTitle">Selvstendig næringsdrivende</Undertittel>
                                        <FormBlock>
                                            <SoknadFormComponents.YesOrNoQuestion
                                                legend={ensureString(
                                                    txt.frilanserHarHattInntektSomSelvstendigIPerioden(
                                                        availableDateRange
                                                    )
                                                )}
                                                name={SoknadFormField.frilanserHarHattInntektSomSelvstendigIPerioden}
                                            />
                                        </FormBlock>
                                    </Box>
                                )}
                                {isVisible(SoknadFormField.frilanserInntektSomSelvstendigIPerioden) && (
                                    <FormBlock>
                                        <SoknadFormComponents.Input
                                            name={SoknadFormField.frilanserInntektSomSelvstendigIPerioden}
                                            type="number"
                                            bredde="S"
                                            label={ensureString(txt.frilanserInntektSomSelvstendigIPerioden)}
                                            validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                        />
                                    </FormBlock>
                                )}
                            </>
                        );
                    }}
                />
            )}
        </SoknadStep>
    );
};

export default FrilanserStep;

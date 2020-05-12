import React, { useEffect } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { validateRequiredField, validateRequiredNumber } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import ResponsivePanel from 'common/components/responsive-panel/ResponsivePanel';
import Guide from '../../components/guide/Guide';
import LoadWrapper from '../../components/load-wrapper/LoadWrapper';
import StopMessage from '../../components/stop-message/StopMessage';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import { QuestionVisibilityContext } from '../../context/QuestionVisibilityContext';
import useAvailableSøknadsperiode, { isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';
import useInntektsperiode from '../../hooks/useInntektsperiode';
import FormSection from '../../pages/intro-page/FormSection';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { MIN_DATE_PERIODEVELGER } from '../../utils/dateUtils';
import {
    harSelskaperRegistrertFør2019,
    hasValidHistoriskInntekt,
    getStartetSomSelvstendigNæringsdrivendeDato,
} from '../../utils/selvstendigUtils';
import { MAX_INNTEKT, validateAll, validatePhoneNumber } from '../../validation/fieldValidations';
import AvailableDateRangeInfo from '../info/AvailableDateRangeInfo';
import FrilanserInfo from '../info/FrilanserInfo';
import SelvstendigInfo from '../info/SelvstendigInfo';
import SoknadErrors from '../soknad-errors/SoknadErrors';
import FormComponents from '../SoknadFormComponents';
import SoknadQuestion from '../SoknadQuestion';
import { soknadQuestionText } from '../soknadQuestionText';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import { cleanupSelvstendigStep } from './cleanupSelvstendigStep';
import HistoriskForetakListAndDialog from './historisk-foretak/HistoriskForetakListAndDialog';
import {
    kontrollerSelvstendigSvar,
    SelvstendigNæringdsrivendeAvslagÅrsak,
    SelvstendigNæringsdrivendeAvslagStatus,
} from './selvstendigAvslag';
import { SelvstendigFormConfigPayload, SelvstendigFormQuestions } from './selvstendigFormConfig';
import { usePrevious } from '../../hooks/usePrevious';

const txt = soknadQuestionText;

const getStopReason = (
    status: SelvstendigNæringsdrivendeAvslagStatus
): SelvstendigNæringdsrivendeAvslagÅrsak | undefined => {
    const feil = Object.keys(status).filter((key) => status[key] === true);
    return feil ? (feil[0] as SelvstendigNæringdsrivendeAvslagÅrsak) : undefined;
};

const SelvstendigStep = ({ resetSoknad, onValidSubmit, soknadEssentials }: StepConfigProps) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();
    const {
        selvstendigInntektstapStartetDato,
        selvstendigHarHattInntektFraForetak,
        selvstendigHarTaptInntektPgaKorona,
        søkerOmTaptInntektSomFrilanser,
        selvstendigHarYtelseFraNavSomDekkerTapet,
        selvstendigHarAvvikletSelskaper,
        selvstendigAvvikledeSelskaper,
        selvstendigBeregnetInntektsårstall,
    } = values;
    const { currentSøknadsperiode, personligeForetak } = soknadEssentials;

    if (personligeForetak === undefined) {
        return <SoknadErrors.MissingApiDataError />;
    }
    const { foretak = [], tidligsteRegistreringsdato } = personligeForetak;
    const antallForetak = foretak.length;

    const { availableDateRange, isLoading: availableDateRangeIsLoading } = useAvailableSøknadsperiode(
        selvstendigInntektstapStartetDato,
        currentSøknadsperiode
    );

    const historiskeForetak =
        selvstendigHarAvvikletSelskaper === YesOrNo.YES ? selvstendigAvvikledeSelskaper || [] : [];

    const startetSomSelvstendigNæringsdrivende = getStartetSomSelvstendigNæringsdrivendeDato(
        historiskeForetak,
        tidligsteRegistreringsdato
    );

    const { inntektsperiode, isLoading: inntektsperiodeIsLoading } = useInntektsperiode({
        selvstendigInntektstapStartetDato,
        startetSomSelvstendigNæringsdrivende: getStartetSomSelvstendigNæringsdrivendeDato(
            historiskeForetak,
            startetSomSelvstendigNæringsdrivende
        ),
    });

    const isLoading = availableDateRangeIsLoading || inntektsperiodeIsLoading;

    const avslag = kontrollerSelvstendigSvar(values);
    const skalSpørreOmHistoriskeSelskaper = harSelskaperRegistrertFør2019(personligeForetak) === false;

    const payload: SelvstendigFormConfigPayload = {
        ...values,
        ...soknadEssentials,
        skalSpørreOmHistoriskeSelskaper,
        avslag,
    };
    const visibility = SelvstendigFormQuestions.getVisbility(payload);
    const { isVisible, areAllQuestionsAnswered } = visibility;
    const allQuestionsAreAnswered = areAllQuestionsAnswered();

    const hasValidSelvstendigFormData: boolean =
        allQuestionsAreAnswered &&
        isValidDateRange(availableDateRange) &&
        hasValidHistoriskInntekt(values) &&
        selvstendigHarHattInntektFraForetak === YesOrNo.YES &&
        selvstendigHarTaptInntektPgaKorona === YesOrNo.YES &&
        selvstendigHarYtelseFraNavSomDekkerTapet === YesOrNo.NO;

    useEffect(() => {
        setFieldValue(
            SoknadFormField.selvstendigBeregnetTilgjengeligSøknadsperiode,
            isValidDateRange(availableDateRange) ? availableDateRange : undefined
        );
    }, [availableDateRange]);

    useEffect(() => {
        setFieldValue(
            SoknadFormField.selvstendigBeregnetInntektsårstall,
            inntektsperiode ? inntektsperiode.inntektsårstall : undefined
        );
    }, [inntektsperiode]);

    const prevSelvstendigBeregnetInntektsårstall = usePrevious(selvstendigBeregnetInntektsårstall);
    useEffect(() => {
        if (
            inntektsperiodeIsLoading === true ||
            selvstendigBeregnetInntektsårstall === undefined ||
            prevSelvstendigBeregnetInntektsårstall === undefined
        ) {
            // Ikke reset når bruker kommer tilbake til steg
            return;
        }
        if (selvstendigBeregnetInntektsårstall !== prevSelvstendigBeregnetInntektsårstall) {
            setFieldValue(SoknadFormField.selvstendigAlleAvvikledeSelskaperErRegistrert, YesOrNo.UNANSWERED);
            setFieldValue(SoknadFormField.selvstendigHarHattInntektFraForetak, YesOrNo.UNANSWERED);
            setFieldValue(SoknadFormField.selvstendigInntekt2019, undefined);
            setFieldValue(SoknadFormField.selvstendigInntekt2020, undefined);
        }
    }, [selvstendigBeregnetInntektsårstall]);

    return (
        <SoknadStep
            id={StepID.SELVSTENDIG}
            resetSoknad={resetSoknad}
            onValidFormSubmit={onValidSubmit}
            stepCleanup={(values) => {
                const v = { ...values };
                v.selvstendigSoknadIsOk = hasValidSelvstendigFormData;
                v.selvstendigStopReason = hasValidSelvstendigFormData ? undefined : getStopReason(avslag);
                return cleanupSelvstendigStep(v, avslag);
            }}
            showSubmitButton={
                !isLoading &&
                (hasValidSelvstendigFormData ||
                    (allQuestionsAreAnswered && søkerOmTaptInntektSomFrilanser === YesOrNo.YES))
            }>
            <QuestionVisibilityContext.Provider value={{ visibility }}>
                <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                    <SelvstendigInfo.intro antallForetak={antallForetak} foretak={foretak} />
                </Guide>

                <SoknadQuestion
                    name={SoknadFormField.selvstendigHarTaptInntektPgaKorona}
                    legend={txt.selvstendigHarTaptInntektPgaKorona(currentSøknadsperiode)}
                    description={<SelvstendigInfo.infoTaptInntektPgaKorona />}
                    showStop={avslag.harIkkeHattInntektstapPgaKorona}
                    stopMessage={<SelvstendigInfo.StoppIkkeTapPgaKorona />}
                />
                <SoknadQuestion
                    name={SoknadFormField.selvstendigInntektstapStartetDato}
                    showInfo={isValidDateRange(availableDateRange)}
                    infoMessage={
                        <AvailableDateRangeInfo
                            inntektstapStartetDato={selvstendigInntektstapStartetDato}
                            availableDateRange={availableDateRange}
                        />
                    }>
                    <FormComponents.DatePicker
                        name={SoknadFormField.selvstendigInntektstapStartetDato}
                        label={txt.selvstendigInntektstapStartetDato}
                        description={<SelvstendigInfo.infoNårStartetInntektstapet />}
                        dateLimitations={{
                            minDato: MIN_DATE_PERIODEVELGER,
                            maksDato: currentSøknadsperiode.to,
                        }}
                        dayPickerProps={{
                            initialMonth: currentSøknadsperiode.to,
                        }}
                        useErrorBoundary={true}
                    />
                </SoknadQuestion>

                {isVisible(SoknadFormField.selvstendigInntektIPerioden) && (
                    <LoadWrapper
                        isLoading={availableDateRangeIsLoading}
                        contentRenderer={() => {
                            if (availableDateRange === undefined) {
                                return null;
                            }
                            if (availableDateRange === 'NO_AVAILABLE_DATERANGE') {
                                return (
                                    <StopMessage>
                                        <SelvstendigInfo.StoppForSentInntektstap />
                                    </StopMessage>
                                );
                            }
                            return (
                                <>
                                    <SoknadQuestion
                                        name={SoknadFormField.selvstendigInntektIPerioden}
                                        description={<SelvstendigInfo.infoAndreUtbetalingerFraNAV />}>
                                        <FormComponents.Input
                                            name={SoknadFormField.selvstendigInntektIPerioden}
                                            label={txt.selvstendigInntektIPerioden(availableDateRange)}
                                            type="number"
                                            bredde="S"
                                            maxLength={8}
                                            max={MAX_INNTEKT}
                                            description={
                                                <SelvstendigInfo.infoHvordanBeregneInntekt
                                                    periode={availableDateRange}
                                                />
                                            }
                                            validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                        />
                                    </SoknadQuestion>
                                    <SoknadQuestion
                                        name={SoknadFormField.selvstendigHarAvvikletSelskaper}
                                        legend={txt.selvstendigHarAvvikletSelskaper}
                                    />
                                    <SoknadQuestion name={SoknadFormField.selvstendigAvvikledeSelskaper}>
                                        <HistoriskForetakListAndDialog<SoknadFormField>
                                            maxDate={selvstendigInntektstapStartetDato}
                                            name={SoknadFormField.selvstendigAvvikledeSelskaper}
                                        />
                                    </SoknadQuestion>

                                    <SoknadQuestion
                                        name={SoknadFormField.selvstendigAlleAvvikledeSelskaperErRegistrert}
                                        legend={txt.selvstendigAlleAvvikledeSelskaperErRegistrert}
                                        showInfo={values.selvstendigAlleAvvikledeSelskaperErRegistrert === YesOrNo.NO}
                                        info={<SelvstendigInfo.infoAlleAvvikledeSelskaperErIkkeRegistrert />}
                                    />

                                    {isVisible(SoknadFormField.selvstendigHarHattInntektFraForetak) && (
                                        <LoadWrapper
                                            isLoading={inntektsperiodeIsLoading}
                                            contentRenderer={() => (
                                                <>
                                                    {selvstendigBeregnetInntektsårstall && (
                                                        <SoknadQuestion
                                                            name={SoknadFormField.selvstendigHarHattInntektFraForetak}
                                                            legend={txt.selvstendigHarHattInntektFraForetak(
                                                                selvstendigBeregnetInntektsårstall
                                                            )}
                                                            description={
                                                                selvstendigBeregnetInntektsårstall && (
                                                                    <SelvstendigInfo.infoInntektÅrstall
                                                                        inntektÅrstall={
                                                                            selvstendigBeregnetInntektsårstall
                                                                        }
                                                                    />
                                                                )
                                                            }
                                                            showStop={avslag.oppgirHarIkkeHattInntektFraForetak}
                                                            stopMessage={
                                                                <SelvstendigInfo.StoppIkkeHattInntektFraForetak
                                                                    inntektÅrstall={selvstendigBeregnetInntektsårstall}
                                                                />
                                                            }
                                                        />
                                                    )}
                                                </>
                                            )}
                                        />
                                    )}
                                    <SoknadQuestion
                                        name={SoknadFormField.selvstendigInntekt2019}
                                        showStop={
                                            values.selvstendigInntekt2019 !== undefined &&
                                            avslag.oppgirNullHistoriskInntekt
                                        }
                                        stopMessage={
                                            <SelvstendigInfo.StoppIngenHistoriskInntekt inntektÅrstall={2019} />
                                        }>
                                        <FormComponents.Input
                                            name={SoknadFormField.selvstendigInntekt2019}
                                            type="number"
                                            bredde="S"
                                            maxLength={8}
                                            max={MAX_INNTEKT}
                                            label={txt.selvstendigInntekt2019}
                                            description={<SelvstendigInfo.infoSelvstendigInntekt2019 />}
                                            validate={validateAll([
                                                validateRequiredNumber({ min: 0, max: MAX_INNTEKT }),
                                            ])}
                                        />
                                    </SoknadQuestion>
                                    <SoknadQuestion
                                        name={SoknadFormField.selvstendigInntekt2020}
                                        showStop={
                                            values.selvstendigInntekt2020 !== undefined &&
                                            avslag.oppgirNullHistoriskInntekt
                                        }
                                        stopMessage={
                                            <SelvstendigInfo.StoppIngenHistoriskInntekt inntektÅrstall={2020} />
                                        }>
                                        <FormComponents.Input
                                            name={SoknadFormField.selvstendigInntekt2020}
                                            type="number"
                                            bredde="S"
                                            maxLength={8}
                                            max={MAX_INNTEKT}
                                            label={txt.selvstendigInntekt2020}
                                            validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                        />
                                    </SoknadQuestion>
                                    {isVisible(SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet) && (
                                        <FormSection title="Andre utbetalinger fra NAV ">
                                            <SoknadQuestion
                                                name={SoknadFormField.selvstendigHarYtelseFraNavSomDekkerTapet}
                                                description={<SelvstendigInfo.infoAndreUtbetalingerFraNAV />}
                                                showStop={avslag.harYtelseFraNavSomDekkerTapet}
                                                stopMessage={<SelvstendigInfo.StoppYtelseDekkerHeleTapet />}
                                            />
                                        </FormSection>
                                    )}
                                    {isVisible(SoknadFormField.selvstendigErFrilanser) && (
                                        <FormSection title="Frilanser">
                                            <SoknadQuestion name={SoknadFormField.selvstendigErFrilanser} />
                                            <SoknadQuestion
                                                name={SoknadFormField.selvstendigHarHattInntektSomFrilanserIPerioden}
                                                legend={txt.selvstendigHarHattInntektSomFrilanserIPerioden(
                                                    availableDateRange
                                                )}
                                            />
                                            <SoknadQuestion
                                                name={SoknadFormField.selvstendigInntektSomFrilanserIPerioden}>
                                                <FormComponents.Input
                                                    name={SoknadFormField.selvstendigInntektSomFrilanserIPerioden}
                                                    type="number"
                                                    bredde="S"
                                                    maxLength={8}
                                                    max={MAX_INNTEKT}
                                                    label={txt.selvstendigInntektSomFrilanserIPerioden(
                                                        availableDateRange
                                                    )}
                                                    validate={validateRequiredNumber({ min: 0, max: MAX_INNTEKT })}
                                                    description={
                                                        <FrilanserInfo.infoHvordanBeregneInntekt
                                                            periode={availableDateRange}
                                                        />
                                                    }
                                                />
                                            </SoknadQuestion>
                                        </FormSection>
                                    )}

                                    {isVisible(SoknadFormField.selvstendigHarRegnskapsfører) && (
                                        <FormSection title="Regnskapsfører">
                                            <SoknadQuestion name={SoknadFormField.selvstendigHarRegnskapsfører} />
                                            {isVisible(SoknadFormField.selvstendigRegnskapsførerNavn) && (
                                                <Box margin="l">
                                                    <ResponsivePanel>
                                                        <Box padBottom="l">
                                                            {antallForetak >= 1 && (
                                                                <>
                                                                    Hvis du har flere regnskapsførere, gir du
                                                                    opplysninger om den som er din hovedregnskapsfører.
                                                                </>
                                                            )}
                                                            <SoknadQuestion
                                                                name={SoknadFormField.selvstendigRegnskapsførerNavn}>
                                                                <FormComponents.Input
                                                                    name={SoknadFormField.selvstendigRegnskapsførerNavn}
                                                                    label={txt.selvstendigRegnskapsførerNavn}
                                                                    validate={validateRequiredField}
                                                                />
                                                            </SoknadQuestion>

                                                            <SoknadQuestion
                                                                name={SoknadFormField.selvstendigRegnskapsførerTelefon}
                                                                margin="l">
                                                                <FormComponents.Input
                                                                    name={
                                                                        SoknadFormField.selvstendigRegnskapsførerTelefon
                                                                    }
                                                                    label={txt.selvstendigRegnskapsførerTelefon}
                                                                    bredde="M"
                                                                    maxLength={12}
                                                                    validate={validatePhoneNumber}
                                                                />
                                                            </SoknadQuestion>
                                                        </Box>
                                                    </ResponsivePanel>
                                                </Box>
                                            )}
                                        </FormSection>
                                    )}
                                    {isVisible(SoknadFormField.selvstendigHarRevisor) && (
                                        <FormSection title="Revisor">
                                            <SoknadQuestion name={SoknadFormField.selvstendigHarRevisor} />
                                            {isVisible(SoknadFormField.selvstendigRevisorNavn) && (
                                                <Box margin="l">
                                                    <ResponsivePanel>
                                                        <Box padBottom="l">
                                                            {antallForetak >= 1 && (
                                                                <>
                                                                    Dersom du har flere revisorer, kan du oppgi
                                                                    informasjon om din hovedrevisor.
                                                                </>
                                                            )}
                                                            <SoknadQuestion
                                                                name={SoknadFormField.selvstendigRevisorNavn}
                                                                margin="l">
                                                                <FormComponents.Input
                                                                    name={SoknadFormField.selvstendigRevisorNavn}
                                                                    label={txt.selvstendigRevisorNavn}
                                                                    validate={validateRequiredField}
                                                                />
                                                            </SoknadQuestion>
                                                            <SoknadQuestion
                                                                name={SoknadFormField.selvstendigRevisorTelefon}
                                                                margin="l">
                                                                <FormComponents.Input
                                                                    label={txt.selvstendigRevisorTelefon}
                                                                    name={SoknadFormField.selvstendigRevisorTelefon}
                                                                    bredde="M"
                                                                    maxLength={12}
                                                                    validate={validatePhoneNumber}
                                                                />
                                                            </SoknadQuestion>
                                                            <SoknadQuestion
                                                                name={SoknadFormField.selvstendigRevisorNAVKanTaKontakt}
                                                                margin="l"
                                                            />
                                                        </Box>
                                                    </ResponsivePanel>
                                                </Box>
                                            )}
                                        </FormSection>
                                    )}
                                </>
                            );
                        }}
                    />
                )}
            </QuestionVisibilityContext.Provider>
        </SoknadStep>
    );
};

export default SelvstendigStep;

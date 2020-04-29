import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { Locale } from 'common/types/Locale';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import FormSection from '../../pages/intro-page/FormSection';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import BekreftSumRad from './bekreft-sum-rad/BekreftSumRad';
import { BekreftInntektFormQuestions } from './bekreftInntektFormConfig';
import SoknadErrorPage from '../../pages/soknad-error-page/SoknadErrorPage';
import Guide from '../../components/guide/Guide';
import ChecklistCircleIcon from '../../assets/ChecklistCircleIcon';
import { triggerSentryCustomError, SentryEventName } from '../../utils/sentryUtils';
import { isRunningInDevEnvironment } from '../../utils/envUtils';

const BekreftInntektStep = ({ soknadEssentials, resetSoknad, onValidSubmit }: StepConfigProps) => {
    const { values, setValues } = useFormikContext<SoknadFormData>();
    const { locale } = useIntl();
    const { selvstendigBeregnetTilgjengeligSøknadsperiode, frilanserBeregnetTilgjengeligSønadsperiode } = values;

    const apiValues = mapFormDataToApiData(soknadEssentials, values, locale as Locale);

    if (!apiValues) {
        return <SoknadErrorPage>Det oppstod en feil under visningen av siden</SoknadErrorPage>;
    }
    const { selvstendigNæringsdrivende, frilanser } = apiValues;

    const {
        bekrefterFrilansinntektIPerioden,
        bekrefterSelvstendigInntektIPerioden,
        bekrefterSelvstendigInntektI2019,
        bekrefterSelvstendigInntektI2020,
        bekrefterSelvstendigFrilanserInntektIPerioden,
        frilanserSoknadIsOk,
        selvstendigSoknadIsOk,
    } = values;

    const spørOmInntektSomFrilanserForSelvstendig: boolean =
        selvstendigNæringsdrivende !== undefined &&
        selvstendigNæringsdrivende.inntektIPeriodenSomFrilanser !== undefined &&
        (values.bekrefterSelvstendigInntektI2019 === YesOrNo.YES ||
            values.bekrefterSelvstendigInntektI2020 === YesOrNo.YES);

    const selvstendigBekreftet = selvstendigNæringsdrivende
        ? bekrefterSelvstendigInntektIPerioden === YesOrNo.YES &&
          (bekrefterSelvstendigInntektI2020 === YesOrNo.YES || bekrefterSelvstendigInntektI2019 === YesOrNo.YES) &&
          (spørOmInntektSomFrilanserForSelvstendig
              ? bekrefterSelvstendigFrilanserInntektIPerioden === YesOrNo.YES
              : true)
        : true;

    const frilansBekreftet = frilanser ? bekrefterFrilansinntektIPerioden === YesOrNo.YES : true;

    const showSubmitButton = frilansBekreftet === true && selvstendigBekreftet === true;

    useEffect(() => {
        setValues({
            ...values,

            bekrefterFrilansinntektIPerioden: YesOrNo.UNANSWERED,
            bekrefterSelvstendigInntektI2020: YesOrNo.UNANSWERED,
            bekrefterSelvstendigInntektI2019: YesOrNo.UNANSWERED,
            bekrefterSelvstendigInntektIPerioden: YesOrNo.UNANSWERED,
        });
    }, []);

    const { isVisible } = BekreftInntektFormQuestions.getVisbility({
        ...values,
        apiValues,
    });

    useEffect(() => {
        if (!frilanserSoknadIsOk && !selvstendigSoknadIsOk) {
            const payload = isRunningInDevEnvironment() ? values : undefined;
            triggerSentryCustomError(SentryEventName.invalidSelvstendigAndFrilansApiData, payload);
        }
    }, [selvstendigSoknadIsOk, frilanserSoknadIsOk]);

    return (
        <SoknadStep
            id={StepID.BEKREFT_INNTEKT}
            onValidFormSubmit={onValidSubmit}
            resetSoknad={resetSoknad}
            showSubmitButton={showSubmitButton}>
            <Box padBottom="l" margin="xxxl">
                <Guide
                    svg={<ChecklistCircleIcon />}
                    type={'plakat'}
                    kompakt={true}
                    fargetema={'feilmelding'}
                    fullHeight={true}>
                    <strong>Her kontrollerer du at du har gitt oss korrekt informasjon om inntekten din</strong>. Hvis
                    tallene nedenfor ikke stemmer, må du gå tilbake i søknaden og korrigere tallene du har lagt inn. Det
                    er ditt ansvar at opplysningene du gir er riktige.
                </Guide>
            </Box>
            {selvstendigNæringsdrivende && selvstendigBeregnetTilgjengeligSøknadsperiode && (
                <FormSection title="Inntekt som selvstendig næringsdrivende">
                    {isVisible(SoknadFormField.bekrefterSelvstendigInntektIPerioden) && (
                        <BekreftSumRad
                            values={values}
                            editStepID={StepID.SELVSTENDIG}
                            field={SoknadFormField.bekrefterSelvstendigInntektIPerioden}
                            tittel={
                                <>
                                    Inntekt fra selskap i perioden{' '}
                                    <DateRangeView dateRange={selvstendigBeregnetTilgjengeligSøknadsperiode} />
                                </>
                            }
                            sum={selvstendigNæringsdrivende.inntektIPerioden}
                        />
                    )}
                    {isVisible(SoknadFormField.bekrefterSelvstendigInntektI2019) &&
                        selvstendigNæringsdrivende.inntekt2019 && (
                            <BekreftSumRad
                                values={values}
                                editStepID={StepID.SELVSTENDIG}
                                field={SoknadFormField.bekrefterSelvstendigInntektI2019}
                                tittel={<>Inntekt fra selskap i 2019</>}
                                sum={selvstendigNæringsdrivende.inntekt2019}
                            />
                        )}
                    {isVisible(SoknadFormField.bekrefterSelvstendigInntektI2020) &&
                        selvstendigNæringsdrivende.inntekt2020 && (
                            <BekreftSumRad
                                values={values}
                                editStepID={StepID.SELVSTENDIG}
                                field={SoknadFormField.bekrefterSelvstendigInntektI2020}
                                tittel={<>Inntekt fra selskap i januar og februar 2020</>}
                                sum={selvstendigNæringsdrivende.inntekt2020}
                            />
                        )}
                    {isVisible(SoknadFormField.bekrefterSelvstendigFrilanserInntektIPerioden) && (
                        <BekreftSumRad
                            values={values}
                            editStepID={StepID.SELVSTENDIG}
                            field={SoknadFormField.bekrefterSelvstendigFrilanserInntektIPerioden}
                            tittel={
                                <>
                                    Inntekt som frilanser i perioden{' '}
                                    <DateRangeView dateRange={selvstendigBeregnetTilgjengeligSøknadsperiode} />
                                </>
                            }
                            sum={selvstendigNæringsdrivende.inntektIPeriodenSomFrilanser}
                        />
                    )}
                </FormSection>
            )}
            {frilanser &&
                frilanserBeregnetTilgjengeligSønadsperiode &&
                isVisible(SoknadFormField.bekrefterFrilansinntektIPerioden) && (
                    <FormSection title="Inntekt som frilanser">
                        <BekreftSumRad
                            values={values}
                            editStepID={StepID.FRILANSER}
                            field={SoknadFormField.bekrefterFrilansinntektIPerioden}
                            tittel={
                                <>
                                    Inntekt som frilanser i perioden{' '}
                                    <DateRangeView dateRange={frilanserBeregnetTilgjengeligSønadsperiode} />
                                </>
                            }
                            sum={frilanser.inntektIPerioden}
                        />
                        {isVisible(SoknadFormField.bekrefterFrilanserSelvstendigInntektIPerioden) && (
                            <BekreftSumRad
                                values={values}
                                editStepID={StepID.FRILANSER}
                                field={SoknadFormField.bekrefterFrilanserSelvstendigInntektIPerioden}
                                tittel={
                                    <>
                                        Inntekt som selvstendig næringsdrivende i perioden{' '}
                                        <DateRangeView dateRange={frilanserBeregnetTilgjengeligSønadsperiode} />
                                    </>
                                }
                                sum={frilanser.inntektIPeriodenSomSelvstendigNæringsdrivende}
                            />
                        )}
                    </FormSection>
                )}
        </SoknadStep>
    );
};

export default BekreftInntektStep;

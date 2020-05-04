import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { Locale } from 'common/types/Locale';
import ChecklistCircleIcon from '../../assets/ChecklistCircleIcon';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import Guide from '../../components/guide/Guide';
import StopMessage from '../../components/stop-message/StopMessage';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';
import FormSection from '../../pages/intro-page/FormSection';
import SoknadErrorPage from '../../pages/soknad-error-page/SoknadErrorPage';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import { getSoknadRoute } from '../../utils/routeUtils';
import { selvstendigSkalOppgiInntekt2019 } from '../../utils/selvstendigUtils';
import FrilanserInfo from '../info/FrilanserInfo';
import SelvstendigInfo from '../info/SelvstendigInfo';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import BekreftSumRad from './bekreft-sum-rad/BekreftSumRad';
import { BekreftInntektFormQuestions } from './bekreftInntektFormConfig';
import SoknadErrors from '../soknad-errors/SoknadErrors';

const BekreftInntektStep = ({ soknadEssentials, resetSoknad, onValidSubmit }: StepConfigProps) => {
    const { values, setValues } = useFormikContext<SoknadFormData>();
    const { locale } = useIntl();
    const { selvstendigBeregnetTilgjengeligSøknadsperiode, frilanserBeregnetTilgjengeligSønadsperiode } = values;

    const apiValues = mapFormDataToApiData(soknadEssentials, values, locale as Locale);

    if (!apiValues) {
        return (
            <SoknadErrorPage>
                <SoknadErrors.MissingApiDataError />
            </SoknadErrorPage>
        );
    }
    const { selvstendigNæringsdrivende, frilanser } = apiValues;

    const {
        bekrefterFrilansinntektIPerioden,
        bekrefterSelvstendigInntektIPerioden,
        bekrefterSelvstendigInntektI2019,
        bekrefterSelvstendigInntektI2020,
        bekrefterSelvstendigFrilanserInntektIPerioden,
        selvstendigStopReason,
        frilanserStopReason,
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

    const showSubmitButton =
        frilansBekreftet === true && selvstendigBekreftet === true && (frilanserSoknadIsOk || selvstendigSoknadIsOk);

    useEffect(() => {
        setValues({
            ...values,
            bekrefterFrilansinntektIPerioden: YesOrNo.UNANSWERED,
            bekrefterSelvstendigInntektI2020: YesOrNo.UNANSWERED,
            bekrefterSelvstendigInntektI2019: YesOrNo.UNANSWERED,
            bekrefterSelvstendigInntektIPerioden: YesOrNo.UNANSWERED,
            bekrefterSelvstendigFrilanserInntektIPerioden: YesOrNo.UNANSWERED,
        });
    }, []);

    const { isVisible } = BekreftInntektFormQuestions.getVisbility({
        ...values,
        apiValues,
    });

    return (
        <SoknadStep
            id={StepID.BEKREFT_INNTEKT}
            onValidFormSubmit={onValidSubmit}
            resetSoknad={resetSoknad}
            showSubmitButton={showSubmitButton}>
            <Box padBottom="l" margin="xxxl">
                {frilanserSoknadIsOk ||
                    (selvstendigSoknadIsOk && (
                        <Guide
                            svg={<ChecklistCircleIcon />}
                            type={'plakat'}
                            kompakt={true}
                            fargetema={'feilmelding'}
                            fullHeight={true}>
                            <strong>Her kontrollerer du at du har gitt oss korrekt informasjon om inntekten din</strong>
                            .
                            <p>
                                Hvis tallene nedenfor ikke stemmer, må du gå tilbake i søknaden og korrigere tallene du
                                har lagt inn. Det er ditt ansvar at opplysningene du gir er riktige.
                            </p>
                        </Guide>
                    ))}
                {frilanserSoknadIsOk === false && selvstendigSoknadIsOk === false && (
                    <>
                        <Guide
                            svg={<VeilederSVG mood={'uncertain'} />}
                            type={'plakat'}
                            kompakt={true}
                            fargetema={'feilmelding'}
                            fullHeight={false}>
                            Ut fra opplysningene du har gitt, kan du ikke søke om kompensasjon for tapt inntekt som
                            selvstendig næringsdrivende og/eller frilanser. Hva som er årsaken til dette, kan du lese
                            nedenfor.
                        </Guide>
                    </>
                )}
            </Box>
            {selvstendigSoknadIsOk === false && selvstendigStopReason && (
                <FormSection title="Selvstendig næringsdrivende">
                    <StopMessage>
                        {SelvstendigInfo.getMessageForAvslag(
                            selvstendigStopReason,
                            selvstendigSkalOppgiInntekt2019(soknadEssentials.personligeForetak) ? 2019 : 2020
                        )}
                        <p>
                            <Link className="lenke" to={getSoknadRoute(StepID.SELVSTENDIG)}>
                                Gå tilbake til informasjon om selvstendig næringsdrivende
                            </Link>
                        </p>
                    </StopMessage>
                </FormSection>
            )}
            {selvstendigSoknadIsOk && selvstendigNæringsdrivende && selvstendigBeregnetTilgjengeligSøknadsperiode && (
                <>
                    <FormSection title="Inntekt som selvstendig næringsdrivende">
                        {isVisible(SoknadFormField.bekrefterSelvstendigInntektIPerioden) && (
                            <BekreftSumRad
                                values={values}
                                editStepID={StepID.SELVSTENDIG}
                                field={SoknadFormField.bekrefterSelvstendigInntektIPerioden}
                                tittel={
                                    <>
                                        Personinntekt fra næring i perioden{' '}
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
                                    tittel={<>Personinntekt fra næring i 2019</>}
                                    sum={selvstendigNæringsdrivende.inntekt2019}
                                />
                            )}
                        {isVisible(SoknadFormField.bekrefterSelvstendigInntektI2020) &&
                            selvstendigNæringsdrivende.inntekt2020 && (
                                <BekreftSumRad
                                    values={values}
                                    editStepID={StepID.SELVSTENDIG}
                                    field={SoknadFormField.bekrefterSelvstendigInntektI2020}
                                    tittel={<>Personinntekt fra næring i januar og februar 2020</>}
                                    sum={selvstendigNæringsdrivende.inntekt2020}
                                />
                            )}
                    </FormSection>
                    {isVisible(SoknadFormField.bekrefterSelvstendigFrilanserInntektIPerioden) && (
                        <FormSection title="Inntekt som frilanser">
                            <BekreftSumRad
                                values={values}
                                editStepID={StepID.SELVSTENDIG}
                                field={SoknadFormField.bekrefterSelvstendigFrilanserInntektIPerioden}
                                tittel={
                                    <>
                                        Personinntekt fra oppdrag i perioden{' '}
                                        <DateRangeView dateRange={selvstendigBeregnetTilgjengeligSøknadsperiode} />
                                    </>
                                }
                                sum={selvstendigNæringsdrivende.inntektIPeriodenSomFrilanser}
                            />
                        </FormSection>
                    )}
                </>
            )}
            {frilanserSoknadIsOk === false && frilanserStopReason && (
                <FormSection title="Inntekt som frilanser">
                    <StopMessage>
                        {FrilanserInfo.getMessageForAvslag(frilanserStopReason)}
                        <p>
                            <Link className="lenke" to={getSoknadRoute(StepID.FRILANSER)}>
                                Gå tilbake til informasjon om frilans
                            </Link>
                        </p>
                    </StopMessage>
                </FormSection>
            )}
            {frilanser &&
                frilanserBeregnetTilgjengeligSønadsperiode &&
                isVisible(SoknadFormField.bekrefterFrilansinntektIPerioden) && (
                    <>
                        <FormSection title="Inntekt som frilanser">
                            <BekreftSumRad
                                values={values}
                                editStepID={StepID.FRILANSER}
                                field={SoknadFormField.bekrefterFrilansinntektIPerioden}
                                tittel={
                                    <>
                                        Personinntekt fra oppdrag i perioden{' '}
                                        <DateRangeView dateRange={frilanserBeregnetTilgjengeligSønadsperiode} />
                                    </>
                                }
                                sum={frilanser.inntektIPerioden}
                            />
                        </FormSection>
                        {isVisible(SoknadFormField.bekrefterFrilanserSelvstendigInntektIPerioden) && (
                            <FormSection title="Inntekt som selvstendig næringsdrivende">
                                <BekreftSumRad
                                    values={values}
                                    editStepID={StepID.FRILANSER}
                                    field={SoknadFormField.bekrefterFrilanserSelvstendigInntektIPerioden}
                                    tittel={
                                        <>
                                            Personinntekt fra næring i perioden{' '}
                                            <DateRangeView dateRange={frilanserBeregnetTilgjengeligSønadsperiode} />
                                        </>
                                    }
                                    sum={frilanser.inntektIPeriodenSomSelvstendigNæringsdrivende}
                                />
                            </FormSection>
                        )}
                    </>
                )}
        </SoknadStep>
    );
};

export default BekreftInntektStep;

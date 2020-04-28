import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { Panel } from 'nav-frontend-paneler';
import { Element } from 'nav-frontend-typografi';
import { Locale } from 'common/types/Locale';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import ExpandableInfo from '../../components/expandable-content/ExpandableInfo';
import FormSection from '../../pages/intro-page/FormSection';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';
import SoknadStep from '../SoknadStep';
import { StepConfigProps, StepID } from '../stepConfig';
import BekreftSumRad from './bekreft-sum-rad/BekreftSumRad';
import { BekreftInntektFormQuestions } from './bekreftInntektFormConfig';
import SoknadErrorPage from '../../pages/soknad-error-page/SoknadErrorPage';
import Lenke from 'nav-frontend-lenker';

const BekreftInntektStep = ({ soknadEssentials, resetSoknad, onValidSubmit }: StepConfigProps) => {
    const { values, setValues } = useFormikContext<SoknadFormData>();
    const { locale } = useIntl();
    const { selvstendigCalculatedDateRange, frilanserCalculatedDateRange } = values;

    const apiValues = mapFormDataToApiData(soknadEssentials, values, locale as Locale);

    if (!apiValues) {
        return <SoknadErrorPage>Det oppstod en feil under visningen av siden</SoknadErrorPage>;
    }
    const { selvstendigNæringsdrivende, frilanser } = apiValues;

    const veiledning = (
        <ExpandableInfo title="Veiledning">
            <Element>Skattbarinntekt:</Element>
            <p>
                den du har tatt ut og brukt, det som ikke kan skrives av på foretaket. Det vil si at det er
                driftsinntekter minus driftskostnader = Resulat. Resulatet er din skattbare inntekt. også omstalt som
                personinntekt, næringsinntekt
            </p>

            <Element>Perioden:</Element>
            <p>Den er regnet ut slik på bakgrunn av av det du har fylt inn i søkanden.</p>
            <ul>
                <li>
                    Hvis perioden du oppga som dato for inntektstap var før den 16.mars , vil den bli justert til
                    16.mars, for det er den offiselle datoen fra yndighetene med korona inntektstap skal egnes fra.
                </li>

                <li>
                    De første 16 dagene må du dekke selv. Så perioden du må oppgi inntektsopplysninger fra er etter de
                    16 dagene er trukket fra.{' '}
                </li>
            </ul>
        </ExpandableInfo>
    );

    const {
        bekrefterFrilansinntektIPerioden,
        bekrefterSelvstendigInntektIPerioden,
        bekrefterSelvstendigInntektI2019,
        bekrefterSelvstendigInntektI2020,
        bekrefterSjekkAvFrilanserinntektIRegister,
    } = values;

    const spørOmInntektSomFrilanserForSelvstendig: boolean =
        selvstendigNæringsdrivende !== undefined &&
        selvstendigNæringsdrivende.inntektIPeriodenSomFrilanser !== undefined &&
        (values.bekrefterSelvstendigInntektI2019 === YesOrNo.YES ||
            values.bekrefterSelvstendigInntektI2020 === YesOrNo.YES);

    const selvstendigBekreftet = selvstendigNæringsdrivende
        ? bekrefterSelvstendigInntektIPerioden === YesOrNo.YES &&
          (bekrefterSelvstendigInntektI2020 === YesOrNo.YES || bekrefterSelvstendigInntektI2019 === YesOrNo.YES) &&
          (spørOmInntektSomFrilanserForSelvstendig ? bekrefterFrilansinntektIPerioden === YesOrNo.YES : true)
        : true;

    const frilansBekreftet = frilanser
        ? bekrefterFrilansinntektIPerioden === YesOrNo.YES && bekrefterSjekkAvFrilanserinntektIRegister === YesOrNo.YES
        : true;

    const showSubmitButton = frilansBekreftet === true && selvstendigBekreftet === true;

    useEffect(() => {
        setValues({
            ...values,
            bekrefterSjekkAvFrilanserinntektIRegister: YesOrNo.UNANSWERED,
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

    return (
        <SoknadStep
            id={StepID.BEKREFT_INNTEKT}
            onValidFormSubmit={onValidSubmit}
            resetSoknad={resetSoknad}
            showSubmitButton={showSubmitButton}>
            <Box padBottom="l">
                <Panel border={true}>
                    <p>
                        Det er viktig at du kontrollerer at du har gitt oss korrekt informasjon. Dersom tallene ikke
                        stemmer må du endre de for å få de riktige. Det er ditt ansvar at opplysningene er riktige og
                        fullstendige. Inntekten du oppgir skal/ vil være den samme du rapporterer til skatt som
                        skattepliktig inntekt i skattemeldingen (selvangivelsen).
                    </p>
                </Panel>
            </Box>
            {selvstendigNæringsdrivende && selvstendigCalculatedDateRange && (
                <FormSection title="Inntekt som selvstendig næringsdrivende">
                    {isVisible(SoknadFormField.bekrefterSelvstendigInntektIPerioden) && (
                        <BekreftSumRad
                            values={values}
                            editStepID={StepID.SELVSTENDIG}
                            field={SoknadFormField.bekrefterSelvstendigInntektIPerioden}
                            tittel={
                                <>
                                    Inntekt fra selskap i perioden{' '}
                                    <DateRangeView dateRange={selvstendigCalculatedDateRange} />
                                </>
                            }
                            sum={selvstendigNæringsdrivende.inntektIPerioden}
                            info={veiledning}
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
                                info={
                                    <ExpandableInfo title="Veiledning">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eius explicabo
                                        provident sapiente, repudiandae itaque numquam maxime ad fugiat a laudantium
                                        architecto consequatur pariatur nobis labore nulla similique sit accusantium!
                                    </ExpandableInfo>
                                }
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
                                info={
                                    <ExpandableInfo title="Veiledning">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eius explicabo
                                        provident sapiente, repudiandae itaque numquam maxime ad fugiat a laudantium
                                        architecto consequatur pariatur nobis labore nulla similique sit accusantium!
                                    </ExpandableInfo>
                                }
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
                                    <DateRangeView dateRange={selvstendigCalculatedDateRange} />
                                </>
                            }
                            sum={selvstendigNæringsdrivende.inntektIPeriodenSomFrilanser}
                            info={
                                <ExpandableInfo title="Veiledning">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eius explicabo
                                    provident sapiente, repudiandae itaque numquam maxime ad fugiat a laudantium
                                    architecto consequatur pariatur nobis labore nulla similique sit accusantium!
                                </ExpandableInfo>
                            }
                        />
                    )}
                </FormSection>
            )}
            {frilanser && frilanserCalculatedDateRange && isVisible(SoknadFormField.bekrefterFrilansinntektIPerioden) && (
                <FormSection title="Inntekt som frilanser">
                    <BekreftSumRad
                        values={values}
                        editStepID={StepID.FRILANSER}
                        field={SoknadFormField.bekrefterFrilansinntektIPerioden}
                        tittel={
                            <>
                                Inntekt som frilanser i perioden{' '}
                                <DateRangeView dateRange={frilanserCalculatedDateRange} />
                            </>
                        }
                        sum={frilanser.inntektIPerioden}
                        info={
                            <ExpandableInfo title="Veiledning">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eius explicabo provident
                                sapiente, repudiandae itaque numquam maxime ad fugiat a laudantium architecto
                                consequatur pariatur nobis labore nulla similique sit accusantium!
                            </ExpandableInfo>
                        }
                    />
                    {isVisible(SoknadFormField.bekrefterFrilanserSelvstendigInntektIPerioden) && (
                        <BekreftSumRad
                            values={values}
                            editStepID={StepID.FRILANSER}
                            field={SoknadFormField.bekrefterFrilanserSelvstendigInntektIPerioden}
                            tittel={
                                <>
                                    Inntekt som frilanser i perioden{' '}
                                    <DateRangeView dateRange={frilanserCalculatedDateRange} />
                                </>
                            }
                            sum={frilanser.inntektIPeriodenSomSelvstendigNæringsdrivende}
                            info={
                                <ExpandableInfo title="Veiledning">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eius explicabo
                                    provident sapiente, repudiandae itaque numquam maxime ad fugiat a laudantium
                                    architecto consequatur pariatur nobis labore nulla similique sit accusantium!
                                </ExpandableInfo>
                            }
                        />
                    )}
                    {isVisible(SoknadFormField.bekrefterSjekkAvFrilanserinntektIRegister) && (
                        <BekreftSumRad
                            values={values}
                            editStepID={StepID.FRILANSER}
                            field={SoknadFormField.bekrefterSjekkAvFrilanserinntektIRegister}
                            tittel={<>Inntekten NAV har registrert på meg for 2019 er korrekt</>}
                            info={
                                <ExpandableInfo title="Hvordan kan du kontrollere dette?">
                                    <p>
                                        Vi kan dessverre ikke vise inntekten du har registrert som frilanser i denne
                                        søknadsdialogen, men du kan finne og kontrollere dette hos{' '}
                                        <Lenke
                                            href="https://www.skatteetaten.no/skjema/mine-inntekter-og-arbeidsforhold/"
                                            target="_blank">
                                            skatteetaten sine nettsider
                                        </Lenke>{' '}
                                        (åpnes i nytt vindu) .
                                    </p>
                                    <p>
                                        Dersom opplysningene ikke stemmer, må du ta dette med dem som har rapportert
                                        inntekten. NAV kan ikke påvirke eller endre denne informasjonen.
                                    </p>
                                    <p>
                                        Vi anbefaler ikke å sende søknad med feilaktige /u korrekte opplysninger, da du
                                        vil få feilaktig bergeningsgrunnlag. Det er ditt ansvar å sende korrekte
                                        opplysninger til NAV.
                                    </p>
                                </ExpandableInfo>
                            }
                        />
                    )}
                </FormSection>
            )}
        </SoknadStep>
    );
};

export default BekreftInntektStep;

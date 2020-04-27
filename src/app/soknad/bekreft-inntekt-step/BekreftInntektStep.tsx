import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
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

const BekreftInntektStep = ({ soknadEssentials, resetSoknad, onValidSubmit }: StepConfigProps) => {
    const { values, setValues } = useFormikContext<SoknadFormData>();
    const { locale } = useIntl();
    const { selvstendigCalculatedDateRange } = values;

    const { selvstendigNæringsdrivende, frilanser } =
        mapFormDataToApiData(soknadEssentials, values, locale as Locale) || {};

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
                        skattepliktig inntekt i skattemeldingen (selvangivelsen). Alle inntekter og bilag må kunne
                        bokføres etter bokføringsloven § X.
                    </p>
                    <ExpandableInfo title="Les mer om bokføringsloven" filledBackground={false}>
                        <p>
                            <strong>
                                Alle som leverer næringsoppgave og/eller mva-melding til myndighetene er
                                bokføringspliktig.
                            </strong>
                        </p>
                        <p>
                            Bokføring handler om at alle bilag skal registreres, og det skal gjøres på en måte slik at
                            det ikke kan endres senere.
                        </p>
                        <p>
                            Dokumentasjon for bokførte opplysninger som skal oppbevares i fem år etter regnskapsårets
                            slutt, jf. bokføringsloven § 13 annet ledd, jf. første ledd nr. 3. Bokførte opplysninger
                            skal være resultat av faktisk inntrufne hendelser eller regnskapsmessige vurderinger og skal
                            gjelde den bokføringspliktige virksomheten.
                        </p>
                        <p>
                            <Lenke href="https://lovdata.no/dokument/NL/lov/2004-11-19-73" target="_blank">
                                Les mer hos lovdata.no
                            </Lenke>{' '}
                            (åpnes i eget vindu)
                        </p>
                    </ExpandableInfo>
                </Panel>
            </Box>
            {selvstendigNæringsdrivende && selvstendigCalculatedDateRange && (
                <FormSection title="Inntekt som selvstendig næringsdrivende">
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
                    {bekrefterSelvstendigInntektIPerioden === YesOrNo.YES && (
                        <>
                            {selvstendigNæringsdrivende.inntekt2019 !== undefined && (
                                <BekreftSumRad
                                    values={values}
                                    editStepID={StepID.SELVSTENDIG}
                                    field={SoknadFormField.bekrefterSelvstendigInntektI2019}
                                    tittel={<>Inntekt du har tatt ut fra dine selskaper i 2019</>}
                                    sum={selvstendigNæringsdrivende.inntekt2019}
                                    info={
                                        <ExpandableInfo title="Veiledning">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eius explicabo
                                            provident sapiente, repudiandae itaque numquam maxime ad fugiat a laudantium
                                            architecto consequatur pariatur nobis labore nulla similique sit
                                            accusantium!
                                        </ExpandableInfo>
                                    }
                                />
                            )}
                            {selvstendigNæringsdrivende.inntekt2020 !== undefined && (
                                <BekreftSumRad
                                    values={values}
                                    editStepID={StepID.SELVSTENDIG}
                                    field={SoknadFormField.bekrefterSelvstendigInntektI2020}
                                    tittel={<>Inntekt du har tatt ut fra dine selskaper i 2019</>}
                                    sum={selvstendigNæringsdrivende.inntekt2020}
                                    info={
                                        <ExpandableInfo title="Veiledning">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eius explicabo
                                            provident sapiente, repudiandae itaque numquam maxime ad fugiat a laudantium
                                            architecto consequatur pariatur nobis labore nulla similique sit
                                            accusantium!
                                        </ExpandableInfo>
                                    }
                                />
                            )}
                            {spørOmInntektSomFrilanserForSelvstendig &&
                                selvstendigNæringsdrivende.inntektIPeriodenSomFrilanser && (
                                    <>
                                        <BekreftSumRad
                                            values={values}
                                            editStepID={StepID.SELVSTENDIG}
                                            field={SoknadFormField.bekrefterFrilansinntektIPerioden}
                                            tittel={
                                                <>
                                                    Inntekt som frilanser i perioden{' '}
                                                    <DateRangeView dateRange={selvstendigCalculatedDateRange} />
                                                </>
                                            }
                                            sum={selvstendigNæringsdrivende.inntektIPeriodenSomFrilanser}
                                            info={
                                                <ExpandableInfo title="Veiledning">
                                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eius
                                                    explicabo provident sapiente, repudiandae itaque numquam maxime ad
                                                    fugiat a laudantium architecto consequatur pariatur nobis labore
                                                    nulla similique sit accusantium!
                                                </ExpandableInfo>
                                            }
                                        />
                                    </>
                                )}
                        </>
                    )}
                </FormSection>
            )}
            {frilanser && <>Bekreft frilanserinfo</>}
        </SoknadStep>
    );
};

export default BekreftInntektStep;

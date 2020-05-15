import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import SummaryBlock from '../../components/summary-block/SummaryBlock';
import { SelvstendigNæringsdrivendeApiData } from '../../types/SoknadApiData';
import DatoSvar from './DatoSvar';
import KronerSvar from './KronerSvar';
import ApiQuestionsSummary from '../../components/api-questions-summary/ApiQuestionsSummary';

interface Props {
    apiData: SelvstendigNæringsdrivendeApiData;
}

const SelvstendigNæringsdrivendeSummary = ({
    apiData: {
        inntektIPerioden,
        inntektstapStartet,
        inntekt2019,
        inntekt2020,
        inntektIPeriodenSomFrilanser,
        regnskapsfører,
        info,
        opphørtePersonligeForetak,
        spørsmålOgSvar,
    },
}: Props) => (
    <>
        <Undertittel className="sectionTitle">Selvstendig næringsdrivende</Undertittel>
        <SummaryBlock header={'Inntektstapet som selvstendig næringsdrivende startet'}>
            <DatoSvar apiDato={inntektstapStartet} />
        </SummaryBlock>
        <SummaryBlock header={'Periode det søkes for som selvstendig næringsdrivende'}>{info.periode}</SummaryBlock>
        <SummaryBlock header={`Personinntekt fra næring i perioden ${info.periode}`}>
            <KronerSvar verdi={inntektIPerioden} />
        </SummaryBlock>
        {inntekt2019 !== undefined && (
            <SummaryBlock header="Personinntekt fra næring i 2019">
                <KronerSvar verdi={inntekt2019} />
            </SummaryBlock>
        )}
        {inntekt2020 !== undefined && (
            <SummaryBlock header="Personinntekt fra næring i januar og februar 2020">
                <KronerSvar verdi={inntekt2020} />
            </SummaryBlock>
        )}
        {inntektIPeriodenSomFrilanser !== undefined && (
            <SummaryBlock header={`Personinntekt for oppdrag som frilanser i perioden ${info.periode}`}>
                <KronerSvar verdi={inntektIPeriodenSomFrilanser} />
            </SummaryBlock>
        )}
        {opphørtePersonligeForetak && opphørtePersonligeForetak.length > 0 && (
            <SummaryBlock header={`Selskaper avviklet i perioden 2018 - 2020`}>
                <ul className="infoList">
                    {opphørtePersonligeForetak.map(({ navn, opphørsdato, registreringsdato }, idx) => (
                        <li key={idx}>
                            <DatoSvar apiDato={registreringsdato} /> - <DatoSvar apiDato={opphørsdato} />: {navn}
                        </li>
                    ))}
                </ul>
            </SummaryBlock>
        )}
        {regnskapsfører && (
            <SummaryBlock header={`Regnskapsfører`}>
                Navn: {regnskapsfører.navn}. Telefon: {regnskapsfører.telefon}
            </SummaryBlock>
        )}
        <ApiQuestionsSummary spørsmålOgSvar={spørsmålOgSvar} />
    </>
);

export default SelvstendigNæringsdrivendeSummary;

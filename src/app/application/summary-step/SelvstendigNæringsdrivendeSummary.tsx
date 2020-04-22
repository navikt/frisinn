import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import SummaryBlock from '../../components/summary-block/SummaryBlock';
import { SelvstendigNæringsdrivendeApiData } from '../../types/ApplicationApiData';
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
        questions,
    },
}: Props) => (
    <>
        <Undertittel className="sectionTitle">Selvstendig næringsdrivende</Undertittel>
        <SummaryBlock header={'Inntektstapet som selvstendig næringsdrivende startet'}>
            <DatoSvar apiDato={inntektstapStartet} />
        </SummaryBlock>
        <SummaryBlock header={'Periode det søkes for'}>{info.period}</SummaryBlock>
        <SummaryBlock header={`Inntekt som selvstendig næringsdrivende i perioden ${info.period} `}>
            <KronerSvar verdi={inntektIPerioden} />
        </SummaryBlock>
        {inntektIPeriodenSomFrilanser !== undefined && (
            <SummaryBlock header="Inntekt som frilanser i perioden">
                <KronerSvar verdi={inntektIPeriodenSomFrilanser} />
            </SummaryBlock>
        )}
        {inntekt2019 !== undefined && (
            <SummaryBlock header="Inntekt som selvstendig næringsdrivende i 2019">
                <KronerSvar verdi={inntekt2019} />
            </SummaryBlock>
        )}
        {inntekt2020 !== undefined && (
            <SummaryBlock
                header={`Inntekt som selvstendig næringsdrivende i 2020 til og med ${info.lastDayWithNormalIncome}`}>
                <KronerSvar verdi={inntekt2020} />
            </SummaryBlock>
        )}
        {regnskapsfører && (
            <SummaryBlock header={`Regnskapsfører`}>
                Navn: {regnskapsfører.navn}. Telefon: {regnskapsfører.telefon}
            </SummaryBlock>
        )}
        <ApiQuestionsSummary questions={questions} />
    </>
);

export default SelvstendigNæringsdrivendeSummary;

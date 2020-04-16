import React from 'react';
import { Ingress } from 'nav-frontend-typografi';
import SummaryBlock from '../../components/summary-block/SummaryBlock';
import { SelvstendigNæringsdrivendeApiData } from '../../types/ApplicationApiData';
import DatoSvar from './DatoSvar';
import TallSvar from './TallSvar';

interface Props {
    data: SelvstendigNæringsdrivendeApiData;
}

const SelvstendigNæringsdrivendeSummary = ({ data }: Props) => (
    <>
        <Ingress>Selvstendig næringsdrivende</Ingress>
        <SummaryBlock header={'Inntektstapet startet'}>
            <DatoSvar apiDato={data.inntektstapStartetDato} />
        </SummaryBlock>
        <SummaryBlock header="Inntekt 2019">
            <TallSvar verdi={data.inntekt2019} />
        </SummaryBlock>
        <SummaryBlock header="Inntekt i 2020 frem til inntektstap startet">
            <TallSvar verdi={data.inntekt2020} />
        </SummaryBlock>
        <SummaryBlock header="Inntekt i perioden det søkes for">
            <TallSvar verdi={data.inntektIPerioden} />
        </SummaryBlock>
    </>
);

export default SelvstendigNæringsdrivendeSummary;

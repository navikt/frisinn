import React from 'react';
import { Ingress } from 'nav-frontend-typografi';
import SummaryBlock from '../../components/summary-block/SummaryBlock';
import { FrilanserApiData } from '../../types/ApplicationApiData';
import DatoSvar from './DatoSvar';
import TallSvar from './TallSvar';

interface Props {
    apiData: FrilanserApiData;
}

const FrilanserSummary = ({
    apiData: { inntektIPerioden, inntektstapStartet, inntektIPeriodenSomSelvstendigNæringsdrivende },
}: Props) => (
    <>
        <Ingress>Frilanser</Ingress>
        <SummaryBlock header={'Inntektstapet startet'}>
            <DatoSvar apiDato={inntektstapStartet} />
        </SummaryBlock>
        <SummaryBlock header="Inntekt i perioden">
            <TallSvar verdi={inntektIPerioden} />
        </SummaryBlock>
        {inntektIPeriodenSomSelvstendigNæringsdrivende !== undefined && (
            <SummaryBlock header="Inntekt som selvstendig næringsdrivende i perioden">
                <TallSvar verdi={inntektIPeriodenSomSelvstendigNæringsdrivende} />
            </SummaryBlock>
        )}
    </>
);

export default FrilanserSummary;

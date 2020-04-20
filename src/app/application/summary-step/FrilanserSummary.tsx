import React from 'react';
import { Ingress } from 'nav-frontend-typografi';
import SummaryBlock from '../../components/summary-block/SummaryBlock';
import { FrilanserApiData } from '../../types/ApplicationApiData';
import DatoSvar from './DatoSvar';
import KronerSvar from './KronerSvar';

interface Props {
    apiData: FrilanserApiData;
}

const FrilanserSummary = ({
    apiData: { inntektIPerioden, inntektstapStartet, inntektIPeriodenSomSelvstendigNæringsdrivende, info },
}: Props) => (
    <>
        <Ingress>Frilanser</Ingress>
        <SummaryBlock header={'Inntektstapet som frilanser startet'}>
            <DatoSvar apiDato={inntektstapStartet} />
        </SummaryBlock>
        <SummaryBlock header={`Periode det søkes for som frilanser`}>{info.period}</SummaryBlock>
        <SummaryBlock header={`Inntekt som frilanser i perioden ${info.period}`}>
            <KronerSvar verdi={inntektIPerioden} />
        </SummaryBlock>
        {inntektIPeriodenSomSelvstendigNæringsdrivende !== undefined && (
            <SummaryBlock header={`Inntekt som selvstendig næringsdrivende i perioden ${info.period}`}>
                <KronerSvar verdi={inntektIPeriodenSomSelvstendigNæringsdrivende} />
            </SummaryBlock>
        )}
    </>
);

export default FrilanserSummary;

import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import SummaryBlock from '../../components/summary-block/SummaryBlock';
import { FrilanserApiData } from '../../types/ApplicationApiData';
import DatoSvar from './DatoSvar';
import KronerSvar from './KronerSvar';
import ApiQuestionsSummary from '../../components/api-questions-summary/ApiQuestionsSummary';

interface Props {
    apiData: FrilanserApiData;
}

const FrilanserSummary = ({
    apiData: { inntektIPerioden, inntektstapStartet, inntektIPeriodenSomSelvstendigNæringsdrivende, info, questions },
}: Props) => (
    <>
        <Undertittel className="sectionTitle">Frilanser</Undertittel>
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
        <ApiQuestionsSummary questions={questions} />
    </>
);

export default FrilanserSummary;

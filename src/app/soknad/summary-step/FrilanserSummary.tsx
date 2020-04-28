import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import SummaryBlock from '../../components/summary-block/SummaryBlock';
import { FrilanserApiData } from '../../types/SoknadApiData';
import DatoSvar from './DatoSvar';
import KronerSvar from './KronerSvar';
import ApiQuestionsSummary from '../../components/api-questions-summary/ApiQuestionsSummary';
import JaNeiSvar from './JaNeiSvar';

interface Props {
    apiData: FrilanserApiData;
}

const FrilanserSummary = ({
    apiData: {
        inntektIPerioden,
        inntektstapStartet,
        inntektIPeriodenSomSelvstendigNæringsdrivende,
        info,
        erNyetablert,
        questions,
    },
}: Props) => (
    <>
        <Undertittel className="sectionTitle">Frilanser</Undertittel>
        <SummaryBlock header={'Startet som frilanser etter 1. september 2019'}>
            <JaNeiSvar harSvartJa={erNyetablert} />
        </SummaryBlock>
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

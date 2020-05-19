import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import SummaryBlock from '../../components/summary-block/SummaryBlock';
import { FrilanserApiData } from '../../types/SoknadApiData';
import DatoSvar from './DatoSvar';
import KronerSvar from './KronerSvar';
import ApiQuestionsSummary from '../../components/api-questions-summary/ApiQuestionsSummary';

interface Props {
    apiData: FrilanserApiData;
}

const FrilanserSummary = ({
    apiData: {
        inntektIPerioden,
        inntektstapStartet,
        inntektIPeriodenSomSelvstendigNæringsdrivende,
        info,
        spørsmålOgSvar: questions,
    },
}: Props) => (
    <>
        <Undertittel className="sectionTitle">Frilanser</Undertittel>
        <SummaryBlock header={'Inntektstapet som frilanser startet'}>
            <DatoSvar apiDato={inntektstapStartet} />
        </SummaryBlock>
        <SummaryBlock header={`Periode det søkes for som frilanser`}>{info.periode}</SummaryBlock>
        <SummaryBlock header={`Personinntekt for oppdrag i perioden ${info.periode}`}>
            <KronerSvar verdi={inntektIPerioden} />
        </SummaryBlock>
        {inntektIPeriodenSomSelvstendigNæringsdrivende !== undefined && (
            <SummaryBlock
                header={`Personinntekt fra næring som selvstendig næringsdrivende i perioden ${info.periode}`}>
                <KronerSvar verdi={inntektIPeriodenSomSelvstendigNæringsdrivende} />
            </SummaryBlock>
        )}
        <ApiQuestionsSummary spørsmålOgSvar={questions} />
    </>
);

export default FrilanserSummary;

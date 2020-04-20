import React from 'react';
import { Ingress } from 'nav-frontend-typografi';
import SummaryBlock from '../../components/summary-block/SummaryBlock';
import { SelvstendigNæringsdrivendeApiData } from '../../types/ApplicationApiData';
import DatoSvar from './DatoSvar';
import TallSvar from './TallSvar';
// import { DateRange } from '../../utils/dateUtils';
// import DateRangeView from '../../components/date-range-view/DateRangeView';

interface Props {
    apiData: SelvstendigNæringsdrivendeApiData;
    // applicationPeriod: DateRange;
}

const SelvstendigNæringsdrivendeSummary = ({
    // applicationPeriod,
    apiData: { inntektIPerioden, inntektstapStartet, inntekt2019, inntekt2020, inntektIPeriodenSomFrilanser },
}: Props) => (
    <>
        <Ingress>Selvstendig næringsdrivende</Ingress>
        <SummaryBlock header={'Inntektstapet startet'}>
            <DatoSvar apiDato={inntektstapStartet} />
        </SummaryBlock>
        {/* <SummaryBlock header={'Periode det søkes for'}>
            <DateRangeView dateRange={applicationPeriod} extendedFormat={true} />
        </SummaryBlock> */}
        <SummaryBlock header={`Inntekt i perioden `}>
            <TallSvar verdi={inntektIPerioden} />
        </SummaryBlock>
        {inntektIPeriodenSomFrilanser !== undefined && (
            <SummaryBlock header="Inntekt som frilanser i perioden">
                <TallSvar verdi={inntektIPeriodenSomFrilanser} />
            </SummaryBlock>
        )}
        {inntekt2019 !== undefined && (
            <SummaryBlock header="Inntekt 2019">
                <TallSvar verdi={inntekt2019} />
            </SummaryBlock>
        )}
        {inntekt2020 !== undefined && (
            <SummaryBlock header="Inntekt i 2020 frem til inntektstap startet">
                <TallSvar verdi={inntekt2020} />
            </SummaryBlock>
        )}
    </>
);

export default SelvstendigNæringsdrivendeSummary;

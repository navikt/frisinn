import React from 'react';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import DateView from '../../components/date-view/DateView';
import { isValidDateRange, TilgjengeligSøkeperiode } from '../../hooks/useTilgjengeligSøkeperiode';
import { isDateBeforeKoronatiltak } from '../../utils/koronaUtils';

interface Props {
    inntektstapStartetDato: Date;
    tilgjengeligSøkeperiode: TilgjengeligSøkeperiode;
    harAlleredeMottatUtbetalingFraOrdning?: boolean;
}

const TilgjengeligSøkeperiodeInfo = ({
    inntektstapStartetDato,
    tilgjengeligSøkeperiode,
    harAlleredeMottatUtbetalingFraOrdning,
}: Props) => {
    if (isValidDateRange(tilgjengeligSøkeperiode)) {
        const startIsBeforeKoronatiltak = isDateBeforeKoronatiltak(inntektstapStartetDato);
        if (harAlleredeMottatUtbetalingFraOrdning) {
            return (
                <>
                    Du søker nå kompensasjon for{' '}
                    <strong>
                        <DateRangeView dateRange={tilgjengeligSøkeperiode} />
                    </strong>
                    . Du søker for hele måneden selv om du eventuelt har jobbet noe. Vi beregner hva du kan få i
                    kompensasjon for denne måneden, når du senere i søknaden legger inn eventuell inntekt fra jobb.
                </>
            );
        }
        return startIsBeforeKoronatiltak ? (
            <>
                Denne ordningen gjelder fra 14. mars 2020. Du må selv dekke de 16 første dagene med inntektstap. Når
                inntektsstapet ditt startet <DateView date={inntektstapStartetDato} />, og du har dekket de 16 første
                dagene av inntektstapet ditt selv, søker du kompensasjon for perioden{' '}
                <strong>
                    <DateRangeView dateRange={tilgjengeligSøkeperiode} />
                </strong>
                .
            </>
        ) : (
            <>
                Når inntektsstapet ditt startet <DateView date={inntektstapStartetDato} />, og du har dekket de 16
                første dagene av inntektstapet ditt selv, søker du kompensasjon for perioden{' '}
                <strong>
                    <DateRangeView dateRange={tilgjengeligSøkeperiode} />
                </strong>
                .
            </>
        );
    }
    return null;
};
export default TilgjengeligSøkeperiodeInfo;

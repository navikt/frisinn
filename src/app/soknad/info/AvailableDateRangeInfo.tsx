import React from 'react';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import { isDateBeforeKoronatiltak } from '../../utils/koronaUtils';
import { AvailableDateRange, isValidDateRange } from '../../hooks/useAvailableSøknadsperiode';

interface Props {
    inntektstapStartetDato: Date;
    availableDateRange: AvailableDateRange;
}

const AvailableDateRangeInfo = ({ inntektstapStartetDato, availableDateRange }: Props) => {
    if (isValidDateRange(availableDateRange)) {
        const startIsBeforeKoronatiltak = isDateBeforeKoronatiltak(inntektstapStartetDato);
        return startIsBeforeKoronatiltak ? (
            <>
                Denne ordningen gjelder fra 14. mars 2020. Du må selv dekke de 16 første dagene med inntektstap.
                Perioden du søker kompensasjon for er{' '}
                <strong>
                    <DateRangeView dateRange={availableDateRange} />
                </strong>
                .
            </>
        ) : (
            <>
                Perioden du søker kompensasjon for er{' '}
                <strong>
                    <DateRangeView dateRange={availableDateRange} />
                </strong>
                .
            </>
        );
    }
    return null;
};
export default AvailableDateRangeInfo;

import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import { DateRange } from '../../utils/dateUtils';
import { isDateBeforeKoronatiltak } from '../../utils/koronaUtils';

interface Props {
    inntektstapStartetDato: Date;
    availableDateRange: DateRange;
}

const AvailableDateRangeInfo = ({ inntektstapStartetDato, availableDateRange }: Props) => {
    const startIsBeforeKoronatiltak = isDateBeforeKoronatiltak(inntektstapStartetDato);
    return (
        <AlertStripeInfo>
            {startIsBeforeKoronatiltak && (
                <>
                    Denne ordningen gjelder fra 14. mars 2020. Du må selv dekke de 16 første dagene med inntektstap.4
                    Perioden du søker kompensasjon for er{' '}
                    <strong>
                        <DateRangeView dateRange={availableDateRange} />
                    </strong>
                    .
                </>
            )}
            {!startIsBeforeKoronatiltak && (
                <>
                    Denne ordningen gjelder fra 14. mars 2020. Du må selv dekke de 16 første dagene med inntektstap.
                    Perioden du søker kompensasjon for er{' '}
                    <strong>
                        <DateRangeView dateRange={availableDateRange} />
                    </strong>
                    .
                </>
            )}
        </AlertStripeInfo>
    );
};
export default AvailableDateRangeInfo;

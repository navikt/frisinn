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
                    Du må legge inn en dato fra tidligst 16. Mars 2020 eller senere. Dette er datoen denne ordningen
                    gjelder fra. Du må selv dekke de 16 første dagene med inntektstap. Perioden du nå søker om er{' '}
                    <strong>
                        <DateRangeView dateRange={availableDateRange} />
                    </strong>
                    .
                </>
            )}
            {!startIsBeforeKoronatiltak && (
                <>
                    Du må selv dekke de 16 første dagene med inntektstap. Perioden du nå søker om er{' '}
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

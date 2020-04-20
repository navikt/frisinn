import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import DateRangeView from '../../components/date-range-view/DateRangeView';
import DateView from '../../components/date-view/DateView';
import { DateRange, getNumberOfDaysInDateRange } from '../../utils/dateUtils';
import { isDateBeforeKoronatiltak, KORONA_DATE } from '../../utils/koronaUtils';
import { pluralize } from '../../utils/pluralize';

interface Props {
    inntektstapStartetDato: Date;
    availableDateRange: DateRange;
    isLimitedDateRange: boolean;
}

const AvailableDateRangeInfo = ({ inntektstapStartetDato, isLimitedDateRange, availableDateRange }: Props) => {
    const numberOfDays = getNumberOfDaysInDateRange(availableDateRange);
    return (
        <AlertStripeInfo>
            {isDateBeforeKoronatiltak(inntektstapStartetDato) && (
                <Box padBottom="l">
                    Du har valgt en dato som er tidligere enn <DateView date={KORONA_DATE} />, som er første dag du kan
                    få dekket gjennom denne ordningen.
                </Box>
            )}
            {isLimitedDateRange && (
                <>
                    Du må selv dekke de 16 første dagene etter at inntektstapet startet. Perioden du kan søke om er da{' '}
                    <strong>
                        <DateRangeView dateRange={availableDateRange} extendedFormat={true} />
                    </strong>{' '}
                    ({numberOfDays} {pluralize(numberOfDays, 'dag', 'dager')}).
                </>
            )}
        </AlertStripeInfo>
    );
};
export default AvailableDateRangeInfo;

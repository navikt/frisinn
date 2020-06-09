import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';

function getUkedag(dato: Date): number {
    return moment.utc(dato).isoWeekday();
}

export function erUttaksdag(dato: Date): boolean {
    return getUkedag(dato) !== 6 && getUkedag(dato) !== 7;
}

export function isValidDateRange(dateRange: Partial<DateRange>): dateRange is DateRange {
    return (
        dateRange.from !== undefined &&
        dateRange.to !== undefined &&
        moment(dateRange.from).isSameOrBefore(dateRange.to, 'day')
    );
}

export function getAntallUttaksdagerITidsperiode(dateRange: Partial<DateRange>): number {
    if (!isValidDateRange(dateRange)) {
        return 0;
    }
    const fom = moment(dateRange.from);
    const tom = moment(dateRange.to);
    let antall = 0;
    while (fom.isSameOrBefore(tom, 'day')) {
        if (erUttaksdag(fom.toDate())) {
            antall++;
        }
        fom.add(24, 'hours');
    }
    return antall;
}

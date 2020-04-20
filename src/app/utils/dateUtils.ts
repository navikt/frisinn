import moment from 'moment';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

export * from '@navikt/sif-common-core/lib/utils/dateUtils';

export const isSameDate = (date1: Date | undefined, date2: Date | undefined): boolean => {
    if (date1 === undefined && date2 === undefined) {
        return true;
    }
    if (date1 === undefined || date2 === undefined) {
        return false;
    }
    return moment(date1).isSame(date2, 'day');
};

export const getNumberOfDaysInDateRange = (dateRange: DateRange): number => {
    return moment(dateRange.to).diff(dateRange.from, 'days') + 1;
};

export const getPreviousDate = (date: Date): Date => moment(date).subtract(1, 'day').toDate();

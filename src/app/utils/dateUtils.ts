import { apiStringDateToDate, DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';

export * from '@navikt/sif-common-core/lib/utils/dateUtils';

export const MIN_DATE_PERIODEVELGER: Date = apiStringDateToDate('2020-02-01');

export const isSameDate = (date1: Date | undefined, date2: Date | undefined): boolean => {
    if (date1 === undefined && date2 === undefined) {
        return true;
    }
    if (date1 === undefined || date2 === undefined) {
        return false;
    }
    return moment(date1).isSame(date2, 'day');
};

export const getSisteGyldigeDagForInntektstapIPeriode = (dateRange: DateRange): Date => {
    return moment(dateRange.to).endOf('day').subtract(16, 'days').toDate();
};

export const getSøknadsfristForPeriode = (søknadsperiode: DateRange): Date => {
    if (formatDateToApiFormat(søknadsperiode.to) === '2020-04-30') {
        return moment(apiStringDateToDate('2020-06-03')).endOf('day').toDate();
    }
    /** Forlenget frist for å søke for juni */
    if (formatDateToApiFormat(søknadsperiode.to) === '2020-06-30') {
        return moment(apiStringDateToDate('2020-08-06')).endOf('day').toDate();
    }
    return moment(søknadsperiode.to).add(1, 'month').endOf('month').endOf('day').toDate();
};

export const getMonthName = (date: Date): string => {
    return moment(date).format('MMMM');
};

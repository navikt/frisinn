import moment from 'moment';
import { apiStringDateToDate, DateRange } from '../../../utils/dateUtils';

export const getHistoriskMaksOpprettetDato = (inntektstapStartetDate: Date): Date => {
    return moment
        .min(moment(apiStringDateToDate('2020-03-12')), moment(inntektstapStartetDate).subtract(1, 'day'))
        .toDate();
};

export const getHistoriskAvsluttetDateRange = (
    inntektstapStartetDate: Date,
    opprettetDato: Date | undefined
): DateRange => {
    const minFromDate = apiStringDateToDate('2019-01-01');
    const minToDate = apiStringDateToDate('2019-01-01');
    const maxToDate = apiStringDateToDate('2020-03-12');
    const from: Date = opprettetDato ? moment.max(moment(opprettetDato), moment(minToDate)).toDate() : minFromDate;
    const to: Date = inntektstapStartetDate
        ? moment.min(moment(maxToDate), moment(inntektstapStartetDate).subtract(1, 'day')).toDate()
        : maxToDate;
    return {
        from,
        to,
    };
};

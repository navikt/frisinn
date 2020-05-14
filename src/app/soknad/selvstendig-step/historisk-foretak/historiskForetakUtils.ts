import moment from 'moment';
import { apiStringDateToDate, DateRange } from '../../../utils/dateUtils';

export const historiskForetakMinDate = apiStringDateToDate('2018-01-01');
export const historiskForetakMaxDate = apiStringDateToDate('2020-03-12');

export const getHistoriskMaksOpprettetDato = (inntektstapStartetDate: Date): Date => {
    return moment.min(moment(historiskForetakMaxDate), moment(inntektstapStartetDate).subtract(1, 'day')).toDate();
};

export const getHistoriskAvsluttetDateRange = (
    inntektstapStartetDate: Date,
    opprettetDato: Date | undefined
): DateRange => {
    const minFromDate = historiskForetakMinDate;
    const minToDate = historiskForetakMinDate;
    const maxToDate = historiskForetakMaxDate;
    const from: Date = opprettetDato ? moment.max(moment(opprettetDato), moment(minToDate)).toDate() : minFromDate;
    const to: Date = inntektstapStartetDate
        ? moment.min(moment(maxToDate), moment(inntektstapStartetDate).subtract(1, 'day')).toDate()
        : maxToDate;
    return {
        from,
        to,
    };
};

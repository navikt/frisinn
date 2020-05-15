import moment from 'moment';
import { apiStringDateToDate, DateRange } from '../../../utils/dateUtils';

export const minAvsluttetDate = apiStringDateToDate('2018-01-01');
export const maxAvsluttetDate = apiStringDateToDate('2020-03-12');

export const getAvsluttetSelskapMaksOpprettetDato = (inntektstapStartetDate: Date): Date => {
    return moment.min(moment(maxAvsluttetDate), moment(inntektstapStartetDate).subtract(1, 'day')).toDate();
};

export const getAvsluttetDateRange = (inntektstapStartetDate: Date, opprettetDato: Date | undefined): DateRange => {
    const minFromDate = minAvsluttetDate;
    const minToDate = minAvsluttetDate;
    const maxToDate = maxAvsluttetDate;
    const from: Date = opprettetDato ? moment.max(moment(opprettetDato), moment(minToDate)).toDate() : minFromDate;
    const to: Date = inntektstapStartetDate
        ? moment.min(moment(maxToDate), moment(inntektstapStartetDate).subtract(1, 'day')).toDate()
        : maxToDate;
    return {
        from,
        to,
    };
};

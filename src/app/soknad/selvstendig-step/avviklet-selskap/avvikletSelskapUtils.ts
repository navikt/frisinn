import moment from 'moment';
import { apiStringDateToDate, DateRange } from '../../../utils/dateUtils';

export const avvikletSelskapMinAvvikletDate = apiStringDateToDate('2018-01-01');
export const avvikletSelskapMaxAvvikletDate = apiStringDateToDate('2020-03-12');

export const getAvvikletSelskapMaksOpprettetDato = (inntektstapStartetDate: Date): Date => {
    return moment
        .min(moment(avvikletSelskapMaxAvvikletDate), moment(inntektstapStartetDate).subtract(1, 'day'))
        .toDate();
};

export const getAvsluttetDateRange = (inntektstapStartetDate: Date, opprettetDato: Date | undefined): DateRange => {
    const minFromDate = avvikletSelskapMinAvvikletDate;
    const minToDate = avvikletSelskapMinAvvikletDate;
    const maxToDate = avvikletSelskapMaxAvvikletDate;
    const from: Date = opprettetDato ? moment.max(moment(opprettetDato), moment(minToDate)).toDate() : minFromDate;
    const to: Date = inntektstapStartetDate
        ? moment.min(moment(maxToDate), moment(inntektstapStartetDate).subtract(1, 'day')).toDate()
        : maxToDate;
    return {
        from,
        to,
    };
};

import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';

export const KORONA_DATE: Date = apiStringDateToDate('2020-03-16');

export const isDateBeforeKoronatiltak = (date: Date): boolean => {
    return moment(date).isBefore(KORONA_DATE, 'day');
};

import moment from 'moment';
import { apiStringDateToDate, DateRange } from '../../../utils/dateUtils';

export const minAvsluttetDate = apiStringDateToDate('2018-01-01');
export const maxAvsluttetDate = apiStringDateToDate('2020-03-12');

export const getPeriodeForAvsluttaSelskaper = (tidligsteRegistreringsdato: Date): DateRange | undefined => {
    if (moment(tidligsteRegistreringsdato).isBefore(minAvsluttetDate)) {
        return undefined;
    }
    return {
        from: minAvsluttetDate,
        to: tidligsteRegistreringsdato,
    };
};

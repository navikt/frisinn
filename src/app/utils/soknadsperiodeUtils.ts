import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import moment from 'moment';

export const erÅpnetForAndregangssøknad = (søknadsperiode: DateRange): boolean => {
    return moment(søknadsperiode.from).isAfter(apiStringDateToDate('2020-04-30'), 'day');
};

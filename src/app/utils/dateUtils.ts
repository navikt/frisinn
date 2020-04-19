import moment from 'moment';

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

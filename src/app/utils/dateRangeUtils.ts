import { DateRange, prettifyDateFull, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';

export const formatDateRange = (dateRange: DateRange, extendedFormat = true, onlyYears?: boolean): string => {
    if (onlyYears) {
        const fromYear = dateRange.from.getFullYear();
        const toYear = dateRange.to.getFullYear();
        if (fromYear === toYear) {
            return `${fromYear}`;
        }
        return `${fromYear}-${toYear}`;
    }
    return extendedFormat
        ? `${prettifyDateFull(dateRange.from)} - ${prettifyDateFull(dateRange.to)}`
        : `${prettifyDate(dateRange.from)} - ${prettifyDate(dateRange.to)}`;
};

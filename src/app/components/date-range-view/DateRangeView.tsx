import React from 'react';
import { DateRange, prettifyDate, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    dateRange: DateRange;
    extendedFormat?: boolean;
    onlyYears?: boolean;
}

export const formatDateRange = (dateRange: DateRange, extendedFormat = true, onlyYears?: boolean): string => {
    if (onlyYears) {
        const fromYear = dateRange.from.getFullYear();
        const toYear = dateRange.to.getFullYear();
        if (fromYear === toYear) {
            return `${fromYear}`;
        }
        return `${fromYear} - ${toYear}`;
    }
    return extendedFormat
        ? `${prettifyDateFull(dateRange.from)} - ${prettifyDateFull(dateRange.to)}`
        : `${prettifyDate(dateRange.from)}  - ${prettifyDate(dateRange.to)}`;
};

const DateRangeView = ({ dateRange, extendedFormat = true, onlyYears }: Props) => (
    <span style={{ whiteSpace: 'nowrap' }}>{formatDateRange(dateRange, extendedFormat, onlyYears)}</span>
);

export default DateRangeView;

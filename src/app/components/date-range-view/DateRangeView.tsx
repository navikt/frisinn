import React from 'react';
import { prettifyDate, DateRange, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    dateRange: DateRange;
    extendedFormat?: boolean;
}

export const formatDateRange = (dateRange: DateRange, extendedFormat = false): string => {
    return extendedFormat
        ? `${prettifyDateExtended(dateRange.from)} - ${prettifyDateExtended(dateRange.to)}`
        : `${prettifyDate(dateRange.from)}  - ${prettifyDate(dateRange.to)}`;
};
const DateRangeView = ({ dateRange, extendedFormat = false }: Props) => (
    <span>{formatDateRange(dateRange, extendedFormat)}</span>
);

export default DateRangeView;

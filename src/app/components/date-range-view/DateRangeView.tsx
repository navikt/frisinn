import React from 'react';
import { DateRange, prettifyDate, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    dateRange: DateRange;
    extendedFormat?: boolean;
}

export const formatDateRange = (dateRange: DateRange, extendedFormat = true): string => {
    return extendedFormat
        ? `${prettifyDateExtended(dateRange.from)} - ${prettifyDateExtended(dateRange.to)}`
        : `${prettifyDate(dateRange.from)}  - ${prettifyDate(dateRange.to)}`;
};

const DateRangeView = ({ dateRange, extendedFormat = true }: Props) => (
    <span style={{ whiteSpace: 'nowrap' }}>{formatDateRange(dateRange, extendedFormat)}</span>
);

export default DateRangeView;

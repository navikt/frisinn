import React from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatDateRange } from '../../utils/dateRangeUtils';

interface Props {
    dateRange: DateRange;
    extendedFormat?: boolean;
    onlyYears?: boolean;
}

const DateRangeView = ({ dateRange, extendedFormat = true, onlyYears }: Props) => (
    <span style={{ whiteSpace: 'nowrap' }}>{formatDateRange(dateRange, extendedFormat, onlyYears)}</span>
);

export default DateRangeView;

import React from 'react';
import { prettifyDate, DateRange, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    dateRange: DateRange;
    extendedFormat?: boolean;
}

const DateRangeView = ({ dateRange, extendedFormat = false }: Props) => (
    <span>
        {extendedFormat
            ? `${prettifyDateExtended(dateRange.from)} - ${prettifyDateExtended(dateRange.to)}`
            : `${prettifyDate(dateRange.from)}  - ${prettifyDate(dateRange.to)}`}
    </span>
);

export default DateRangeView;

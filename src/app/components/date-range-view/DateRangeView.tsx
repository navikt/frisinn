import React from 'react';
import { prettifyDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    dateRange: DateRange;
}

const DateRangeView = ({ dateRange }: Props) => (
    <span>
        {prettifyDate(dateRange.from)} - {prettifyDate(dateRange.to)}
    </span>
);

export default DateRangeView;

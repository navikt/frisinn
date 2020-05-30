import React from 'react';
import moment from 'moment';

type DateFormat = 'default' | 'monthAndYear';

interface Props {
    date: Date;
    format?: DateFormat;
    nowrap?: boolean;
}

export const formatDate = (date: Date, dateFormat: DateFormat = 'default'): string => {
    switch (dateFormat) {
        case 'monthAndYear':
            return moment(date).format(' MMMM YYYY, HH:mm');
        default:
            return moment(date).format('D. MMMM YYYY, HH:mm');
    }
};

const DateTimeView = ({ date, format = 'default', nowrap = true }: Props) => (
    <span style={nowrap ? { whiteSpace: 'nowrap' } : undefined}>{formatDate(date, format)}</span>
);

export default DateTimeView;

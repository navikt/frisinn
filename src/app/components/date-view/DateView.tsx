import React from 'react';
import moment from 'moment';

type DateFormat = 'default' | 'monthAndYear';

interface Props {
    date: Date;
    format?: DateFormat;
    nowrap?: boolean;
}
const formatDate = (date: Date, dateFormat: DateFormat): string => {
    switch (dateFormat) {
        case 'monthAndYear':
            return moment(date).format(' MMM YYYY');
        default:
            return moment(date).format('D. MMM YYYY');
    }
};

const DateView = ({ date, format = 'default', nowrap = true }: Props) => (
    <span style={nowrap ? { whiteSpace: 'nowrap' } : undefined}>{formatDate(date, format)}</span>
);

export default DateView;

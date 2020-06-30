import React from 'react';
import moment from 'moment';

type DateFormat = 'default' | 'monthAndYear' | 'dateAndMonth' | 'dateAndMonthAndYear';

interface Props {
    date: Date;
    format?: DateFormat;
    nowrap?: boolean;
}

export const formatDate = (date: Date, dateFormat: DateFormat = 'default'): string => {
    switch (dateFormat) {
        case 'dateAndMonth':
            return moment(date).format('D. MMMM');
        case 'dateAndMonthAndYear':
            return moment(date).format('D. MMMM YYYY');
        case 'monthAndYear':
            return moment(date).format(' MMMM YYYY');
        default:
            return moment(date).format('D. MMMM YYYY');
    }
};

const DateView = ({ date, format = 'default', nowrap = true }: Props) => (
    <span style={nowrap ? { whiteSpace: 'nowrap' } : undefined}>{formatDate(date, format)}</span>
);

export default DateView;

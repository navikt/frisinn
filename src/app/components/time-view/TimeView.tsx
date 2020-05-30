import React from 'react';
import moment from 'moment';

interface Props {
    date: Date;
    nowrap?: boolean;
}

export const formatDate = (date: Date): string => {
    return moment(date).format('HH:mm');
};

const TimeView = ({ date, nowrap = true }: Props) => (
    <span style={nowrap ? { whiteSpace: 'nowrap' } : undefined}>{formatDate(date)}</span>
);

export default TimeView;

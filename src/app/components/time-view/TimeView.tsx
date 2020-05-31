import React from 'react';
import moment from 'moment';

interface Props {
    date: Date;
    nowrap?: boolean;
}

const formatTime = (date: Date): string => {
    return moment(date).format('HH:mm');
};

const TimeView = ({ date, nowrap = true }: Props) => (
    <span style={nowrap ? { whiteSpace: 'nowrap' } : undefined}>{formatTime(date)}</span>
);

export default TimeView;

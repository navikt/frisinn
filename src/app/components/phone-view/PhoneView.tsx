import React from 'react';

interface Props {
    children: React.ReactNode;
    nowrap?: boolean;
}

const PhoneView = ({ nowrap = true, children }: Props) => (
    <span style={nowrap ? { whiteSpace: 'nowrap' } : undefined}>{children}</span>
);

export default PhoneView;

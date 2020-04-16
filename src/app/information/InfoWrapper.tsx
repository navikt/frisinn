import React from 'react';
import './infoWrapper.less';

interface Props {
    children: React.ReactNode;
}

const InfoWrapper = ({ children }: Props) => <div className="infoWrapper">{children}</div>;

export default InfoWrapper;

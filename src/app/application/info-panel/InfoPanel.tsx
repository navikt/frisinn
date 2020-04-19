import React from 'react';
import { Panel } from 'nav-frontend-paneler';

interface Props {
    children: React.ReactNode;
}

const InfoPanel = ({ children }: Props) => (
    <div className="infoPanel">
        <Panel border={true}>{children}</Panel>
    </div>
);

export default InfoPanel;

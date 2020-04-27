import React, { useState } from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { guid } from 'nav-frontend-js-utils';
import { Normaltekst } from 'nav-frontend-typografi';
import CollapsableContainer from './CollapsableContainer';
import InfoToggleButton from './InfoToggleButton';
import './expandableInfo.less';

interface Props {
    children: React.ReactNode;
    title?: string;
    closeTitle?: string;
    initialOpen?: boolean;
    filledBackground?: boolean;
}

const bem = bemUtils('expandableInfo');

const ExpandableInfo = ({ children, initialOpen, closeTitle, title, filledBackground = true }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(initialOpen || false);
    const [contentId] = useState(guid());

    return (
        <div className={bem.block}>
            <div className={bem.element('toggler', isOpen ? 'open' : undefined)}>
                <InfoToggleButton onToggle={() => setIsOpen(!isOpen)} isOpen={isOpen}>
                    <Normaltekst tag="span">{isOpen ? closeTitle || title : title}</Normaltekst>
                </InfoToggleButton>
            </div>
            <div className={bem.element('content')} id={contentId}>
                <CollapsableContainer isOpen={isOpen} animated={true}>
                    {filledBackground ? <AlertStripeInfo>{children}</AlertStripeInfo> : children}
                </CollapsableContainer>
            </div>
        </div>
    );
};

export default ExpandableInfo;

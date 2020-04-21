import * as React from 'react';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import NavFrontendChevron from 'nav-frontend-chevron';
import './infoToggleButton.less';

const cls = bemUtils('infoToggleButton');

interface Props {
    children: React.ReactNode;
    onToggle: () => void;
    isOpen?: boolean;
}

const InfoToggleButton = (props: Props) => {
    const { isOpen = false, children, onToggle } = props;
    return (
        <ActionLink className={cls.block} onClick={onToggle} aria-expanded={isOpen}>
            <span className={cls.element('content')}>
                <span className={cls.element('label')}>{children}</span>
                <span className={cls.element('chevron')}>
                    <NavFrontendChevron type={isOpen ? 'opp' : 'ned'} />
                </span>
            </span>
        </ActionLink>
    );
};

export default InfoToggleButton;

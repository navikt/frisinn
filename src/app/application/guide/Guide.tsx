import React from 'react';
import Veilederpanel, { VeilederpanelProps } from 'nav-frontend-veilederpanel';
import './guide.less';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';

interface Props extends VeilederpanelProps {
    children: React.ReactNode;
    fullHeight?: boolean;
}

const bem = bemUtils('guide');

const Guide = (props: Props) => {
    const { fullHeight = false, ...rest } = props;
    return (
        <div className={bem.classNames(bem.block, bem.modifierConditional('fullHeight', fullHeight))}>
            <Veilederpanel {...rest} />
        </div>
    );
};

export default Guide;

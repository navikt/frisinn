import React from 'react';
import CheckSVG from '../../assets/CheckSVG';
import './bigSuccessCheck.less';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';

interface Props {
    children: React.ReactNode;
    direction?: 'vertical' | 'horizontal';
    size?: number;
}

const bem = bemUtils('bigSuccessCheck');

const BigSuccessCheck = ({ children, direction = 'vertical', size = 3 }: Props) => (
    <div className={bem.classNames(bem.block, bem.modifier(direction))}>
        <span className={bem.element('svg')} role="presentation" aria-hidden={true}>
            <CheckSVG width={`${size}rem`} height={`${size}rem`} />
        </span>
        <span className={bem.element('title')}>{children}</span>
    </div>
);

export default BigSuccessCheck;

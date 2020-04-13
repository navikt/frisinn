import React from 'react';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';

interface Props {
    isLoading: boolean;
    contentRenderer: () => React.ReactNode;
}

const bem = bemUtils('loadWrapper');

const LoadWrapper = ({ isLoading, contentRenderer }: Props) => (
    <div className={bem.classNames(bem.block, bem.modifierConditional('loading', isLoading))}>
        <div className={bem.element('loader')}>
            {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', minHeight: '15rem', alignItems: 'center' }}>
                    <LoadingSpinner type="XXL" />
                </div>
            )}
        </div>
        {!isLoading && <>{contentRenderer()}</>}
    </div>
);

export default LoadWrapper;

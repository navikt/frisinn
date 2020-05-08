import React from 'react';
import useTilgjengelig from '../../hooks/useTilgjengelig';
import LoadWrapper from '../load-wrapper/LoadWrapper';
import NotOpenPage from '../../pages/not-open-page/NotOpenPage';

interface Props {
    tilgjengenligRender: () => React.ReactNode;
}

const TilgjengeligCheck = ({ tilgjengenligRender }: Props) => {
    const tilgjengelig = useTilgjengelig();
    return (
        <LoadWrapper
            isLoading={tilgjengelig.isLoading}
            contentRenderer={() => {
                if (tilgjengelig.isTilgjengelig) {
                    return tilgjengenligRender();
                }
                return <NotOpenPage />;
            }}
        />
    );
};

export default TilgjengeligCheck;

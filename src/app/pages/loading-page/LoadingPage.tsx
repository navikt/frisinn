import React from 'react';
import LoadingSpinner from 'common/components/loading-spinner/LoadingSpinner';
import Page from 'common/components/page/Page';

const LoadingPage: React.FunctionComponent = () => {
    return (
        <Page title="Henter informasjon">
            <div style={{ display: 'flex', justifyContent: 'center', minHeight: '15rem', alignItems: 'center' }}>
                <LoadingSpinner type="XXL" />
            </div>
        </Page>
    );
};

export default LoadingPage;

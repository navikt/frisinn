import React from 'react';
import ErrorPage from '../../components/error-page/ErrorPage';
import ErrorGuide from '../../components/error-guide/ErrorGuide';
import { Ingress } from 'nav-frontend-typografi';

const NotOpenPage: React.StatelessComponent<{}> = () => {
    return (
        <ErrorPage pageTitle="Søknaden er ikke tilgjengelig">
            <ErrorGuide title="Søknaden er dessverre ikke tilgjengelig" stillHappy={false}>
                <Ingress tag="div">Vi jobber så raskt vi kan med å få den tilgjengelig.</Ingress>
            </ErrorGuide>
        </ErrorPage>
    );
};

export default NotOpenPage;

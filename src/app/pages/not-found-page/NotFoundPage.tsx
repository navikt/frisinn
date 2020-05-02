import React from 'react';
import { Ingress } from 'nav-frontend-typografi';
import ErrorGuide from '../../components/error-guide/ErrorGuide';
import ErrorPage from '../../components/error-page/ErrorPage';

const NotFoundPage: React.FunctionComponent = () => {
    return (
        <ErrorPage pageTitle="Side ikke funnet">
            <ErrorGuide title="Du har kommet til en side som ikke finnes">
                <Ingress>Vennligst gå tilbake</Ingress>
            </ErrorGuide>
        </ErrorPage>
    );
};

export default NotFoundPage;

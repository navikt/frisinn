import React from 'react';
import ErrorPage from '../../components/error-page/ErrorPage';
import ErrorGuide from '../../components/error-guide/ErrorGuide';
import { Ingress } from 'nav-frontend-typografi';

const NotOpenPage: React.StatelessComponent<{}> = () => {
    return (
        <ErrorPage pageTitle="Søknaden er ikke tilgjengelig">
            <ErrorGuide title="Søknaden er ikke tilgjengelig" stillHappy={false}>
                <Ingress>Du kan dessverre ikke bruke denne søknaden nå. Prøv igjen litt senere.</Ingress>
            </ErrorGuide>
        </ErrorPage>
    );
};

export default NotOpenPage;

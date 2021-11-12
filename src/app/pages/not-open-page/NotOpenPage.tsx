import React from 'react';
import ErrorPage from '../../components/error-page/ErrorPage';
import ErrorGuide from '../../components/error-guide/ErrorGuide';
import { Ingress } from 'nav-frontend-typografi';

const isClosed = false;

const NotOpenPage: React.StatelessComponent<{}> = () => {
    return (
        <ErrorPage pageTitle="Søknaden er ikke tilgjengelig">
            {isClosed ? (
                <ErrorGuide title="Søknaden er ikke tilgjengelig" stillHappy={false}>
                    <Ingress tag="div">
                        Ordningen opphørte 30. september 2021, men det er lagt frem forslag om at ordningen skal
                        forlenges ut 2021. Vi oppdaterer informasjonen på denne siden når Stortinget har vurdert
                        forslaget og fattet et nytt vedtak for ordningen.
                    </Ingress>
                </ErrorGuide>
            ) : (
                <ErrorGuide title="Søknaden er dessverre ikke tilgjengelig" stillHappy={false}>
                    <Ingress tag="div">Vi jobber så raskt vi kan med å få den tilgjengelig.</Ingress>
                </ErrorGuide>
            )}
        </ErrorPage>
    );
};

export default NotOpenPage;
